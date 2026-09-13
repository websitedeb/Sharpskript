import type { CstNode, IToken } from "chevrotain";

type Variable = {
    name: string;
    scope: string;
    type: string;
    declaration: string;
    isNullable: boolean;
    value: string;
};

export class SemanticAnalyzer {
    private variables = new Map<string, Variable>();

    analyze(cst: CstNode) {
        this.visitProgram(cst);
    }

    private visitProgram(node: CstNode) {
        const statements = Object.values(node.children)
            .flat() as CstNode[];

        for (const statement of statements.sort((left, right) => this.startOffset(left) - this.startOffset(right))) {
            switch (statement.name) {
                case "variableStatement":
                    this.visitVariableStatement(statement);
                    break;
                case "printStatement":
                    this.visitPrintStatement(statement);
                    break;
                case "reAssignmentStatement":
                    this.visitReStatement(statement);
                    break;
                case "expressionStatement":
                    this.visitExpressionStatement(statement);
                    break;
            }
        }
    }

    private visitPrintStatement(node: CstNode) {}

    private visitVariableStatement(node: CstNode) {
        const scopeNode = node.children.scope?.[0] as CstNode;
        const typeNode = node.children.type?.[0] as CstNode;
        const declarationNode = node.children.declaration?.[0] as CstNode;
        const valueNode = node.children.value?.[0] as CstNode;
        const isNullable = node.children.Nullable !== undefined;

        const identifier = node.children.Identifier?.[0] as IToken;

        const name = identifier.image;

        const scope = this.getScope(scopeNode);
        const type = this.getType(typeNode);
        const declaration = this.getDeclaration(declarationNode);

        if (this.variables.has(name)) {
            throw new Error(
                `Variable '${name}' has already been declared.`
            );
        }

        if (!this.isValueAssignableTo(type, valueNode, isNullable)) {
            throw new Error(
                `Assigned value is not valid for variable '${name}' of type '${type}'.`
            );
        }

        if (type != "obj") {
            this.variables.set(name, {
                name,
                scope,
                type,
                declaration,
                value: this.describeExpression(valueNode),
                isNullable
            });   
        } 
        else {
            const pairs = this.objDescribe(valueNode);

            const objfunc = (
                pair: Record<string, any>,
                parentName: string
            ): void => {
                for (const [key, value] of Object.entries(pair)) {
                    const currentName = `${parentName}.${key}`;

                    if (this.getTypeofValue(value) != "obj") {
                        this.variables.set(currentName, {
                            name: currentName,
                            scope,
                            type: this.getTypeofValue(value),
                            declaration,
                            value: value.toString(),
                            isNullable
                        });
                    } else {
                        objfunc(value, currentName);
                    }
                }
            };

            objfunc(pairs, name);
        }
    }

    private getTypeofValue(value : any): string {
        if (typeof value === "string") {
            return "string";
        }
        else if (typeof value === "number") {
            return Number.isInteger(value) ? "integer" : "double";
        }
        else if (typeof value === "boolean" || value === "true" || value === "false") {
            return "boolean";
        }
        else if (typeof value === "object" && value !== null) {
            return "obj";
        }
        else if (value.startsWith('\'') && value.endsWith('\'')) {
            return "char";
        }
        else {
            throw new Error(`Unknown type for value: ${value}`);
        }
    }

    private objDescribe(node: CstNode): Record<string, any> {
        const tokens = this.collectTokens(node);
        let index = 0;

        const parseObject = (): Record<string, any> => {
            const result: Record<string, any> = {};

            if (tokens[index]?.image === "{") {
                index++;
            }

            while (index < tokens.length && tokens[index]?.image !== "}") {
                const keyToken = tokens[index];
                if (!keyToken) {
                    throw new Error("Expected object key");
                }
                const key = keyToken.image;
                index++;

                if (tokens[index]?.image === ":") {
                    index++;
                } else {
                    throw new Error(`Expected ':' after key '${key}'`);
                }

                let value: any;

                if (tokens[index]?.image === "{") {
                    value = parseObject();
                } else {
                    const expressionTokens: string[] = [];

                    while (
                        index < tokens.length &&
                        tokens[index]?.image !== "," &&
                        tokens[index]?.image !== "}"
                    ) {
                        const token = tokens[index];
                        if (!token) {
                            break;
                        }
                        expressionTokens.push(token.image);
                        index++;
                    }

                    const expression = expressionTokens.join("");

                    if (expression.startsWith('"') && expression.endsWith('"')) {
                        value = expression.slice(1, -1);
                    } else if (!isNaN(Number(expression))) {
                        value = Number(expression);
                    } else if (expression === "true") {
                        value = true;
                    } else if (expression === "false") {
                        value = false;
                    } else {
                        value = expression;
                    }
                }

                result[key] = value;

                if (tokens[index]?.image === ",") {
                    index++;
                }
            }

            if (tokens[index]?.image === "}") {
                index++;
            }

            return result;
        };

        return parseObject();
    }

    private visitReStatement(node : CstNode){
        const valueNode = node.children.value?.[0] as CstNode;
        const identifier = node.children.Identifier?.[0] as IToken;
        const name = identifier.image;

        const data = this.variables.get(name);

        if (!data) throw new Error(`${name} dosn't exist!`);

        if (data?.declaration == "const") throw new Error(`${name} is a constant, you cant re-assign it!`);

        if (!this.isValueAssignableTo(data.type, valueNode, data.isNullable)) {
            throw new Error(
                `${name} cannot be assigned that value.`
            );
        }

        this.changeVariableValue({ ...data, value: this.describeExpression(valueNode) });
    }

    private changeVariableValue(newVar : Variable) {
        const name = newVar.name;

        this.variables.delete(newVar.name);
        this.variables.set(name, newVar);
    }

    private getScope(node: CstNode): string {
        if (node.children.Local) {
            return "local";
        }

        if (node.children.Global) {
            return "global";
        }

        throw new Error("Invalid scope.");
    }

    private getType(node: CstNode): string {
        if (node.children.StringKeyword) {
            return "string";
        }

        if (node.children.IntegerKeyword) {
            return "integer";
        }

        if (node.children.BooleanKeyword) {
            return "boolean";
        }

        if (node.children.DoubleKeyword) {
            return "double";
        }

        if (node.children.CharacterKeyword) {
            return "char";
        }

        if (node.children.ObjectKeyword) {
            return "obj";
        }

        throw new Error("Invalid type.");
    }

    private getDeclaration(node: CstNode): string {
        if (node.children.Var) {
            return "var";
        }

        if (node.children.Const) {
            return "const";
        }

        throw new Error("Invalid declaration.");
    }

    public getVariables(): Variable[] {
        return Array.from(this.variables.values());
    }

    public visitExpressionStatement(node: CstNode) {
        this.inferType(node.children.expression?.[0] as CstNode);
    }

    private isValueAssignableTo(type: string, valueNode: CstNode, isNullable: boolean): boolean {
        const expression = valueNode.children.expression?.[0] as CstNode;
        const valueType = this.inferType(expression);
        if (valueType === "null") return isNullable;
        return valueType === type || (type === "double" && valueType === "integer");
    }

    private inferType(node: CstNode): string {
        if (node.name === "expression") return this.inferType(node.children.sum?.[0] as CstNode);
        if (node.name === "power") {
            const left = this.inferType(node.children.unary?.[0] as CstNode);
            const rightNode = node.children.power?.[0] as CstNode | undefined;
            if (!rightNode) return left;
            const right = this.inferType(rightNode);
            if (!this.isNumeric(left) || !this.isNumeric(right)) {
                throw new Error("Arithmetic operators require integer or double operands.");
            }
            return left === "double" || right === "double" ? "double" : "integer";
        }
        if (node.name === "sum" || node.name === "product") {
            const children = node.children;
            const terms = (children.product ?? children.power) as CstNode[];
            let result = this.inferType(terms[0] as CstNode);
            for (let index = 1; index < terms.length; index++) {
                const right = this.inferType(terms[index] as CstNode);
                if (!this.isNumeric(result) || !this.isNumeric(right)) {
                    throw new Error("Arithmetic operators require integer or double operands.");
                }
                if (node.name === "product" && children.Div) result = "double";
                else if (result === "double" || right === "double") result = "double";
            }
            return result;
        }
        if (node.name === "unary") {
            const valueType = this.inferType(node.children.primary?.[0] as CstNode);
            if (node.children.Minus && !this.isNumeric(valueType)) {
                throw new Error("Unary '-' requires an integer or double operand.");
            }
            return valueType;
        }
        if (node.name !== "primary") {
            const t = node as unknown as IToken;
            if (t.tokenType.name !== "Identifier") {
                throw new Error("Invalid expression.");
            } else {}
        }
        
        const children = node.children;

        if (children.Integer) return "integer";
        if (children.Double) return "double";
        if (children.StringLiteral) return "string";
        if (children.True || children.False) return "boolean";
        if (children.CharacterLiteral) return "char";
        if (children.Null) return "null";
        if (children.Object) return "obj";
        if (children.Dot) {
            const identifier = children.Identifier?.[0] as IToken | undefined;

            if (!identifier) {
                throw new Error("Invalid object access.");
            }

            const path = [
                identifier.image,
                ...(children.Child ?? []).map(
                    child => (child as IToken).image
                )
            ].join(".");

            const variable = this.variables.get(path);

            if (!variable) {
                throw new Error(`Variable '${path}' has not been declared.`);
            }

            return variable.type;
        }
        if (children.expression) return this.inferType(children.expression[0] as CstNode);
        const identifier = children.Identifier?.[0] as IToken | undefined;
        if (!identifier) throw new Error("Invalid expression.");
        const variable = this.variables.get(identifier.image);
        if (!variable) throw new Error(`Variable '${identifier.image}' has not been declared.`);
        if (variable.value === "null") throw new Error("Null can't be used in expressions.");
        return variable.type;
    }

    private isNumeric(type: string): boolean {
        return type === "integer" || type === "double";
    }

    private describeExpression(node: CstNode): string {
        const tokens = this.collectTokens(node);
        return tokens.map(token => token.image).join(" ");
    }

    private collectTokens(node: CstNode): IToken[] {
        return Object.values(node.children).flatMap(children => children.flatMap(child =>
            "image" in child ? [child as IToken] : this.collectTokens(child as CstNode)
        )).sort((left, right) => left.startOffset - right.startOffset);
    }

    private startOffset(node: CstNode): number {
        return this.collectTokens(node)[0]?.startOffset ?? Number.MAX_SAFE_INTEGER;
    }
}
