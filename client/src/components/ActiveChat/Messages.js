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

  const sortedList = messages.sort(
    (messageA, messageB) => messageB.id - messageA.id
  );
  let lastMessageId;
  for (let i = sortedList.length - 1; i >= 0; i--) {
    const message = sortedList[i];
    if (message.senderId === userId) {
      lastMessageId = message.id;
    }
  }

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            isLastMessage={message.id === lastMessageId}
            isRead={message.isRead}
          />
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

export default connect(() => ({}), mapDispatchToProps)(Messages);
