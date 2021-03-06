const passport = require("passport");
const passportJwt = require("passport-jwt");
const { Strategy, ExtractJwt } = passportJwt;
const { authSecret } = JSON.parse(process.env.authSecret);

module.exports = (app) => {
  const opts = {
    secretOrKey: authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(opts, (payload, done) => {
    app
      .db("users")
      .where({ id: payload.id })
      .first()
      .then((user) => done(null, user ? { ...payload } : false))
      .catch((err) => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate("jwt", { session: false }),
  };
};
