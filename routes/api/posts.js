const express = require("express") ,
      router = express.Router();
//  @route   GET api/posts/Test
//  @desc    Tests posts route
//  @access  public
router.get("/test" , (req, res)=>{
  res.json({
    msg: "Posts works!!"
  })
})
module.exports = router;
