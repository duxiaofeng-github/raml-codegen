const raml = require("raml-1-parser");
const path = require("path");
const fs = require("fs");
const Confirm = require("prompt-confirm");
const tsGenerator = require("./ts-generator");
const { filesPathToAbsPath, logRamlError, getHooks } = require("./utils");

function parseFile(absPaths, absOut, lang, concat, cli) {
  if (lang === "") {
    throw new Error("Must specify language by -l.");
  }
  const langArr = lang.split(",");

  absPaths.forEach(filePath => {
    const ramlResult = raml.loadRAMLSync(filePath);
    const errors = ramlResult.errors();

    if (errors && errors.length) {
      errors.forEach(err => {
        logRamlError(err);
      });
    }

    langArr.forEach(language => {
      switch (language) {
        case "ts":
          tsGenerator(
            ramlResult,
            filePath,
            absOut,
            concat,
            cli,
            getHooks(absOut)
          );
          break;
        case "go":
          break;
      }
    });
  });

  console.log("\nGenerate done.");
}

module.exports = function(filesPath, out, lang, concat, defaultOverwrite, cli) {
  if (!filesPath || !filesPath.length) {
    cli.showHelp();
    return;
  }

  const absPaths = filesPathToAbsPath(filesPath);
  const absOut = path.resolve(process.cwd(), out);
  const dirExist = fs.existsSync(absOut);

  if (dirExist && !defaultOverwrite) {
    new Confirm(`Directory ${absOut} exist. Overwrite?`).ask(function(
      coutinue
    ) {
      if (coutinue) {
        parseFile(absPaths, absOut, lang, concat, cli);
      }
    });
  } else {
    parseFile(absPaths, absOut, lang, concat, cli);
  }
};
