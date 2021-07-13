import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { connect } from "react-redux";
import { markMessageAsRead } from "../../store/utils/thunkCreators";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  useEffect(() => {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].isRead === false && messages[i].senderId !== userId) {
        props.markMessageAsRead(messages[i].id);
      }
    }
  }, [messages]);
  let lastMessage = messages[messages.length-1];
  console.log("this is last message", messages[0]);
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} lastMessage = {lastMessage} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    markMessageAsRead: (messageId) => {
      dispatch(markMessageAsRead(messageId));
    },
  };
};

export default connect(() => {}, mapDispatchToProps)(Messages);
