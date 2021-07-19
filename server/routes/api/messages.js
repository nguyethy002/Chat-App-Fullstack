const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      //find the conversation based on its Id and then check if the
      //conversation's users' Id have the same Id as sender and recipient
      const conversation = await Conversation.findByPk(conversationId);
      if (
        (senderId === conversation.user1Id &&
          recipientId === conversation.user2Id) ||
        (recipientId === conversation.user1Id &&
          senderId === conversation.user2Id)
      ) {
        const message = await Message.create({
          senderId,
          text,
          conversationId,
        });
        return res.json({ message, sender });
      }
      return res.sendStatus(403);
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers[sender.id]) {
        sender.online = true;
      }
    }

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    return res.json({ message, sender });

  } catch (error) {
    next(error);
  }
});

router.patch("/is-read", async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  try {
    if (!req.body.messageIdArray) {
      return res.sendStatus(400);
    }
    const messageIdArray = req.body.messageIdArray;
    for (let i = 0; i < messageIdArray.length; i++) {
      await Message.update(
        { isRead: true },
        { where: { id: messageIdArray[i] } }
      );
    }
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
