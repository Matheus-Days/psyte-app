import fs from "fs";
import path from "path";

import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheets } from "@material-ui/core";
import { StaticRouter } from "react-router-dom";

import App from "../src/App.jsx";

const injectHTML = (data, body) => {
  data = data.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  return data;
};

const injectStyle = (data, style) => {
  data = data.replace(
    '<style id="jss-server-side"></style>',
    `<style id="jss-server-side">${style}</style>`
  );

  return data;
};

const htmlData = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");

const notRenderArr = ["/scheduler", "/videoroom", "/options"];

export default (req, res) => {
  const context = {};
  const sheets = new ServerStyleSheets();

  const reducer = (acc, cur) => {
    const shouldNotRender = cur === req.path;
    return acc || shouldNotRender;
  };

  const shouldRender = !notRenderArr.reduce(reducer, false);

  if (shouldRender) {
    const html = renderToString(
      sheets.collect(
        <StaticRouter location={req.path} context={context}>
          <App />
        </StaticRouter>
      )
    );
    const cssString = sheets.toString();

    if (context.url) {
      res.redirect(context.url);
      return res.end();
    }

    let response = injectHTML(htmlData, html);
    response = injectStyle(response, cssString);
    res.status(200).send(response);
  } else {
    res.status(200).send(htmlData);
  }
};
