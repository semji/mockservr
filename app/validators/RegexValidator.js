const BaseValidator = require('./BaseValidator');

module.exports = class RegexValidator extends BaseValidator {
  supportsValidation(type) {
    return type === 'regex';
  }

  validate(expected, value) {
    let matches = new RegExp(expected).exec(value);

    if (matches === null) {
      return false;
    }

    return matches.slice(1);
  }
};
