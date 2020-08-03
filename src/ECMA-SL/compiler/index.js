const { traverseAndTranslate } = require("./translator");
const Return = require("../syntax/Return");

function fromJSObjectToESLStatements(objProg = {}) {
  const { variable, statements } = traverseAndTranslate(objProg);

  return statements.concat(new Return(variable));
}

module.exports = {
  fromJSObjectToESLStatements,
};
