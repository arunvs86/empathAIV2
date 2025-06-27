// src/services/chatApi.js
const BASE_URL = "https://empathaiv2-backend.onrender.com/chats";

export async function getMessages(chatId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
}

export async function getUserChats() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/myChats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user chats");
  }
  return response.json();
}


// chatApi.js
export async function sendMessage({ chatId, content, messageType,overrideSenderId }) {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://empathaiv2-backend.onrender.com/chats/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, content, messageType,overrideSenderId }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to send message");
  }
  const newMsg = await response.json(); // This is the new message object with a unique _id
  return newMsg;
}



export async function createChat(recipientId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }
  const response = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ recipientId })
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to create chat");
  }
  return response.json();
}

export async function createGroupChat(communityId, participantIds) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ communityId, participantIds }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create group chat");
  }
  return res.json();  // returns the Chat object
}


export async function getGroupChats(communityId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/group/${communityId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to load group chats");
  }
  return res.json();  // returns an array of Chat objects
}

