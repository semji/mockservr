const BaseValidator = require('./BaseValidator');

module.exports = class RegexValidator extends BaseValidator {
  supportsValidation(type) {
    return type === 'regex';
  }

  validate(expected, value) {
    let groups = {};
    let matches = new RegExp(expected).exec(value);

    if (matches === null) {
      return false;
    }

    matches.forEach((match, index) => {
      if (index > 0) {
        groups[index] = match;
      }
    });

    return groups;
  }
};
