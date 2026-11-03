import { createToken, Lexer, type TokenType } from "chevrotain";
import { FLexer } from "../tools/functionCreator.js";

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z]\w*/,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// export const Print = createToken({
//   name: "Print",
//   pattern: /print/,
//   longer_alt: Identifier,
// });

export const Local = createToken({
  name: "Local",
  pattern: /local/,
  longer_alt: Identifier,
});

export const Global = createToken({
  name: "Global",
  pattern: /global/,
  longer_alt: Identifier,
});

export const Var = createToken({
  name: "Var",
  pattern: /var/,
  longer_alt: Identifier,
});

export const Const = createToken({
  name: "Const",
  pattern: /const/,
  longer_alt: Identifier,
});

export const Integer = createToken({
  name: "Integer",
  pattern: /0|[1-9]\d*/,
});

export const Null = createToken({
  name: "Null",
  pattern: /null/,
  longer_alt: Identifier,
})

export const Double = createToken({
  name: "Double",
  pattern: /-?\d+\.\d+/,
});

export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"([^"\\]|\\.)*"/,
});

export const CharacterLiteral = createToken({
  name: "CharacterLiteral",
  pattern: /'([^'\\]|\\.)'/,
});

export const True = createToken({
  name: "True",
  pattern: /true/,
  longer_alt: Identifier,
});

export const False = createToken({
  name: "False",
  pattern: /false/,
  longer_alt: Identifier,
});

export const Equals = createToken({
  name: "Equals",
  pattern: /=/,
});

export const Semicolon = createToken({
  name: "Semicolon",
  pattern: /;/,
});

export const Nullable = createToken({
  name: "Nullable",
  pattern: /\?/,
});

export const OpenParen = createToken({
  name: "OpenParen",
  pattern: /\(/,
});

export const CloseParen = createToken({
  name: "CloseParen",
  pattern: /\)/,
});

export const StringKeyword = createToken({
  name: "StringKeyword",
  pattern: /string/,
  longer_alt: Identifier,
});

export const IntegerKeyword = createToken({
  name: "IntegerKeyword",
  pattern: /int/,
  longer_alt: Identifier,
});

export const BooleanKeyword = createToken({
  name: "BooleanKeyword",
  pattern: /bool/,
  longer_alt: Identifier,
});

export const DoubleKeyword = createToken({
  name: "DoubleKeyword",
  pattern: /double/,
  longer_alt: Identifier,
});

export const CharacterKeyword = createToken({
  name: "CharacterKeyword",
  pattern: /char/,
  longer_alt: Identifier,
});

export const ObjectKeyword = createToken({
  name: "ObjectKeyword",
  pattern: /obj/,
  longer_alt: Identifier
});

export const OpenCurly = createToken({
  name: "OpenCurly",
  pattern: /\{/
});

export const CloseCurly = createToken({
  name: "CloseCurly",
  pattern: /\}/
});

export const Plus = createToken({
  name: "Plus",
  pattern: /\+/,
  longer_alt: Identifier,
});

export const Minus = createToken({
  name: "Minus",
  pattern: /\-/,
  longer_alt: Identifier,
});

export const Multi = createToken({
  name: "Multi",
  pattern: /\*/,
  longer_alt: Identifier,
});

export const Div = createToken({
  name: "Div",
  pattern: /\//,
  longer_alt: Identifier,
});

export const Exp = createToken({
  name: "Exp",
  pattern: /\^/,
  longer_alt: Identifier,
});

export const Comment = createToken({
  name: "Comment",
  pattern: /-#-[^\r\n]*/,
  group: Lexer.SKIPPED,
});

export const OpenTag = createToken({
  name: "OpenTag",
  pattern: /\</,
});

export const CloseTag = createToken({
  name: "CloseTag",
  pattern: /\>/,
});

export const GreaterOrEqual = createToken({
  name: "GreaterOrEqual",
  pattern: />=/,
});

export const LessOrEqual = createToken({
  name: "LessOrEqual",
  pattern: /<=/,
});

export const NotEqual = createToken({
  name: "NotEqual",
  pattern: /!=/,
});

export const isEqual = createToken({
  name: "isEqual",
  pattern: /==/,
});

export const Comma = createToken({
  name: "Comma",
  pattern: /,/,
});

export const Colon = createToken({
  name: "Colon",
  pattern: /:/,
});

export const Dot = createToken({
  name: "Dot",
  pattern: /\./,
});

export const SquareOpenBracket = createToken({
  name: "SquareOpenBracket",
  pattern: /\[]/,
});

export const SquareClosedBracket = createToken({
  name: "SquareClosedBracket",
  pattern: /\]]/,
});

export const Not = createToken({
  name: "Not",
  pattern: /\!|not/,
  longer_alt: Identifier,
});

export const And = createToken({
  name: "And",
  pattern: /\&\&|and/,
  longer_alt: Identifier,
});

export const Or = createToken({
  name: "Or",
  pattern: /\|\||or/,
  longer_alt: Identifier,
});

export const Increment = createToken({
  name: "Increment",
  pattern: /\+\+/,
});

export const Decrement = createToken({
  name: "Decrement",
  pattern: /\-\-/,
});

export const AddSelf = createToken({
  name: "AddSelf",
  pattern: /\+=/,
});

export const SubtractSelf = createToken({
  name: "SubtractSelf",
  pattern: /\-=/,
});

export const MultiplySelf = createToken({
  name: "MultiplySelf",
  pattern: /\*=/,
});

export const DivideSelf = createToken({
  name: "DivideSelf",
  pattern: /\/=/,
});

export const ModulusSelf = createToken({
  name: "ModulusSelf",
  pattern: /\%=/,
});

export const ExpSelf = createToken({
  name: "ExpSelf",
  pattern: /\^=/,
});

export const Print = FLexer(Identifier, "print");

export const ConcatOperator = createToken({
  name: "ConcatOperator",
  pattern: /\.\./,
});

export const allTokens = [
  WhiteSpace,
  Comment,
  GreaterOrEqual,
  LessOrEqual,
  NotEqual,
  isEqual,
  Increment,
  Decrement,
  AddSelf,
  SubtractSelf,
  MultiplySelf,
  DivideSelf,
  ModulusSelf,
  ExpSelf,
  ConcatOperator,
  And,
  Or,
  Not,
  OpenTag,
  CloseTag,
  Comma,

  Equals,
  Semicolon,
  OpenParen,
  CloseParen,
  True,
  False,
  Double,
  Null,
  Print,

  Plus,
  Minus,
  Multi,
  Div,
  Exp,

  Local,
  Global,
  Var,
  Const,
  StringKeyword,
  IntegerKeyword,
  BooleanKeyword,
  DoubleKeyword,
  CharacterKeyword,
  ObjectKeyword,
  Nullable,

  StringLiteral,
  Integer,
  Identifier,
  CharacterLiteral,
  OpenCurly,
  CloseCurly,
  Colon,
  Dot,
  SquareClosedBracket,
  SquareOpenBracket,
];

export const SharpLexer = new Lexer(allTokens);
