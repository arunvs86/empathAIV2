import User from "../models/User.js";

export const getUsersByIds = async (req, res) => {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res.status(400).json({ message: "No user IDs provided." });
      }
  
      // Split the comma-separated list into an array and trim whitespace
      const idArray = ids.split(",").map((id) => id.trim());
  
      // Query PostgreSQL via Sequelize for users with these IDs
      const users = await User.findAll({
        where: {
          id: idArray,
        },
        attributes: ["id", "username"],
      });
  
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error in getUsersByIds:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };