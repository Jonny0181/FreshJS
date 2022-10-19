const chalk = require("chalk");

module.exports = class ConsoleLogger {
  origin;
  constructor() {
    this.origin = this._getLogOrigin().split(/[\\/]/).pop();
  }
  _getLogOrigin() {
    let filename;
    let _pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };
    try {
      let err = new Error();
      let callerfile;
      let currentfile;
      currentfile = err.stack.shift().getFileName();
      while (err.stack.length) {
        callerfile = err.stack.shift().getFileName();
        if (currentfile !== callerfile) {
          filename = callerfile;
          break;
        }
      }
    } catch (err) {}
    Error.prepareStackTrace = _pst;
    return filename;
  }
  error(content) {
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        ` [` +
        chalk.red.bold(
          `${
            this.origin.length > 15
              ? this.origin.substring(0, 17) + "..."
              : this.origin
          }`
        ) +
        `] ` +
        " ".repeat(15 - (this.origin.length > 15 ? 15 : this.origin.length)) +
        "| " +
        content
    );
  }
  info(content) {
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        ` [` +
        chalk.yellow.bold(
          `${
            this.origin.length > 15
              ? this.origin.substring(0, 17) + "..."
              : this.origin
          }`
        ) +
        `] ` +
        " ".repeat(15 - (this.origin.length > 15 ? 15 : this.origin.length)) +
        "| " +
        content
    );
  }
  success(content) {
    console.log(
      chalk.grey(new Date().toLocaleTimeString()) +
        ` [` +
        chalk.green.bold(
          `${
            this.origin.length > 15
              ? this.origin.substring(0, 17) + "..."
              : this.origin
          }`
        ) +
        `] ` +
        " ".repeat(15 - (this.origin.length > 15 ? 15 : this.origin.length)) +
        "| " +
        content
    );
  }
};
