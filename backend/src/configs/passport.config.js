const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oidc");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const crypto = require("crypto");
const uuid = require("uuid");
const createError = require("http-errors");

const userAccountService = require("../services/user/user.service");
const passwordUtils = require("../utils/password.utils");
const envConfig = require("./env.config");

//Local strategy to authenticate the user signing in
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await userAccountService.getUserByEmail(email);
      if (!user) {
        return done(createError(401, "User not found. Please sign up."));
      }

      if (!user.password) {
        return done(createError(401, "User doesn't have a password. Sign in with other methods."));
      }

      if (await passwordUtils.doPasswordsMatch(user.password, password, user.salt)) {
        return done(null, user);
      }
      return done(createError(401, "Incorrect email or password. Please try again."));
    }
  )
);

//JWT strategy to authenticate the user

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.JWT_SECRET_KEY,
      passReqToCallback: true,
    },
    async (req, jwtPayload, done) => {
      const requestToken = req.headers.authorization.split(" ")[1];
      const isTokenStored = await userAccountService.hasToken(jwtPayload.user.id, requestToken);

      if (jwtPayload.exp > Date.now() / 1000 && isTokenStored) {
        return done(null, jwtPayload.user);
      } else {
        return done(createError(401, "Unauthorized"));
      }
    }
  )
);

//Sign in with google
passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: envConfig.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    },
    async (accessToken, profile, done) => {
      const userEmail = profile.emails[0].value;
      try {
        existingUser = await userAccountService.getUserByEmail(userEmail);
        if (existingUser) {
          return done(null, existingUser);
        }
        user = {
          id: uuid.v4(),
          email: userEmail,
          source: "google",
        };

        await userAccountService.addUserAccount(user);
        return done(null, user);
      } catch (error) {
        console.error("Error in google strategy: ", error);
        return done(createError(500, "Internal server error"));
      }
    }
  )
);

module.exports = passport;
