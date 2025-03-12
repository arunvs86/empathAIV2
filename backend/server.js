// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import connectMongoDB from "./config/db.js";
// import { sequelize,connectPostgres } from "./config/postgres.js";
// import User from "./models/User.js";
// import UserActivity from "./models/UserActivity.js";
// import JournalEntries from "./models/JournalEntries.js";
// import Admin from "./models/Admin.js"
// import AdminActions from "./models/AdminActions.js"
// import Appointments from "./models/Appointments.js"
// import Donations from "./models/Donations.js"
// import Therapist from "./models/Therapist.js"
// import TherapistAvailability from "./models/TherapistAvailability.js"
// import UserViolations from "./models/UserViolations.js"
// import Chat from "./models/Chat.js";
// import Message from "./models/Message.js";
// import Post from "./models/Post.js";
// import Community from "./models/Community.js";
// import authRoutes from "./routes/authRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import communityRoutes from "./routes/communityRoutes.js"
// import therapistAvailabilityRoutes from "./routes/therapistAvailabilityRoutes.js"
// import appointmentRoutes from "./routes/appointmentRoutes.js"
// import chatRoutes from "./routes/chatRoutes.js"
// import userRoutes from "./routes/userRoutes.js"
// const app = express();

// dotenv.config({ path: "./.env" });

// connectMongoDB();
// connectPostgres().then(() => {
//     sequelize.sync({ alter: true }) 
//         .then(() => console.log("PostgreSQL Models Synced!"))
//         .catch(err => console.error("Error syncing models:", err));
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test Route
// app.get("/", (req, res) => {
//     res.send("EmpathAI API is running...");
// });

// app.use("/auth", authRoutes); 
// app.use("/posts", postRoutes); 
// app.use("/communities",communityRoutes)
// app.use("/therapists",therapistAvailabilityRoutes)
// app.use("/appointments",appointmentRoutes)
// app.use("/chats",chatRoutes)
// app.use("/users", userRoutes);

// const PORT = process.env.PORT || 5003;
// app.listen(PORT, () => console.log(`Server running on the port ${PORT}`));

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http"; // For creating the HTTP server
import { Server } from "socket.io"; // Socket.IO server
import connectMongoDB from "./config/db.js";
import { sequelize, connectPostgres } from "./config/postgres.js";
import User from "./models/User.js";
import UserActivity from "./models/UserActivity.js";
import JournalEntries from "./models/JournalEntries.js";
import Admin from "./models/Admin.js";
import AdminActions from "./models/AdminActions.js";
import Appointments from "./models/Appointments.js";
import Donations from "./models/Donations.js";
import Therapist from "./models/Therapist.js";
import TherapistAvailability from "./models/TherapistAvailability.js";
import UserViolations from "./models/UserViolations.js";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
import Post from "./models/Post.js";
import Community from "./models/Community.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import therapistAvailabilityRoutes from "./routes/therapistAvailabilityRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();

// Connect Databases
connectMongoDB();
connectPostgres().then(() => {
  sequelize
    .sync({ alter: true })
    .then(() => console.log("PostgreSQL Models Synced!"))
    .catch((err) => console.error("Error syncing models:", err));
});

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("EmpathAI API is running...");
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/therapists", therapistAvailabilityRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/chats", chatRoutes);
app.use("/users", userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // or a specific domain like "http://localhost:3000"
    methods: ["GET", "POST"],
  },
});

// Socket.IO event handling
io.on("connection", (socket) => {

  // Optional: authenticate user if you want token-based validation here
  // e.g., socket.handshake.headers.authorization

  // Example: user joins a room
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  // Example: handle a new message
  socket.on("newMessage", (messageData) => {
    const { chatId, message } = messageData;
    // Emit to all sockets in this room
    io.to(chatId).emit("newMessage", message);
  });

  // On disconnect
  socket.on("disconnect", () => {
  });
});

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
