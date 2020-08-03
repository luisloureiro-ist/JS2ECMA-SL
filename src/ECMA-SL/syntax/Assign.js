const Stmt = require("./Stmt");

class Assign extends Stmt {
  constructor(varname, expression) {
    super();
    this.varname = varname;
    this.expression = expression;
  }

  toString() {
    return `${this.varname} := ${this.expression.toString()}`;
  }
}

module.exports = Assign;
