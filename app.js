const express     = require("express"),
      mongoose    = require("mongoose"),
      users       = require("./routes/api/users"),
      profile       = require("./routes/api/profile"),
      posts       = require("./routes/api/posts"),
      app  = express() ,
      port = process.env.Port || 3000 ;

// DB Config
const db = require('./config/keys.js').mongoURI;

//Connect to mongodb
mongoose
.connect(db, {useNewUrlParser : true ,  useUnifiedTopology: true })
.then(()=> console.log('mongodb connected'))
.catch(err => console.log(err));

app.get("/" , (req, res)=>{
  res.send("hello in our app!!");
})

//use routes
app.use("/api/users" , users);
app.use("/api/profile" , profile);
app.use("/api/posts" , posts);

app.listen(port , ()=>{
  console.log(`Server runing on port ${port}`);
})
