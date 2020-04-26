const express = require("express") ,
      router = express.Router();

      //  @route   GET api/users/Test
      //  @desc    Tests users route
      //  @access  public

router.get("/test" , (req, res)=>{
  res.json({
    msg: "User works!!"
  })
})

module.exports = router;
