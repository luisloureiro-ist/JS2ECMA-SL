const Expr = require("./Expr");

class NOpt extends Expr {
  constructor(n_aryOperator, expressionsList = []) {
    super();
    this.n_aryOperator = n_aryOperator;
    this.expressionsList = expressionsList;
  }

  toString() {
    return this.n_aryOperator.toString(
      this.expressionsList.map((expr) => expr.toString())
    );
  }
}

NOpt.ListExpr = class {
  toString(elements = []) {
    return `[ ${elements.join(", ")} ]`;
  }
};

module.exports = NOpt;
