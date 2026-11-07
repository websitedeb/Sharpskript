import { SharpLexer } from "./lib/lexer.js";
import { SharpParser } from "./lib/parser.js";

import { SemanticAnalyzer } from "./lib/semantic.js";

import { Compiler } from "./lib/compiler.js";

import { VM } from "./lib/vm.js";

const input = `
--# this should
be a 
comment #--
local int var inc = 2;
print((not true) and false);
`;


console.log("========== LEXER ==========");

const lexingResult = SharpLexer.tokenize(input);

if (lexingResult.errors.length > 0) {
    console.error("Lexing errors:");

    for (const error of lexingResult.errors) {
        console.error(error.message);
    }

    process.exit(1);
}

for (const token of lexingResult.tokens) {
    console.log(
        `${token.tokenType.name.padEnd(20)} "${token.image}"`
    );
}


console.log("\n========== PARSER ==========");

const parser = new SharpParser();

parser.input = lexingResult.tokens;

const cst = parser.program();

if (parser.errors.length > 0) {
    console.error("\nParser errors detected:");

    for (const error of parser.errors) {
        console.error(error.message);

        console.error(
            `  Token: "${error.token.image}"`
        );

        console.error(
            `  Line: ${error.token.startLine}, Column: ${error.token.startColumn}`
        );
    }

    process.exit(1);
}

console.log("Parsing successful!");


console.log("\n========== CST ==========");

console.dir(cst, {
    depth: null
});

console.log("\n========== SEMANTICS ==========")

const semanticAnalyzer = new SemanticAnalyzer();
semanticAnalyzer.analyze(cst);

console.log("Semantics Analyzed Perfectly")

console.log("\n========== COMPILED JS ==========")

const compiler = new Compiler()
const compiledJS = compiler.compile(cst)

console.log("Compiled into Javascript");
console.log(compiledJS);

console.log("\n========== VM ==========")

const virtual_machine = new VM();

virtual_machine.run(compiledJS);