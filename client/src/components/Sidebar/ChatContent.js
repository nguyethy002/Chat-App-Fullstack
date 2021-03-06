import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: -0.17,
  },
  notification: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, messages } = conversation;
  const numUnread = messages.reduce(
    (curCount, curMessage) =>
      !curMessage.isRead && curMessage.senderId === otherUser.id
        ? curCount + 1
        : curCount,
    0
  );

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={numUnread > 0 ? classes.unreadText : classes.previewText}
        >
          {latestMessageText}
        </Typography>
      </Box>
      {numUnread > 0 && (
        <Box className={classes.bubble}>
          <Typography className={classes.notification}>{numUnread}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
