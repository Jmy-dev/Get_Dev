const express       = require("express") ,
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      User          = require("../../models/User"),
      Profile       = require("../../models/Profile"),
      validateProfileInput = require("../../validation/profile"),
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
              }else{
                //create
                new Profile(profileFields).save()
                .then(profile => res.json(profile))
              }
            })

        }
      })
});







module.exports = router;
