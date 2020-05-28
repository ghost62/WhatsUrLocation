import React, { useContext } from "react";
import GoogleLogin from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken },
      });
      const data = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: data.me });
      dispatch({type:"IS_LOGGED_IN", payload: googleUser.isSignedIn()})
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = (err) => {
    console.error("Error Logging in", err);
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66,133,244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="679663330596-to3kh4h96djprin5hgnk78db7ror83e3.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme="dark"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default withStyles(styles)(Login);
