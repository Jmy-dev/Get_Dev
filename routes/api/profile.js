const express       = require("express") ,
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      User          = require("../../models/User"),
      Profile       = require("../../models/Profile"),
      router        = express.Router();
// @route    GET api/profile/test
// @desc     Tests profile route
// @access   public
router.get("/test" , (req, res)=>{
  res.json({
    msg: "profile works!!"
  })
})

// @route    GET api/profile/currentUser
// @desc     get currentUser profile
// @access   Private

router.get("/" , passport.authenticate('jwt' , {session :false}) , (req, res)=>{
  const errors = {};
  Profile.findOne({user: req.user.id})
  .then(profile =>{
    if(!profile){
      errors.noprofile = 'Profile not exists';
      return res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => console.log(err))
});







module.exports = router;
