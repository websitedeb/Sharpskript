import { CstParser } from "chevrotain";

import {
    allTokens,
    Print,
    Local,
    Global,
    Var,
    Const,
    StringKeyword,
    IntegerKeyword,
    BooleanKeyword,
    DoubleKeyword,
    StringLiteral,
    Integer,
    True,
    False,
    Double,
    Identifier,
    Equals,
    Semicolon,
    OpenParen,
    CloseParen,
    CharacterLiteral,
    CharacterKeyword,
    Nullable,
    Null,
    Comment,
} from "./lexer.js";

export class SharpParser extends CstParser {

    public program = this.RULE("program", () => {
        this.MANY(() => {
            this.OR([
                {
                    ALT: () => this.SUBRULE(this.variableStatement),
                },
                {
                    ALT: () => this.SUBRULE(this.printStatement),
                },
                {
                    ALT: () => this.SUBRULE(this.reAssignmentStatement),
                },
            ]);
        });
    });

    public variableStatement = this.RULE("variableStatement", () => {
        this.SUBRULE(this.scope);
        this.SUBRULE(this.type);
        this.SUBRULE(this.declaration);
        this.OPTION(() => {
            this.CONSUME(Nullable);
        })

        this.CONSUME(Identifier);

        this.CONSUME(Equals);

        this.SUBRULE(this.value);

        this.OPTION2(() => {
            this.CONSUME(Semicolon);
        });
    });

    public scope = this.RULE("scope", () => {
        this.OR([
            { ALT: () => this.CONSUME(Local) },
            { ALT: () => this.CONSUME(Global) },
        ]);
    });

    public type = this.RULE("type", () => {
        this.OR([
            { ALT: () => this.CONSUME(StringKeyword) },
            { ALT: () => this.CONSUME(IntegerKeyword) },
            { ALT: () => this.CONSUME(BooleanKeyword) },
            { ALT: () => this.CONSUME(DoubleKeyword) },
            { ALT: () => this.CONSUME(CharacterKeyword) },
        ]);
    });

    public declaration = this.RULE("declaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(Var) },
            { ALT: () => this.CONSUME(Const) },
        ]);
    });

    public value = this.RULE("value", () => {
        this.OR([
            { ALT: () => this.CONSUME2(StringLiteral) },
            { ALT: () => this.CONSUME(Integer) },
            { ALT: () => this.CONSUME(Identifier) },
            { ALT: () => this.CONSUME(True) },
            { ALT: () => this.CONSUME(False) },
            { ALT: () => this.CONSUME(Double) },
            { ALT: () => this.CONSUME(CharacterLiteral) },
            { ALT: () => this.CONSUME(Null) }
        ]);
    });

    public reAssignmentStatement = this.RULE("reAssignmentStatement", () => {
        this.CONSUME(Identifier);
        this.CONSUME(Equals);
        this.SUBRULE(this.value);
        this.OPTION(() => {
            this.CONSUME(Semicolon);
        });
    });

    public printStatement = this.RULE("printStatement", () => {
        this.CONSUME(Print);
        this.CONSUME(OpenParen);

        this.SUBRULE(this.value);

        this.CONSUME(CloseParen);

        this.OPTION(() => {
            this.CONSUME(Semicolon);
        });
    });

    constructor() {
        super(allTokens);

        this.performSelfAnalysis();
    }
}