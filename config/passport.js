const  JwtStrategy = require('passport-jwt').Strategy ,
       ExtractJwt  = require('passport-jwt').ExtractJwt ,
       mongoose    = require("mongoose") ,
       keys        = require("../config/keys") ,
       User        = mongoose.model('users'),
      opts         = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey    = keys.secretOrKey ;

module.exports = passport =>{
  passport.use(new JwtStrategy(opts , (jwt_payload , done)=>{
    User.findById(jwt_payload.id)
    .then( user =>{
      if (user) {
        return done(null , user);
      }
      return done(null , false);
    })
    .catch(err => console.log(err));
  }));
}
