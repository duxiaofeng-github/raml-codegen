const path = require("path");
const Project = require("ts-simple-ast").Project;

module.exports = function(ramlResult, filePath, out, concat, cli, hooks) {
  const filename = path.parse(filePath).name;
  const outFilePath = path.resolve(out, `${filename}.ts`);
  const tsConfigFilePath =
    cli.flags.tsConfigFilePath &&
    path.resolve(process.cwd(), cli.flags.tsConfigFilePath);

  const project = new Project({
    tsConfigFilePath
  });

  const sourceFile = project.createSourceFile(outFilePath, "", {
    overwrite: true
  });

  if (hooks && hooks.beforeSave) {
    hooks.beforeSave();
  }

  project.save();

  if (hooks && hooks.afterSave) {
    hooks.afterSave();
  }
};
