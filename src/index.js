import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");

const AppDOM = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if (root.hasChildNodes() === true) {
  ReactDOM.hydrate(<AppDOM />, root);
} else {
  ReactDOM.render(<AppDOM />, root);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
