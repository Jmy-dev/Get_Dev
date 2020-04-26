const express = require("express") ,
      router = express.Router();
// @route    GET api/profile/test
// @desc     Tests profile route
// @access   public
router.get("/test" , (req, res)=>{
  res.json({
    msg: "profile works!!"
  })
})
module.exports = router;
