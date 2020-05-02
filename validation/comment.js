const Validator = require('Validator'),
      isEmpty   = require('./is-empty');


module.exports = function validateCommentInput(data){
  const errors= {};
data.text=  !isEmpty(data.text) ? data.text : '';

if (Validator.isEmpty(data.text)) {
  errors.text = 'Text field is required';
}


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
