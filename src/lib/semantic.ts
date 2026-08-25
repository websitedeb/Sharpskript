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
        const var_statements = node.children.variableStatement ?? [];
        const print_statements = node.children.printStatement ?? [];
        const re_statement = node.children.reAssignmentStatement ?? [];

        for (const statement of var_statements) {
            this.visitVariableStatement(statement as CstNode);
        }

        for (const statement of print_statements) {
            this.visitPrintStatement(statement as CstNode);
        }

        for (const statement of re_statement) {
            this.visitReStatement(statement as CstNode);
        }
    }

    // print

    private visitPrintStatement(node: CstNode) {
        const valueNode = node.children.value?.[0] as CstNode;
        const value = this.getValue(valueNode);

        const variable = this.variables.get(value);

        if (
            !variable &&
            !/^\d+$/.test(value) &&
            !/^".*"$/.test(value) &&
            value !== "true" &&
            value !== "false" &&
            !/^\d+\.\d+$/.test(value) &&
            !/^'.'$/.test(value)
        ) {
            throw new Error(`Variable '${value}' has not been declared.`);
        }
    }

    // vars

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
        const value = this.getValue(valueNode);

        if (this.variables.has(name)) {
            throw new Error(
                `Variable '${name}' has already been declared.`
            );
        }

        if (!this.checkIfAssignedVariableValueIsValid(
            type,
            value,
            isNullable
        )) {
            throw new Error(
                `Value '${value}' is not valid for variable '${name}' of type '${type}'.`
            );
        }

        this.variables.set(name, {
            name,
            scope,
            type,
            declaration,
            value,
            isNullable
        });
    }

    private checkIfAssignedVariableValueIsValid(
        type: string,
        value: string,
        isNullable: boolean
    ): boolean {
        if (value === "null") {
            return isNullable;
        }

        if (type === "string") {
            if (/^".*"$/.test(value)) {
                return true;
            }

            return this.variables.get(value)?.type === "string";

        } else if (type === "integer") {
            if (/^\d+$/.test(value)) {
                return true;
            }

            return this.variables.get(value)?.type === "integer";

        } else if (type === "boolean") {
            if (value === "true" || value === "false") {
                return true;
            }

            return this.variables.get(value)?.type === "boolean";

        } else if (type === "double") {
            if (/^\d+\.\d+$/.test(value)) {
                return true;
            }

            return this.variables.get(value)?.type === "double";

        } else if (type === "char") {
            if (/^'.'$/.test(value)) {
                return true;
            }

            return this.variables.get(value)?.type === "char";
        }

        return false;
    }

    private visitReStatement(node : CstNode){
        const valueNode = node.children.value?.[0] as CstNode;
        const identifier = node.children.Identifier?.[0] as IToken;
        const name = identifier.image;

        const data = this.variables.get(name);

        if (!data) throw new Error(`${name} dosn't exist!`);

        if (data?.declaration == "const") throw new Error(`${name} is a constant, you cant re-assign it!`);

        const value = this.getValue(valueNode);

        if (
            !this.checkIfAssignedVariableValueIsValid(
                data.type,
                value,
                data.isNullable
            )
        ) {
            throw new Error(
                `${name} cannot be assigned '${value}'.`
            );
        }

        this.changeVariableValue(data as Variable);
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

    private getValue(node: CstNode): string {
        const stringLiteral = node.children.StringLiteral?.[0] as IToken;

        if (stringLiteral) {
            return stringLiteral.image;
        }

        const integer = node.children.Integer?.[0] as IToken;

        if (integer) {
            return integer.image;
        }

        const identifier = node.children.Identifier?.[0] as IToken;

        if (identifier) {
            return identifier.image;
        }

        const trueToken = node.children.True?.[0] as IToken;

        if (trueToken) {
            return trueToken.image;
        }

        const falseToken = node.children.False?.[0] as IToken;

        if (falseToken) {
            return falseToken.image;
        }

        const doubleToken = node.children.Double?.[0] as IToken;

        if (doubleToken) {
            return doubleToken.image;
        }

        const charToken = node.children.CharacterLiteral?.[0] as IToken;

        if (charToken) {
            return charToken.image;
        }

        const nullToken = node.children.Null?.[0] as IToken;

        if (nullToken) {
            return nullToken.image;
        }

        throw new Error("Invalid value.");
    }

    public getVariables(): Variable[] {
        return Array.from(this.variables.values());
    }
}