import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import {markMessageAsRead} from '../../store/utils/thunkCreators'
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  chatWrapper: {
    overflow: "auto",
    maxHeight: "500px",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, markMessageAsRead } = props;
  const conversation = props.conversation || {};

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Box className={classes.chatWrapper}>
              <Messages
                messages={conversation.messages}
                otherUser={conversation.otherUser}
                userId={user.id}
                markMessageAsRead ={markMessageAsRead}
              />
            </Box>

            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    markMessageAsRead: (messageId, convoId) => {
      dispatch(markMessageAsRead(messageId, convoId));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
