const Switch = require("./switch");

module.exports = {
  transformObject: function (obj) {
    if (obj.type === "SwitchStatement") {
      return Switch.transform(obj);
    }
    return obj;
  },
};
