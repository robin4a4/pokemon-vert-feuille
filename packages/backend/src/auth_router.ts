import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models";

const auth_router = Router();

passport.use(
	new LocalStrategy((username, password, done) => {
		User.query()
			.findOne({ username })
			.then((user) => {
				if (!user) {
					return done(null, false, { message: "Incorrect username." });
				}
				if (user.password !== password) {
					return done(null, false, { message: "Incorrect password." });
				}
				return done(null, user);
			});
	}),
);

auth_router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	}),
);

auth_router.get("/logout", (req, res) => {
	// req.logout();
	res.redirect("/");
});

export { auth_router };
