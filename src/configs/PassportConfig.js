const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const userAccountService = require("../services/UserAccountsService");
const passwordUtils = require("../utils/passwordUtils");
const crypto = require("crypto");

//Local strategy to authenticate the user signing in
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await userAccountService.getUserAccount(email);
      if (!user) {
        return done(null, false, { message: "Invalid email" });
      }

      const storedPassword = Buffer.from(user.password, "hex");
      const hashedPassword = Buffer.from(
        await passwordUtils.hashPassword(
          password,
          Buffer.from(user.salt, "hex")
        ),
        "hex"
      );

      if (!crypto.timingSafeEqual(storedPassword, hashedPassword)) {
        return done(null, false, { message: "Invalid password" });
      }
      return done(null, user);
    }
  )
);

//JWT strategy to authenticate the user
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (jwtPayload, done) => {
      if (jwtPayload.exp > Date.now() / 1000) {
        return done(null, jwtPayload.user);
      } else {
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
