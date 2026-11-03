import type { CstNode, ParserMethod, TokenType, BaseParser, CstParser } from "chevrotain";
import { createToken } from "chevrotain";
import { OpenParen, CloseParen, Semicolon } from "../lib/lexer.js";

export function FLexer(identifier : TokenType, name : string) : TokenType {
    let tokens: TokenType;
    function capitalize(word : string) : string {
            if (!word) return "";
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        tokens = createToken({
            name: capitalize("name"),
            pattern: new RegExp(name),
            longer_alt: identifier,
        });
    return tokens;
}

export function FParser(
    parser: CstParser,
    name: string,
    token: TokenType,
    params: any
) {
    const parserApi = parser as any;
    return parserApi.RULE(`${name}Statement`, () => {
        parserApi.CONSUME(token);
        parserApi.CONSUME(OpenParen);

        parserApi.SUBRULE(params, {
            LABEL: "params",
        });

        parserApi.CONSUME(CloseParen);

        parserApi.OPTION(() => {
            parserApi.CONSUME(Semicolon);
        });
    });
}

export class FSemantics {
    private name : string;
    private inferType : Function;
    private paramsCount : number;
    private paramsTypeList : string[];

    constructor(name : string, inferTypeFunc : Function, paramsCount : number, paramsTypeList : string[]) {
        this.name = name;
        this.inferType = inferTypeFunc;
        this.paramsCount = paramsCount;
        this.paramsTypeList = paramsTypeList;
    }

    public statement(node : CstNode) : void {
        if (node.name === this.name) {
            const params = node.children.params as CstNode[];
            if (params.length !== this.paramsCount) {
                throw new Error(`Function ${this.name} expects ${this.paramsCount} parameters, but got ${params.length}`);
            }
            for (let i = 0; i < params.length; i++) {
                const paramType = this.inferType(params[i]);
                if (paramType !== this.paramsTypeList[i]) {
                    throw new Error(`Function ${this.name} expects parameter ${i + 1} to be of type ${this.paramsTypeList[i]}, but got ${paramType}`);
                }
            }
        }
    }
}

export class FCompiler {
    private name : string;
    private jsFuncName : string;
    private paramsCount : number;
    private compileExpression : Function;
    private addToOutput : Function;

    constructor(name : string, jsFuncName : string, paramsCount : number, compileExpressionFunc : Function, addToOutputFunc : Function) {
        this.name = name;
        this.jsFuncName = jsFuncName;
        this.paramsCount = paramsCount;
        this.compileExpression = compileExpressionFunc;
        this.addToOutput = addToOutputFunc;
    }

    public compile(node : CstNode) : void {
        if (node.name === this.name) {
            const params = node.children.params as CstNode[];
            if (params.length !== this.paramsCount) {
                throw new Error(`Function ${this.name} expects ${this.paramsCount} parameters, but got ${params.length}`);
            }
            const compiledParams = params.map(param => this.compileExpression(param));
            this.addToOutput(`${this.jsFuncName}(${compiledParams.join(", ")})`);
        }
    }
    
}