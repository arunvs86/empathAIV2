import PostService       from "../services/post/postService.js";
import JournalService    from "../services/journal/journalService.js";
import CommunityService  from "../services/community/communityService.js";
// import HabitService      from "../services/habit/habitService.js";
import User from "../models/User.js";

class UserController {

  async getUsersByIds(req,res){
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


  // GET /users/:id/stats
  async getProfileStats(req, res) {
    const userId = req.params.id;
    try {
      const [
        postsCount,
        journalsCount,
        commsCount
        // habitsCount
      ] = await Promise.all([
        PostService.countByUser(userId),
        JournalService.countByUser(userId),
        CommunityService.countByUser(userId)
        // HabitService.countByUser(userId),
      ]);

      console.log("pc", postsCount)
      console.log("jc", journalsCount)
      console.log("cc", commsCount)

      return res.json({
        posts:       postsCount,
        journals:    journalsCount,
        communities: commsCount
        // habits:      habitsCount,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /users/:id/posts
  async getUserPosts(req, res) {
    try {
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 20;
      const posts = await PostService.getAllPosts(
        { userId: req.params.id },
        { page, limit }
      );
      return res.json(posts);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // GET /users/:id/journals
  async getUserJournals(req, res) {
    try {
      const journals = await JournalService.getByUser(req.params.id);
      return res.json(journals);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // GET /users/:id/communities
  async getUserCommunities(req, res) {
    try {
      const comms = await CommunityService.getByUser(req.params.id);
      return res.json(comms);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // GET /users/:id/habits
  // async getUserHabits(req, res) {
  //   try {
  //     const habits = await HabitService.getByUser(req.params.id);
  //     return res.json(habits);
  //   } catch (err) {
  //     return res.status(400).json({ error: err.message });
  //   }
  // }
}

export default new UserController();
