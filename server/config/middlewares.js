const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");

module.exports = (app) => {
  app.use((req, res, next) => {
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http"))
      res.redirect(`https://${req.headers.host}${req.url}`);
    else next();
  });
  app.use(bodyParser.json());
  app.use(cors());
  app.use(express.static(path.resolve("./build")));
};
