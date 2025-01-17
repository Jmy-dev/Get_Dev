const Validator = require("validator") ,
      isEmpty   = require("./is-empty");

module.exports  = function validateEducationInput(data){
   const errors = {};
  data.school = !isEmpty(data.school) ? data.school : '' ;
  data.degree = !isEmpty(data.degree) ? data.degree : '' ;
  data.from = !isEmpty(data.from) ? data.from : '' ;
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '' ;


  if(!Validator.isLength(data.school , {min:3 , max:30})){
    errors.school = 'school must be between 3 and 30 characters';
  }
  if(Validator.isEmpty(data.school)){
    errors.school = 'School field is required';
  }

  if(Validator.isEmpty(data.from)){
    errors.from = 'From field is required';
  }

  if(Validator.isEmpty(data.degree)){
    errors.degree = 'Degree field is required';
  }

  if(Validator.isEmpty(data.fieldofstudy)){
    errors.fieldofstudy = 'Fieldofstudy field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}
