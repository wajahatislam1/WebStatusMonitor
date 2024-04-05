const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oidc");

const userAccountService = require("../services/user/user.service");
const passwordUtils = require("../utils/password.utils");
const crypto = require("crypto");

const envConfig = require("./env.config");

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
        return done(null, false, { message: "User can't sign in using password." });
      }

      const storedPassword = Buffer.from(user.password, "hex");
      const hashedPassword = Buffer.from(
        await passwordUtils.hashPassword(password, Buffer.from(user.salt, "hex")),
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
      secretOrKey: envConfig.JWT_SECRET_KEY,
      passReqToCallback: true,
    },
    async (req, jwtPayload, done) => {
      const requestToken = req.headers.authorization.split(" ")[1];
      const isTokenStored = await userAccountService.hasToken(jwtPayload.user.email, requestToken);

      if (jwtPayload.exp > Date.now() / 1000 && isTokenStored) {
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
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: envConfig.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    },
    async (accessToken, profile, done) => {
      user = {
        email: profile.emails[0].value,
        source: "google",
      };
      existingUser = await userAccountService.getUserAccount(user.email);
      if (!existingUser) {
        await userAccountService.addUserAccount(user);
      }

      return done(null, user);
    }
  )
);

module.exports = passport;
