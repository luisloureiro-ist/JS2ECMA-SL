const { generateFreshVar } = require("./generator");
const Assign = require("../syntax/Assign");
const NewObj = require("../syntax/NewObj");
const FieldAssign = require("../syntax/FieldAssign");
const NOpt = require("../syntax/NOpt");
const Val = require("../syntax/Val");
const Var = require("../syntax/Var");

function translateLiteral(eslVal) {
  return {
    variable: new Val(eslVal),
    statements: [],
  };
}

function translateBoolean(value) {
  return translateLiteral(new Val.Bool(value));
}

function translateString(value) {
  return translateLiteral(new Val.Str(value));
}

function translateNull() {
  return translateLiteral(new Val.Null());
}

function translateNumber(value) {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    throw new Error("Invalid number: " + value);
  }
  if (Number.isInteger(value)) {
    if (Number.isSafeInteger(value)) {
      return translateLiteral(new Val.Int(value));
    }

    throw new Error("This number is not a safe integer: " + value);
  }
  return translateLiteral(new Val.Flt(value));
}

function translateArray(varExpr, arr = []) {
  const varsAndStmts = arr.map(traverseAndTranslate).reduce(
    (acc, varStmt) => ({
      vars: acc.vars.concat(varStmt.variable),
      stmts: acc.stmts.concat(varStmt.statements),
    }),
    { vars: [], stmts: [] }
  );

  return {
    variable: varExpr,
    statements: varsAndStmts.stmts.concat(
      new Assign(varExpr, new NOpt(new NOpt.ListExpr(), varsAndStmts.vars))
    ),
  };
}

function translateObject(varExpr, obj) {
  const newObjStmt = new Assign(varExpr, new NewObj());

  const objStmts = Object.keys(obj)
    .map((prop) => ({ prop, value: traverseAndTranslate(obj[prop]) }))
    .reduce(
      (acc, propValue) =>
        acc
          .concat(propValue.value.statements)
          .concat(
            new FieldAssign(
              new Var(varExpr),
              propValue.prop,
              propValue.value.variable
            )
          ),
      [newObjStmt]
    );

  return {
    variable: varExpr,
    statements: objStmts,
  };
}

function traverseAndTranslate(value) {
  switch (typeof value) {
    case "undefined":
      throw new Error("The undefined value is not supported");
    case "boolean":
      return translateBoolean(value);
    case "number":
      return translateNumber(value);
    case "string":
      return translateString(value);
    case "bigint":
      throw new Error("BigInt values are not supported: " + value);
    case "symbol":
      throw new Error("Symbol values are not supported: " + value);
    case "function":
      throw new Error("Functions are not supported: " + value);
    case "object":
      if (value === null) {
        return translateNull();
      } else if (value instanceof Array) {
        return translateArray(generateFreshVar(), value);
      } else if (value instanceof RegExp) {
        throw new Error("Regular expressions are not supported: " + value);
      } else {
        return translateObject(generateFreshVar(), value);
      }

    default:
      throw new Error("Unexpected value: " + value);
  }
}

module.exports = {
  traverseAndTranslate,
};
