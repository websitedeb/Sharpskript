import { createToken, Lexer } from "chevrotain";

export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z]\w*/,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const Print = createToken({
  name: "Print",
  pattern: /print/,
  longer_alt: Identifier,
});

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

export const Object = createToken({
  name: "Object",
  pattern: /\s*\{[\s\S]*\}\s*/
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

export const allTokens = [
  WhiteSpace,
  Comment,

  Equals,
  Semicolon,
  OpenParen,
  CloseParen,
  True,
  False,
  Double,
  Null,

  Plus,
  Minus,
  Multi,
  Div,
  Exp,

  Print,
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
  Object
];

export const SharpLexer = new Lexer(allTokens);