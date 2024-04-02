const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oidc");

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

      if (user.source !== "local") {
        return done(null, false, {
          message: "User can't sign in using password.",
        });
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

//Sign in with google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    },
    async (accessToken, profile, done) => {
      user = {
        email: profile.emails[0].value,
        source: "google",
      };

      if (!userAccountService.getUserAccount(user.email)) {
        userAccountService.addUserAccount(user);
      }

      return done(null, user);
    }
  )
);

module.exports = passport;
