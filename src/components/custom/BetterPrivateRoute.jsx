import React from "react";
import { Route, Redirect } from "react-router-dom";
import getUserData from "../scripts/getUserData";

const BetterPrivateRoute = ({ children, ...rest }) => {
  const isAuthenticated = !!getUserData().token;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/shouldsignin",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default BetterPrivateRoute;
