const LocalStrategy = require("passport-local").Strategy;

const initialize = (passport, getUserByUsername) => {
    passport.use(
        new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
            const user = getUserByUsername(username);
            if (!user) {
                return done(null, false, { message: "No user with that email" });
            }

            if (password !== user.password) {
                return done(null, false, { message: "Password incorrect" });
            }

            return done(null, user);
        })
    );
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((username, done) => done(null, getUserByUsername(username)));
};

module.exports = initialize;
