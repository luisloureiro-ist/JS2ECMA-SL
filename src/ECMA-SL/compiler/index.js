const { traverseAndTranslate } = require("./translator");
const Return = require("../syntax/Return");
const Function = require("../syntax/Func");
const Block = require("../syntax/Block");

function fromJSObjectToESLStatements(objProg = {}) {
  const { expression, statements } = traverseAndTranslate(objProg);

  return statements.concat(new Return(expression));
}

function createFunction(name = "", params = [], statements = []) {
  return new Function(name, params, new Block(statements));
}

module.exports = {
  fromJSObjectToESLStatements,
  createFunction,
};
