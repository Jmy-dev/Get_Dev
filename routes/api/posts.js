const express              = require("express") ,
      mongoose             = require('mongoose'),
      Post                 = require("../../models/Post"),
      Profile              = require("../../models/Profile"),
      validatePostInput    = require("../../validation/post"),
      validateCommentInput    = require("../../validation/comment"),
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

router.delete('/:id' , passport.authenticate('jwt' , {session:false}), (req, res)=>{
  const errors = {};
  Profile.findOne({user :req.user.id})
  .then( profile =>{
    Post.findById(req.params.id)
    .then(post =>{
      //check for owner

      if(post.user.toString() !== req.user.id){
        return res.status(401).json({notauthorized: 'User not authorized'});
      }
      //delete
      post.remove().then(()=> res.status(200).json({sucess: true}));
    })
    .catch(err => res.status(404).json({postnotfound: 'No post founded'}));
  })

})


//  @route   Get api/posts/id
//  @desc    get a post
//  @access  public

router.get("/:id" , (req, res)=>{
  const errors={};
  Post.findById(req.params.id)
  .then(post =>{
    if (!post) {
      errors.nonpost='there is no post';
      return res.status(404).json(errors);
    }
    res.json(post);
  })
  .catch(err => res.json(err));
})


//@route post api/posts/edit/:id
//@desc edit a posts
//@access Private

router.post("/edit/:id" , passport.authenticate('jwt' , {session:false}), (req, res)=>{
  const {errors , isValid} = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const updatedPost = {};
  updatedPost.user = req.user.id;
  if(req.body.text) updatedPost.text = req.body.text;
  if(req.body.name) updatedPost.name = req.body.name;
  if(req.body.avatar) updatedPost.avatar = req.body.name;
  Profile.findOne({user:req.user.id})
  .then( profile =>{
   Post.findById(req.params.id)
   .then(post =>{
     console.log(post);
     //check for user
     if(post.user.toString() !== req.user.id){
       return res.status(401).json({notauthorized: 'User not authorized'});
     }
     Post.findByIdAndUpdate(req.params.id , {$set:updatedPost} , {new:true} )
     .then(newPost =>{
       if (!newPost) {
         res.status(400).json({nopost: ' there is no post'});
       }
       res.json(newPost);
     })
     .catch(err => res.json(err));


  })
  })
});

//@route Post api/posts/like/:id
//@desc add like
//@access private
router.post('/like/:id' , passport.authenticate('jwt' , {session:false}) , (req, res)=>{
  Profile.findOne({user:req.user.id})
  .then(profile =>{
    Post.findById(req.params.id)
    .then(post =>{
      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({alreadyliked : 'user already liked this post'});
      }
      post.likes.unshift({user:req.user.id})

      post.save().then(post =>  res.json(post))
    })
    .catch(err => res.status(404).json({postnotfound: 'post not founded'}));
  })
})

//@route Post api/posts/unlike/:id
//@desc remove a like
//@access private

router.post('/unlike/:id', passport.authenticate('jwt' , {session:false}) , (req ,res)=>{
  Profile.findOne({user:req.user.id})
  .then(profile =>{
    Post.findById(req.params.id)
    .then(post =>{
      if(post.likes.filter(like => like.user.toString() === req.user.id).length ===0){
        res.status(400).json({notliked: 'there is no like to remove'});
      }
      // find the removeIndex
      const removeIndex = post.likes.map(item => item.user.toString())
      .indexOf(req.user.id)

      //splice out of the array
      post.likes.splice(removeIndex , 1);
      post.save()
      .then(post => res.json(post));
    })

  })
})

// @route Post api/posts/comment/:id
// @desc  add a comment
// @acess private
router.post('/:id/comment' , passport.authenticate('jwt' , {session:false}),(req, res)=>{
  const {errors , isValid} = validateCommentInput(req.body);
  if (!isValid) {
    res.status(400).json(errors)
  }
  const commentFields = {};
  commentFields.user = req.user.id ;
  commentFields.text = req.body.text ;
  commentFields.avatar = req.user.avatar ;
  commentFields.name = req.user.name ;
  Profile.findOne({user: req.user.id})
  .then(profile =>{
    Post.findById(req.params.id)
    .populate('user' , ['name' , 'avatar'])
    .then(post =>{
      if (!post) {
        res.status(404).json({nopost:' post not founded'});
      }
      post.comments.unshift(commentFields);

      post.save().then(res.json(post));
    })
    .catch(err => res.json(err));
  })
})

// @route delete  api/posts/:id/comment/:comment_id
// @desc remove comment
// @acess private

router.delete('/:id/comment/:comment_id' , passport.authenticate('jwt' , {session: false}) , (req , res)=>{
  Profile.findOne({user: req.user.id})
  .then( profile =>{
      Post.findById(req.params.id)
        .then(post =>{

          //check to see if comment is exist
          if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id ).length !== 0){
            //find removeIndex
          const removeIndex =  post.comments.map(item => item.id).indexOf(req.params.comment_id);
            // check for owner
            if(post.comments[removeIndex].user.toString() !== req.user.id){
                return res.json({notauthorized: 'User are not authorized '});

            }else{
              //splice index
              post.comments.splice(removeIndex , 1);
              //save
              post.save()
              .then(post => res.json(post));
            }

          }
          else{
            res.status(404).json({nocomment:'comment not founded'});

          }


        })
    })
  })

  // @route post  api/posts/:id/comment/:comment_id
  // @desc edit a comment
  // @acess private

  router.post('/:id/comment/:comment_id' , passport.authenticate('jwt' , {session: false}) , (req , res)=>{
    const {errors , isValid} = validateCommentInput(req.body);
    if (!isValid){
      res.status(400).json(errors);
    }
    const updatedComment= {};
    updatedComment.user = req.user.id;
    updatedComment.avatar = req.user.avatar;
    updatedComment.name = req.user.name;
    if (req.body.text) {
      updatedComment.text = req.body.text ;
    }
    Profile.findOne({user: req.user.id})
    .then( profile =>{
        Post.findById(req.params.id)
          .then(post =>{
            //check if comment is exsist
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length !== 0){

              //find updateIndex
            const updateIndex =  post.comments.map(item => item.id).indexOf(req.params.comment_id);
            // check owner
            if (post.comments[updateIndex].user.toString() !== req.user.id) {
              return res.json({notauthorized: 'User are not authorized '});
              }
              else{
                post.comments[updateIndex] = updatedComment ;

                post.save()
                .then(post => res.json(post));
              }

            }
            else{
              return res.status(404).json({noComment: 'The comment is not founded!'})
            }
          })
      })
    })

    // if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id ).length !== 0){
    //   //find removeIndex
    // const removeIndex =  post.comments.map(item => item.id).indexOf(req.params.comment_id);
    //   // check for owner
    //   if(post.comments[removeIndex].user.toString() !== req.user.id){
    //       return res.json({notauthorized: 'User are not authorized '});
    //
    //   }
//  @route   get api/posts/all
//  @desc    get all posts
//  @access  public
router.get("/" , (req, res)=>{
  const errors = {};
  Post.find()
  .sort({date: -1})
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
