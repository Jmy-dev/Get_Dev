const express       = require("express"),
      mongoose      = require("mongoose"),
      bodyParser    = require("body-parser"),
      users         = require("./routes/api/users"),
      profile       = require("./routes/api/profile"),
      posts         = require("./routes/api/posts"),
      keys          = require('./config/keys.js'),
      passport      = require("passport"),
      app  = express() ,
      port = process.env.Port || 3000 ;

// DB Config
const db = keys.mongoURI;

//Connect to mongodb
mongoose.connect(db, {useNewUrlParser : true ,  useUnifiedTopology: true })
.then(()=> console.log('mongodb connected'))
.catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);
//bodyParser middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//use routes
app.use("/api/users" , users);
app.use("/api/profile" , profile);
app.use("/api/posts" , posts);
 //====//
app.listen(port , ()=>{
  console.log(`Server runing on port ${port}`);
})
