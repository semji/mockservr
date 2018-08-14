module.exports = class BaseValidator {
  supportsValidation(type) {
    return true;
  }
  validate(expected, value) {
    return expected === value;
  }
};
