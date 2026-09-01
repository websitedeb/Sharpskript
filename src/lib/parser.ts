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
    Plus,
    Minus,
    Multi,
    Div,
    Exp,
    Object,
    ObjectKeyword,
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
                {
                    ALT: () => this.SUBRULE(this.expressionStatement),
                }
            ]);
        });
    });

    public variableStatement = this.RULE("variableStatement", () => {
        this.SUBRULE(this.scope);
        this.SUBRULE(this.type);
        this.OPTION(() => {
            this.CONSUME(Nullable);
        })
        this.SUBRULE(this.declaration);

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
            { ALT: () => this.CONSUME(ObjectKeyword) }
        ]);
    });

    public declaration = this.RULE("declaration", () => {
        this.OR([
            { ALT: () => this.CONSUME(Var) },
            { ALT: () => this.CONSUME(Const) },
        ]);
    });

    public value = this.RULE("value", () => {
        this.SUBRULE(this.expression);
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

    public expressionStatement = this.RULE("expressionStatement", () => {
        this.SUBRULE(this.expression);
        this.OPTION(() => this.CONSUME(Semicolon));
    });

    //power > product > sum.
    public expression = this.RULE("expression", () => {
        this.SUBRULE(this.sum);
    });

    public sum = this.RULE("sum", () => {
        this.SUBRULE(this.product);
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(Plus) },
                { ALT: () => this.CONSUME(Minus) },
            ]);
            this.SUBRULE2(this.product);
        });
    });

    public product = this.RULE("product", () => {
        this.SUBRULE(this.power);
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(Multi) },
                { ALT: () => this.CONSUME(Div) },
            ]);
            this.SUBRULE2(this.power);
        });
    });

    public power = this.RULE("power", () => {
        this.SUBRULE(this.unary);
        this.OPTION(() => {
            this.CONSUME(Exp);
            this.SUBRULE2(this.power);
        });
    });

    public unary = this.RULE("unary", () => {
        this.OPTION(() => this.CONSUME(Minus));
        this.SUBRULE(this.primary);
    });

    public primary = this.RULE("primary", () => {
        this.OR([
            { ALT: () => this.CONSUME(StringLiteral) },
            { ALT: () => this.CONSUME(Integer) },
            { ALT: () => this.CONSUME(True) },
            { ALT: () => this.CONSUME(False) },
            { ALT: () => this.CONSUME(Double) },
            { ALT: () => this.CONSUME(CharacterLiteral) },
            { ALT: () => this.CONSUME(Null) },
            { ALT: () => this.CONSUME(Identifier) },
            {
                ALT: () => {
                    this.CONSUME(OpenParen);
                    this.SUBRULE(this.expression);
                    this.CONSUME(CloseParen);
                },
            },
            { ALT: () => this.CONSUME(Object) }
        ]);
    });

    constructor() {
        super(allTokens);

        this.performSelfAnalysis();
    }
}
