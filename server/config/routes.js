module.exports = (app) => {
  app.post("/api/signin", app.server.api.authentication.signin);
  app.post("/api/signup", app.server.api.user.addUser);

  app
    .route("/api/users")
    .all(app.server.config.passport.authenticate())
    .post(app.server.api.user.addUser)
    .get(app.server.api.user.getUser);

  app
    .route("/api/users/:id")
    .all(app.server.config.passport.authenticate())
    .put(app.server.api.user.updateUser)
    .get(app.server.api.user.getUserById)
    .delete(app.server.api.user.removeUser);

  app
    .route("/api/schedule")
    .all(app.server.config.passport.authenticate())
    .get(app.server.api.calendar.getAppointment)
    .post(app.server.api.calendar.scheduleSession)
    .put(app.server.api.calendar.deleteSession);

  app
    .route("/api/sessions")
    .all(app.server.config.passport.authenticate())
    .post(app.server.api.calendar.getSessionsList);
};
