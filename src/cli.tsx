#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readFile } from "node:fs/promises";
import { render } from "ink";
import { UI } from "./tools/ui.js";

import { SharpLexer } from "./lib/lexer.js";
import { SharpParser } from "./lib/parser.js";

import { SemanticAnalyzer } from "./lib/semantic.js";

import { Compiler } from "./lib/compiler.js";

import { VM } from "./lib/vm.js";

yargs(hideBin(process.argv))
	.command(
		"run <file>",
		"Runs a SharpSkript file",
		yargs => {
			return yargs.positional("file", {
				describe: "SharpSkript file to run",
				type: "string",
				demandOption: true
			});
		},
		async argv => {
			const file = argv.file;

			if (!file.endsWith(".sharp")) {
				console.error("Error: file must have a .sharp extension");
				process.exit(1);
			}

			try {
				const content = await readFile(file, "utf8");

				const lexingResult = SharpLexer.tokenize(content);

				if (lexingResult.errors.length > 0) {
					throw new Error("Lexing errors detected:\n" + lexingResult.errors.map(e => e.message).join("\n"));
				}

				const parser = new SharpParser();
				parser.input = lexingResult.tokens;
				const cst = parser.program();

				if (parser.errors.length > 0) {
					throw new Error("Parser errors detected:\n" + parser.errors.map(e => e.message).join("\n"));
				}

				const semanticAnalyzer = new SemanticAnalyzer();
				semanticAnalyzer.analyze(cst);

				const compiler = new Compiler()
				const compiledJS = compiler.compile(cst)

				const virtual_machine = new VM();

				virtual_machine.run(compiledJS);

				if (argv.verbose) {
					render(
						<UI content={compiledJS} error={false} />
					)
				}
			} catch (error) {
				render(
					<UI content={error instanceof Error ? error.message : "An unknown error occurred"} error={true} />
				);
				process.exit(1);
			}
		}
	)
	.option(
		'verbose', 
		{
			 alias: 's',
			type: 'boolean',
			description: 'Print out compiled Javascript'
		}
	)
	.parseAsync()