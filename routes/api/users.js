const express  = require("express") ,
      User     = require("../../models/User"),
      bcrypt   = require("bcryptjs"),
      passport = require("passport"),
      gravatar = require("gravatar"),
      keys     = require("../../config/keys"),
      jwt      = require("jsonwebtoken"),
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

//  @route   post api/users/Login
//  @desc    login a user // Return JWT token
//  @access  public

router.post("/login" , (req , res)=>{
const email = req.body.email ;
const password = req.body.password ;

User.findOne({email})
.then( user =>{
  if(!user){
    return res.status(404).json({email: "User not found"});
  }
  bcrypt.compare(password , user.password , (err , isMatch)=>{
    if (err) {
      console.log(err);
    }else{
      if (isMatch) {
        const payload ={id:user.id , name:user.name , avatar:user.avatar};
        //sign token
        jwt.sign(payload , keys.secretOrKey ,{expiresIn :3600}, (err , token)=>{
          if (err) {
            console.log(err);
          }else{
             return res.json({
               sucess:true ,
               token: "Bearer " + token
             })
          }
        })

      }
      else{
        return res.status(400).json({password:"incorrect Password!!"})
      }
    }
  })

})
});


//  @route   post api/users/currentUser
//  @desc    return current user
//  @access  private

router.get("/current" , passport.authenticate('jwt' , {session: false}) , (req , res)=>{
  res.json({
    id:req.user.id,
    name: req.user.name ,
    email: req.user.email
  });
})











module.exports = router;
