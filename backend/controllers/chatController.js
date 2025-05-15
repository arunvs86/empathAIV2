import * as chatService from "../services/chat/chatService.js";

/**
 * Create or retrieve a chat.
 * For one-to-one chats, expects a 'recipientId' in the request body.
 * For group chats, you can supply a 'participants' array (and/or a 'groupId').
 */
export const createChat = async (req, res) => {
  try {
    // Get the logged-in user's ID from auth middleware.
    const userId = req.user.id;
    const { recipientId, isGroup, groupId, participants } = req.body;

    let chatParticipants;
    if (!isGroup) {
      // One-to-one chat: require a recipientId.
      if (!recipientId) {
        return res.status(400).json({ error: "recipientId is required for one-to-one chat." });
      }
      chatParticipants = [userId, recipientId];
    } else {
      // Group chat: use provided participants, ensuring the logged-in user is included.
      if (participants && Array.isArray(participants) && participants.length > 0) {
        chatParticipants = participants;
        if (!chatParticipants.includes(userId)) {
          chatParticipants.push(userId);
        }
      } else {
        // If no participants provided, default to the logged-in user.
        chatParticipants = [userId];
      }
    }

    const chat = await chatService.createOrGetChat({ participants: chatParticipants, isGroup, groupId });
    return res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error creating chat." });
  }
};

/**
 * Retrieve all chats for the logged-in user.
 */
export const getUserChats = async (req, res) => {
  try {
    console.log("Coming here")
    const userId = req.user.id;
    const chats = await chatService.getUserChats(userId);
    return res.json(chats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching user chats." });
  }
};


export const sendMessage = async (req, res) => {
  try {
    // Use overrideSenderId if provided; otherwise, use the logged-in user's id.
    console.log("Bot id:" , req.body.overrideSenderId)
    const senderId = req.body.overrideSenderId || req.user.id;
    const { chatId, content, media, messageType } = req.body;

    const updatedMessageDoc = await chatService.sendMessage({
      chatId,
      senderId,
      content,
      media,
      messageType,
    });

    // The newly added message is assumed to be the last element in updatedMessageDoc.messages.
    const newMessage = updatedMessageDoc.messages[updatedMessageDoc.messages.length - 1];

    return res.json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error sending message." });
  }
};


/**
 * Retrieve messages for a specific chat.
 */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ error: "chatId is required." });
    }

    const messageDoc = await chatService.getChatMessages(chatId);
    if (!messageDoc) {
      return res.status(404).json({ error: "No messages found for this chat." });
    }
    return res.json(messageDoc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching messages." });
  }
};
