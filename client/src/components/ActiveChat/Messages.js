import React, { useEffect } from "react";import { Box } from "@material-ui/core";
import moment from "moment";
import { OtherUserBubble, SenderBubble } from "../ActiveChat";

const Messages = (props) => {
  const { messages, otherUser, userId, markMessageAsRead } = props;

  useEffect(() => {
    const unreadMessagesArr = [];
    messages.forEach((message) => {
      if (!message.isRead && message.senderId !== userId) {
        unreadMessagesArr.push(message.id);
      }
    });

    if (unreadMessagesArr.length > 0) {
      markMessageAsRead(unreadMessagesArr, messages[0].conversationId);
    }
  }, [messages, userId, markMessageAsRead]);

  const sortedList = [...messages].sort(
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



export default Messages;
