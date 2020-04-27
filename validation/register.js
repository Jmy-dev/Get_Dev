const Validator = require("validator"),
      isEmpty  = require("./is-empty") ;

module.exports = function validateRegisterInput(data){
  let errors = {};
  if(!Validator.isLength(data.name , {min: 3 , max: 30})){
    errors.name = "Name Must be between 3 and 30 characters!";
  }
  return{
    errors,
    isValid: isEmpty(errors)
  }
}
