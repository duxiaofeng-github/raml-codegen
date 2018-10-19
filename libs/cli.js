#!/usr/bin/env node

const meow = require("meow");
const parser = require("./parser");
const cli = meow(
  `
	Usage
	  $ raml-codegen <options> <raml file 1> <raml file 2> ...

	Options
    --out, -o  Output directory
    --lang, -l Generated languages, separate by ,
    --concat, -c Optional. Concat model and api file in one file
    --tsConfigFilePath Optional. Typescript config file
    --defaultOverwrite Optional. Overwrite output directory if exists

	Examples
	  $ raml-codegen -o ./raml-example-out -l ts,go ./raml-example/device.api.raml
`,
  {
    flags: {
      out: {
        type: "string",
        alias: "o"
      },
      lang: {
        type: "string",
        alias: "l"
      },
      concat: {
        type: "boolean",
        alias: "c"
      },
      tsConfigFilePath: {
        type: "string"
      },
      defaultOverwrite: {
        type: "boolean"
      }
    }
  }
);

const outDir = cli.flags.out;
const lang = cli.flags.lang;
const concat = cli.flags.concat;
const defaultOverwrite = cli.flags.defaultOverwrite;
const files = cli.input;

parser(files, outDir, lang, concat, defaultOverwrite, cli);
