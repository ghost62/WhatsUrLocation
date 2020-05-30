import React, { useContext } from "react";
import Context from "../context";
import { withStyles } from "@material-ui/core/styles";
import CreatePin from "./Pin/CreatePin";
import NoContent from "./Pin/NoContent";
import { Paper } from "@material-ui/core";

const Blog = ({ classes }) => {
  let BlogContent;
  const { state } = useContext(Context);
  const { draft } = state;
  if (!draft) {
    //  NoContent
    BlogContent = NoContent;
  } else if (draft) {
    BlogContent = CreatePin;
  }

  return (
    <Paper className={classes.root}>
      <BlogContent />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center",
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll",
  },
};

export default withStyles(styles)(Blog);
