const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf").sync;

function formatRamlError(err, deep) {
  deep = deep || 0;

  let selfMessage = `[${err.code}] ${err.message} at ${err.path}. start: ${
    err.range.start.line
  }-${err.range.start.column}-${err.range.start.position}, end: ${
    err.range.end.line
  }-${err.range.end.column}-${err.range.end.position}`;

  const traceMessage =
    err.trace &&
    err.trace.length &&
    err.trace.map(item => {
      const traceDeep = deep + 1;
      return "\n" + " ".repeat(traceDeep) + formatRamlError(item, traceDeep);
    });

  if (traceMessage) {
    selfMessage += traceMessage.join("");
  }

  return selfMessage;
}

module.exports = {
  filesPathToAbsPath: function(filesPath) {
    return filesPath.map(item => {
      return path.isAbsolute(item) ? item : path.resolve(process.cwd(), item);
    });
  },

  logRamlError: function(err) {
    if (err.isWarning) {
      console.warn(formatRamlError(err));
    } else {
      throw new Error(formatRamlError(err));
    }
  },

  getHooks: function(absOut) {
    return {
      beforeSave: () => {
        rimraf(absOut);

        fs.mkdirSync(absOut, {
          recursive: true
        });
      }
    };
  }
};
