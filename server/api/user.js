const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jwt-simple");
const { authSecret } = JSON.parse(process.env.authSecret);

const isNotExpired = (userData) => {
  try {
    if (new Date(userData.exp * 1000) > new Date()) {
      return true;
    }
  } catch (err) {
    return false;
  }
};

const extractToken = (req) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    return jwt.decode(token, authSecret);
  } catch (err) {
    return {
      id: null,
      name: null,
      email: null,
      admin: null,
      iat: null,
      exp: null,
    };
  }
};

const encrypt = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

module.exports = (app) => {
  const { filledOrErr, equalsOrErr } = app.server.api.validation;

  const addUser = (req, res) => {
    const user = { ...req.body };

    if (!req.originalUrl.startsWith("/users")) user.admin = false;
    if (!req.user || !req.user.admin) user.admin = false;

    try {
      filledOrErr(user.name, "Informe seu nome.");
      filledOrErr(user.email, "Informe um e-mail.");
      filledOrErr(user.phone, "Informe um número de telefone.");
      filledOrErr(user.password, "Digite uma senha.");
      filledOrErr(user.confirmPassword, "Confirme a senha.");
      equalsOrErr(user.password, user.confirmPassword, "Senhas não conferem.");

      const dbUser = app.db("users").where({ email: user.email }).first();
      user.id = dbUser.id;

      user.password = encrypt(user.password);
      delete user.confirmPassword;
      if (user.id) return res.status(400).send("E-mail já cadastrado.");
      if (!user.id)
        app
          .db("users")
          .insert(user)
          .then((_) => res.status(204).send())
          .catch((err) => res.status(500).send(err));
    } catch (err) {
      res.status(400).send(err);
    }
  };

  const updateUser = async (req, res) => {
    const user = { ...req.body };

    if (req.params.id) user.id = req.params.id;

    delete user.confirmPassword;
    if (user.name) {
      app
        .db("users")
        .update({ name: user.name })
        .where({ id: user.id })
        .whereNull("deletedAt")
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send());
    }
    if (user.newPassword) {
      app
        .db("users")
        .select("password")
        .where({ id: user.id })
        .first()
        .then((data) => {
          if (bcrypt.compareSync(user.oldPassword, data.password)) {
            user.newPassword = encrypt(user.newPassword);
            app
              .db("users")
              .update({ password: user.newPassword })
              .where({ id: user.id })
              .whereNull("deletedAt")
              .then((_) => {
                res.status(204).send();
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("Updating problem");
              });
          } else {
            res.status(400).send("Invalid password");
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Problem finding user");
        });
    }
  };

  const getUser = (req, res) => {
    const userData = extractToken(req);

    if (isNotExpired(userData) && userData.admin)
      app
        .db("users")
        .select("id", "name", "email", "admin")
        .whereNull("deletedAt")
        .then((users) => res.json(users))
        .catch((err) => res.status(500).send(err));
    else res.status(401).send("Must be admin and have non expired token.");
  };

  const getUserById = async (req, res) => {
    const user = await app
      .db("users")
      .select("id", "name", "email", "admin")
      .where({ id: req.params.id })
      .whereNull("deletedAt")
      .first()
      .catch((err) => res.status(500).send(err));

    if (!user) res.status(400).send("Usuário não encontrado!");
    else res.json(user);
  };

  const removeUser = async (req, res) => {
    app
      .db("users")
      .select("password")
      .where({ id: req.params.id })
      .whereNull("deletedAt")
      .first()
      .then((data) => {
        if (bcrypt.compareSync(req.body.confirmPassword, data.password)) {
          app
            .db("users")
            .update({ deletedAt: moment().format("YYYY-MM-DD HH:mm:ss") })
            .where({ id: req.params.id })
            .then(() => {
              res.status(204).send();
            })
            .catch((err) => res.status(500).send(err));
        } else {
          res.status(400).send("Invalid password");
        }
      });
  };
  return { addUser, getUser, getUserById, updateUser, removeUser };
};
