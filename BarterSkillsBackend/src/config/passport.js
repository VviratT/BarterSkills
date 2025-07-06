import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User} from "../models/user.model.js";

import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("🔍 Passport: GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);


passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split("@")[0], // use email prefix as username
          avatar: profile.photos[0].value,
          isGoogleUser: true
        });

        return done(null, newUser);
      } catch (err) {
        console.error("Error in GoogleStrategy callback:", err);
        return done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
