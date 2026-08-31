import type { CstNode, IToken } from "chevrotain";

export class Compiler {
    private output: string[] = [];

    compile(cst: CstNode): string {
        const statements = Object.values(cst.children)
            .flat() as CstNode[];

        for (const node of statements.sort((left, right) => this.startOffset(left) - this.startOffset(right))) {
            switch (node.name) {
                case "variableStatement":
                    this.output.push(this.compileVariable(node));
                    break;
                case "reAssignmentStatement":
                    this.output.push(this.compileAssignment(node));
                    break;
                case "printStatement":
                    this.output.push(this.compilePrint(node));
                    break;
                case "expressionStatement":
                    this.output.push(this.compileExpression(node));
                    break;
            }
        }

        return this.output.join("\n");
    }

    private compileVariable(node: CstNode): string {
        const identifier = node.children.Identifier?.[0] as IToken;
        const declarationNode = node.children.declaration?.[0] as CstNode;
        const valueNode = node.children.value?.[0] as CstNode;
        const scopeNode = node.children.scope?.[0] as CstNode;

        const name = identifier.image;
        const declaration = this.compileDeclaration(declarationNode);
        const value = this.compileValue(valueNode);
        const scope = this.compileScope(scopeNode);

        if (scope == "local") {
            return `${declaration} ${name} = ${value};`;
        } 
        else if (scope == "global") {
            if (declaration == "const") {
                this.output.unshift(`${declaration} ${name} = ${value};`);
                return "";
            }
            else if (declaration == "let") {
                this.output.unshift(`${declaration} ${name};`);
                return `${name} = ${value};`
            }
            else {
                throw new Error("Something went wrong with the declaration...");
            }
        }
        else {
            throw new Error("Something went wrong with the scope...");
        }
    }

    private compileAssignment(node: CstNode): string {
        const identifier = node.children.Identifier?.[0] as IToken;

        const valueNode = node.children.value?.[0] as CstNode;

        const name = identifier.image;
        const value = this.compileValue(valueNode);

        return `${name} = ${value};`;
    }

    private compilePrint(node: CstNode): string {
        const valueNode = node.children.value?.[0] as CstNode;

        const value = this.compileValue(valueNode);

        return `console.log(${value});`;
    }

    private compileValue(node: CstNode): string {
        return this.compileExpressionNode(node.children.expression?.[0] as CstNode);
    }

    private compileDeclaration(node : CstNode) : string {
        const varToken = node.children.Var?.[0] as IToken;

        if (varToken) {
            return "let";
        }

        const constToken = node.children.Const?.[0] as IToken;

        if (constToken) {
            return "const";
        }

        throw new Error("Unknown declaration.");
    }

    private compileScope(scopeNode : CstNode) : string {
        const localToken = scopeNode.children.Local?.[0];

        if (localToken) {
            return "local";
        }

        const globalToken = scopeNode.children.Global?.[0];

        if (globalToken) {
            return "global";
        }

        throw new Error("Unknown Scope");
    }

    public compileExpression(node : CstNode) : string {
        return `${this.compileExpressionNode(node.children.expression?.[0] as CstNode)};`;
    }

    private compileExpressionNode(node: CstNode): string {
        return this.collectTokens(node)
            .map(token => token.image === "^" ? "**" : token.image)
            .join(" ");
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
