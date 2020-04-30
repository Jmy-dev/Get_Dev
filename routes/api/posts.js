const express              = require("express") ,
      mongoose             = require('mongoose'),
      Post                 = require("../../models/Post"),
      validatePostInput    = require("../../validation/post"),
      passport = require('passport'),

      router = express.Router();
//  @route   GET api/posts/Test
//  @desc    Tests posts route
//  @access  public
router.get("/test" , (req, res)=>{
  res.json({
    msg: "Posts works!!"
  })
})

//  @route   Post api/posts/
//  @desc    add a post
//  @access  private

router.post("/" , passport.authenticate('jwt' , {session:false}), (req, res)=>{
  const {errors , isValid} = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const postFields = {};
  postFields.user = req.user.id;
  if(req.body.text) postFields.text = req.body.text;
  if(req.body.name) postFields.name = req.body.name;
  if(req.body.avatar) postFields.avatar = req.body.name;
  //likes
  // if(typeof req.body.likes !== 'undefined'){
  //   postFields.likes = req.body.likes ;
  // }
  // //comments
  // if(typeof req.body.comments !== 'undefined'){
  //   postFields.comments = req.body.comments ;
  // }
  // if(req.body.comments.text) postFields.comments.text = req.body.comments.text;
  // if(req.body.comments.name) postFields.comments.name = req.body.comments.name;
  // if(req.body.comments.avatar) postFields.comments.avatar = req.body.comments.avatar;
  // if(req.body.comments.date) postFields.comments.date = req.body.comments.date;

  const newPost = new Post(postFields).save()
  .then(post =>{
    res.json(post)
  })
  .catch(err => res.json(err));
})

//  @route   delete api/posts/:post_id
//  @desc    delete  post
//  @access  Private

router.delete('id' , passport.authenticate('jwt' , {session:false}), (req, res)=>{
  const errors = {};
  Post.findOneAndRemove({user:req.params.id})
  .then(()=>{
    res.json({success: 'true'});
  })
  .catch(err => res.json(err));
})


//  @route   Get api/posts/id
//  @desc    get a post
//  @access  public

// router.get("/:id" , (req, res)=>{
//   const errors
// })











//  @route   get api/posts/all
//  @desc    get all posts
//  @access  public
router.get("/all" , (req, res)=>{
  const errors = {};
  Post.find()
  .sort({date: -1})
  .populate('user' , ['name' , 'avatar'])
  .then(posts =>{
    if (!posts) {
      errors.nonposts= 'Ther is no posts yet';
      return res.status(404).json(errors)
    }
    res.json(posts);
  })
  .catch(err => res.json(err));
})


module.exports = router;
