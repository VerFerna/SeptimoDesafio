import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import google from "passport-google-oauth20";
import { UserModel } from "../dao/models/user.model.js";
import {
  createHash,
  isValidPassword,
  serializeUser,
  deserializeUser,
} from "../helpers/utils.js";

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;
const GoogleStrategy = google.Strategy;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await UserModel.findOne({ email });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            social: "Local",
          };

          console.log("desde passport", newUser.email, newUser.password);

          if (newUser.email === "verferna@admin.com") {
            newUser.rol = "adminVF123";
          }

          const result = await UserModel.create(newUser);

          return done(null, false);
        } catch (error) {
          return done(`Error: ${error}`);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });

          if (!user) {
            console.log("User doesn't exists");
            return done(null, false);
          }

          if (!isValidPassword(password, user)) {
            console.log("Password not valid");
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.ef5295edc776645e",
        clientSecret: "a32f87a635273d0a0d3a52ce821ebb06abba3d8e",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          const fullName = profile._json.name.split(" ");
          const name = fullName[0];
          const lastName = fullName[1];

          const user = await UserModel.findOne({ email });

          if (user) {
            console.log(`User ${email} already exists`);
            return done(null, user);
          }

          const newUser = {
            first_name: name,
            last_name: lastName,
            email: email,
            password: "",
            social: "GitHub",
          };

          const result = await UserModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: "84277374591-18jhbssf9g5nhe22lfromull0j0qh9dt.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/auth/google",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const email = profile._json.email;
          const name = profile._json.given_name;
          const lastName = profile._json.family_name;

          const user = await UserModel.findOne({ email: email });

          if (user) {
            console.log(`User ${email} already exists`);
            return cb(null, user);
          }

          const newUser = {
            first_name: name,
            last_name: lastName,
            email: email,
            password: "",
            social: "Google",
          };

          const result = await UserModel.create(newUser);

          return cb(null, result);
        } catch (error) {
          return cb(`Error: ${error}`);
        }
      }
    )
  );

  passport.serializeUser(serializeUser);

  passport.deserializeUser(deserializeUser);
};
