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
    OpenCurly,
    CloseCurly,
    ObjectKeyword,
    Comment,
    Comma,
    Colon,
    Dot,
    SquareClosedBracket,
    SquareOpenBracket,
    OpenTag,
    CloseTag,
    GreaterOrEqual,
    LessOrEqual,
    NotEqual,
    isEqual,
    ConcatOperator,
    Not,
    And,
    Or,
    Increment,
    Decrement,
    AddSelf,
    SubtractSelf,
    MultiplySelf,
    DivideSelf,
    ModulusSelf,
    ExpSelf,
    MultiLineComment,
} from "./lexer.js";
import { FParser } from "../tools/functionCreator.js";

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

    public value = this.RULE("value", () => {
        this.SUBRULE(this.expression);
    });

    public variableStatement = this.RULE("variableStatement", () => {
        this.SUBRULE(this.scope);
        this.SUBRULE(this.type);
        this.OPTION1(() => {
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

    public reAssignmentStatement = this.RULE("reAssignmentStatement", () => {
        this.CONSUME(Identifier);
        this.MANY(() => {
            this.CONSUME(Dot);
            this.CONSUME2(Identifier, { LABEL: "OrigChild" });
        });
        this.OR([
            { ALT: () => {
                this.OR2([
                    { ALT: () => this.CONSUME(Equals) },
                    { ALT: () => this.CONSUME(AddSelf) },
                    { ALT: () => this.CONSUME(SubtractSelf) },
                    { ALT: () => this.CONSUME(MultiplySelf) },
                    { ALT: () => this.CONSUME(DivideSelf) },
                    { ALT: () => this.CONSUME(ModulusSelf) },
                    { ALT: () => this.CONSUME(ExpSelf) },
                ]);
                this.SUBRULE(this.value);
            } },
            { ALT: () => this.OR3([
                { ALT: () => this.CONSUME(Increment) },
                { ALT: () => this.CONSUME(Decrement) },
            ]) },
        ]);
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
        this.SUBRULE(this.orExpression);
    });

    public orExpression = this.RULE("orExpression", () => {
        this.SUBRULE(this.andExpression);
        this.MANY(() => { this.CONSUME(Or); this.SUBRULE2(this.andExpression); });
    });

    public andExpression = this.RULE("andExpression", () => {
        this.SUBRULE(this.equalityExpression);
        this.MANY(() => { this.CONSUME(And); this.SUBRULE2(this.equalityExpression); });
    });

    public equalityExpression = this.RULE("equalityExpression", () => {
        this.SUBRULE(this.comparisonExpression);
        this.MANY(() => {
            this.OR([{ ALT: () => this.CONSUME(isEqual) }, { ALT: () => this.CONSUME(NotEqual) }]);
            this.SUBRULE2(this.comparisonExpression);
        });
    });

    public comparisonExpression = this.RULE("comparisonExpression", () => {
        this.SUBRULE(this.sum);
        this.MANY(() => {
            this.OR([{ ALT: () => this.CONSUME(OpenTag) }, { ALT: () => this.CONSUME(CloseTag) },
                { ALT: () => this.CONSUME(GreaterOrEqual) }, { ALT: () => this.CONSUME(LessOrEqual) }]);
            this.SUBRULE2(this.sum);
        });
    });

    public printStatement = FParser(
        this,
        "print",
        Print,
        this.expression
    );

    public sum = this.RULE("sum", () => {
        this.SUBRULE(this.product);
        this.MANY(() => {
            this.OR([
                { ALT: () => this.CONSUME(Plus) },
                { ALT: () => this.CONSUME(Minus) },
                { ALT: () => this.CONSUME(ConcatOperator) },
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
        this.MANY(() => this.OR([{ ALT: () => this.CONSUME(Minus) }, { ALT: () => this.CONSUME(Not) }]));
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
            { ALT: () => {
                this.CONSUME(OpenParen);
                this.SUBRULE(this.expression);
                this.CONSUME(CloseParen);
            } },
            { ALT: () => this.SUBRULE(this.obj, { LABEL: "Object" }) },
            { ALT: () => {
                this.CONSUME(Identifier);
                this.MANY(() => {
                    this.CONSUME(Dot);
                    this.CONSUME2(Identifier, { LABEL: "Child" });
                });
            } },
        ]);
        this.OPTION2(() => this.OR4([
            { ALT: () => this.CONSUME(Increment) },
            { ALT: () => this.CONSUME(Decrement) },
        ]));
    });

    public obj = this.RULE("obj", () => {
        this.CONSUME(OpenCurly);

        this.OPTION(() => {
            this.SUBRULE(this.objectProperty);

            this.MANY(() => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.objectProperty);
            });
        });

        this.CONSUME(CloseCurly);
    });

    public objectProperty = this.RULE("objectProperty", () => {
        this.CONSUME(Identifier, { LABEL: "key" });
        this.CONSUME(Colon);
        this.SUBRULE(this.value, { LABEL: "value" });
    });

    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }
}
