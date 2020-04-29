const express       = require("express") ,
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      User          = require("../../models/User"),
      Profile       = require("../../models/Profile"),
      validateProfileInput = require("../../validation/profile"),
      validateExperienceInput = require("../../validation/experience"),
      validateEducationInput = require("../../validation/education"),
      router        = express.Router();
// @route    GET api/profile/test
// @desc     Tests profile route
// @access   public
router.get("/test" , (req, res)=>{
  res.json({
    msg: "profile works!!"
  })
})

// @route    GET api/profile
// @desc     get currentUser profile
// @access   Private

router.get("/" , passport.authenticate('jwt' , {session :false}) , (req, res)=>{
  const errors = {};
  Profile.findOne({user: req.user.id})
  .populate('user' , ['name', 'avatar'])
  .then(profile =>{
    if(!profile){
      errors.noprofile = 'Profile not exists';
      return res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => console.log(err))
});



// @route    Get api/profile/developers
// @desc     find all developers profiles
// @access   public
router.get('/developers' , (req ,res)=>{
  const errors = {};
  Profile.find()
         .populate('user' , [ 'name' , 'avatar'])
         .then( profiles => {
           if (!profiles) {
             errors.noprofile = 'there is no profile for this user';
             return res.status(404).json(errors);
           }
           res.json(profiles);
         })
         .catch( err => res.status(404).json({profile: 'there is no profiles yet'}));

});



// @route    Get api/profile/handle/:handle
// @desc     find profile by handle
// @access   public
router.get('/handle/:handle' , (req ,res)=>{
  const errors = {};
  Profile.findOne({handle:req.params.handle})
         .populate('user' , [ 'name' , 'avatar'])
         .then( profile => {
           if (!profile) {
             errors.noprofile = 'there is no profile for this user';
             res.status(404).json(errors);
           }
           res.json(profile);
         })
         .catch( err => res.status(404).json({profile: 'there is no profile for this user'}));

});



// @route    Get api/profile/user/:user_id
// @desc     find profile by id
// @access   public
router.get('/user/:user_id' , (req ,res)=>{
  const errors = {};
  Profile.findOne({user:req.params.user_id})
         .populate('user' , ['name' , 'avatar'])
         .then( profile => {
           if (!profile) {
             errors.noprofile = 'there is no profile for this user';
             res.status(404).json(errors);
           }
           res.json(profile);
         })
         .catch( err => res.status(400).json({profile: 'there is no profile for this user'}));

});






// @route    POST api/profile
// @desc     create or eidt currentUser profile
// @access   Private

router.post("/" , passport.authenticate('jwt' , {session :false}) , (req, res)=>{
  const {errors , isValid} = validateProfileInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }
  const profileFields ={};
  profileFields.user = req.user.id ;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubname) profileFields.githubname = req.body.githubname;
  // skills
   if (typeof req.body.skills !== 'undefined'){
     profileFields.skills = req.body.skills
   }
   //social
   profileFields.social = {};
   if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
   if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
   if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
   if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
   if(req.body.twitter) profileFields.social.twitter = req.body.twitter;

   Profile.findOne({user: req.user.id})
      .populate('user' , ['name' , 'avatar'])
      .then( profile =>{
        if(profile){
          //update
          Profile.findOneAndUpdate({user : req.user.id} , {$set: profileFields}, {new: true })
             .populate('user' , ['name' , 'avatar'])
             .then( profile => res.json(profile))

        }else{
          //create

          //check for handle
          Profile.findOne({handle: profileFields.handle})
            .then(profile =>{
              if (profile) {
                errors.handle = 'that handle already exists';
                return res.status(400).json(errors)
              }
                //create
                new Profile(profileFields)
                .save()
                .then(profile => res.json(profile))
            })
            .catch(err => res.json(err));

        }
      })
});
// @route    POST api/profile/experience
// @desc    add experience
// @access   private

router.post('/experience', passport.authenticate('jwt' ,{session:false}) , (req,res)=>{
  const {errors , isValid} = validateExperienceInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
   .then(profile =>{
     const experience = {
       title:req.body.title        ,
       company:req.body.company      ,
       from:req.body.from         ,
       to :req.body.to           ,
       current:req.body.current      ,
       location:req.body.location    ,
       description: req.body.description
     }
    // Add to  exp array
    profile.experience.unshift(experience);
    profile.save()
    .then(profile =>  res.json(profile))
    .catch(err => console.log(err));

   })
});

// @route    POST api/profile/education
// @desc    add education
// @access   private

router.post('/education', passport.authenticate('jwt' ,{session:false}) , (req,res)=>{
  const {errors , isValid} = validateEducationInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
   .then(profile =>{
     const education = {
       school:req.body.school        ,
       degree:req.body.degree      ,
       from:req.body.from         ,
       to :req.body.to           ,
       current:req.body.current      ,
       fieldofstudy:req.body.fieldofstudy    ,
       description: req.body.description
     }

    // Add to  edu array
    profile.education.unshift(education);
    profile.save()
    .then(profile =>  res.json(profile))

   })
});

// @route   Delete api/profile/experience/:exp_id
// @desc     delete education
// @access   private

router.delete('/experience/:exp_id', passport.authenticate('jwt' ,{session:false}) , (req,res)=>{

  Profile.findOne({user: req.user.id})
   .then(profile => {
     const removeIndex = profile.experience
      .map( item => item.id)
      .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex , 1);
      profile.save()
      .then(profile => res.json(profile))
   })
   .catch(err => res.json(err));
   })

   // @route   Delete api/profile/education/:edu_id
   // @desc     delete education
   // @access   private

   router.delete('/education/:edu_id', passport.authenticate('jwt' ,{session:false}) , (req,res)=>{

     Profile.findOne({user: req.user.id})
      .then(profile => {
        const removeIndex = profile.education
         .map( item => item.id)
         .indexOf(req.params.edu_id);
         profile.education.splice(removeIndex , 1);
         profile.save()
         .then(profile => res.json(profile))
      })
      .catch(err => res.json(err));
      })


      // @route   Delete api/profile
      // @desc     delete user&profile
      // @access   private

router.delete('/' ,passport.authenticate('jwt' , {session:false}) , (req, res)=>{

  Profile.findOneAndRemove({user:req.user.id})
  .then(() =>{
    User.findOneAndRemove({_id:req.user.id})
    .then(()=>{
      res.json({success:'true'});
    })
  })

})



module.exports = router;
