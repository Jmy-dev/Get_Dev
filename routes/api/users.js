const express = require("express") ,
      User    = require("../../models/User"),
      bcrypt  = require("bcryptjs"),
      gravatar = require("gravatar"),
      router = express.Router();

      //  @route   GET api/users/Test
      //  @desc    Tests users route
      //  @access  public

router.get("/test" , (req, res)=>{
  res.json({
    msg: "User works!!"
  })
})
//  @route   post api/users/register
//  @desc    register a user
//  @access  public

router.post("/register" , (req , res)=>{
  User.findOne({email: req.body.email})
  .then(user =>{
    if(user){
      res.status(400).json({ email: "Email already exists!!"})
    }
    else{
      const avatar = gravatar.url(req.body.email , {
        s: "200" , //size
        r: "pg" , //rating
        d: "mm"   //default
      })
      const newUser = new User({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        avatar
      })
   bcrypt.genSalt(10 , (err , salt)=>{
     bcrypt.hash(newUser.password , salt , (err, hash)=>{
       if(err){
         console.log(err);
       } else{
         newUser.password = hash;
         newUser.save()
         .then(user => res.json(user))
         .catch( err=> console.log(err));
       }

     })
   })
    }
  })
})

module.exports = router;
