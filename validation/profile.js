const Validator = require('validator') ,
      isEmpty   = require('./is-empty');


module.exports = function validateProfileInput(data){
 let errors = {};
 data.handle      = !isEmpty(data.handle)        ? data.handle        : '' ;
 data.bio         = !isEmpty(data.bio)           ? data.bio           : '' ;
 data.status      = !isEmpty(data.status)        ? data.status        : '' ;
 data.skills      = !isEmpty(data.skills)        ? data.skills        : '' ;


 if(!Validator.isLength(data.handle , {min:3 , max:40})){
   errors.handle = 'Handle must be between 3 and 40 characters';
 }

if(Validator.isEmpty(data.handle)){
 errors.handle = 'Handle field is required';
}

if(Validator.isEmpty(data.status)){
  errors.status = 'Status field is required';
}
if(Validator.isEmpty(data.skills)){
  errors.skills = 'Skills field is required';
}
if(Validator.isEmpty(data.bio)){
  errors.bio = ' Bio field is required';
}
if(!isEmpty(data.website)){
  if(!Validator.isURL(data.website)){
    errors.website = 'Not a valid URL' ;
  }
}
//======================
// experience Validation
//======================

//======================
// education Validation
//======================

// if(Validator.isEmpty(data.education.school)){
//   errros.education.school = 'School filed is required';
// }
// if(Validator.isEmpty(data.education.degree)){
//   errros.education.degree = 'Degree filed is required';
// }
// if(Validator.isEmpty(data.education.fieldodstudy)){
//   errros.education.fieldodstudy = 'Fieldodstudy filed is required';
// }
//
// if(Validator.isEmpty(data.education.from)){
//   errros.education.from = 'From filed is required';
// }
//======================
// Social Validation
//======================
if(!isEmpty(data.youtube)){
  if (!Validator.isURL(data.youtube)) {
    errors.youtube = 'invalid URL';
  }
}
if(!isEmpty(data.facebook)){
  if (!Validator.isURL(data.facebook)) {
    errors.facebook = 'invalid URL';
  }
}
if(!isEmpty(data.linkedin)){
  if (!Validator.isURL(data.linkedin)) {
    errors.linkedin = 'invalid URL';
  }
}
if(!isEmpty(data.instagram)){
  if (!Validator.isURL(data.instagram)) {
    errors.instagram = 'invalid URL';
  }
}
if(!isEmpty(data.twitter)){
  if (!Validator.isURL(data.twitter)) {
    errors.twitter = 'invalid URL';
  }
}




return {
  errors,
  isValid : isEmpty(errors)
}
}
