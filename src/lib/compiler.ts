import type { CstNode, IToken } from "chevrotain";

export class Compiler {
    private output: string[] = [];

    compile(cst: CstNode): string {
        const variables = cst.children.variableStatement ?? [];
        const assignments = cst.children.reAssignmentStatement ?? [];
        const prints = cst.children.printStatement ?? [];

        for (const node of variables) {
            this.output.push(this.compileVariable(node as CstNode));
        }

        for (const node of assignments) {
            this.output.push(this.compileAssignment(node as CstNode));
        }

        for (const node of prints) {
            this.output.push(this.compilePrint(node as CstNode));
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

        throw new Error("Unknown value.");
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
}