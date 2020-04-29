const Validator = require("validator") ,
      isEmpty   = require("./is-empty");

module.exports  = function validateExperienceInput(data){
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : '' ;
  data.company = !isEmpty(data.company) ? data.company : '' ;
  data.from = !isEmpty(data.from) ? data.from : '' ;



  if(!Validator.isLength(data.title , {min:5 , max:30})){
    errors.title = 'Title must be between 5 and 30 characters';
  }
  if(Validator.isEmpty(data.title)){
    errors.title = 'Title field is required';
  }

  if(Validator.isEmpty(data.from)){
    errors.from = 'From field is required';
  }

  if(Validator.isEmpty(data.company)){
    errors.company = 'Company field is required';
  }
  if(!Validator.isLength(data.company , {min:5 , max:30})){
    errors.company = 'Company name must be between 5 and 30 characters';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
