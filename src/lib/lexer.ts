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

export const Print = FLexer(Identifier, "print");

export const allTokens = [
  WhiteSpace,
  Comment,
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
  SquareOpenBracket
];

export const SharpLexer = new Lexer(allTokens);