const Validator = require("validator") ,
      isEmpty   = require("./is-empty");



module.exports = function validatePostInput(data){
  let errors ={};
  data.text    =    !isEmpty(data.text)    ?    data.text    : '' ;
  // data.likes    =    !isEmpty(data.likes)    ?    data.likes    : '' ;
  // data.comment    =    !isEmpty(data.comment)    ?    data.comment    : '' ;


  if(!Validator.isLength(data.text , {min:10 , max:300})){
    errors.text = 'Text field must be between 10 and 300 characters' ;
  }
  if(Validator.isEmpty(data.text)){
    errors.text = 'Text field is required' ;
  }
  return {
    errors ,
    isValid: isEmpty(errors)
  };
};
