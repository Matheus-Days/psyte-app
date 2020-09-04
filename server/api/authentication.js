const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const { authSecret } = JSON.parse(process.env.authSecret);

module.exports = (app) => {
  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("Informe usuário e senha.");
    }

    const user = await app
      .db("users")
      .where({ email: req.body.email })
      .whereNull("deletedAt")
      .first()
      .catch((err) => res.status(500).send(err));

    if (!user) return res.status(401).send("Usuário ou senha inválidos.");
    const isMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) return res.status(401).send("Usuário ou senha inválidos.");

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      iat: now,
      exp: now + 60 * 60 * 12,
    };

    res.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  };

  const validateToken = async (req, res) => {
    const user = req.body || null;
    try {
      if (user) {
        const token = jwt.decode(user.token, authSecret);
        if (new Date(token.exp * 1000) > new Date()) {
          return res.send(true);
        }
      }
    } catch (err) {
      res.status(401).send("Não autorizado.");
    }

    res.send(false);
  };

  return { signin, validateToken };
};
