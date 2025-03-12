import Post from "../../models/Post.js";
import Community from "../../models/Community.js"
import UserViolations from "../../models/UserViolations.js"

class PostService{

    async createPost(userId,postData){
        
        const {content,media,categories,community_id} = postData
        if(community_id){
            const community = await Community.findById(community_id)
            if(!community) throw new Error("The community could not be found")
                
            if(community.type === "private" && !community.members.includes(userId)){
                throw new Error("You are not part of this community. Please click join and post once approved")
            }
        }

        const newPost = await Post.create({
            userId,
            content,
            media,
            categories,
            communityId : community_id || null
        });

        return newPost;
    }
    
    async getAllPosts(filters = {}, pagination = { limit: 15, page: 1 }) {
      const { limit, page } = pagination;
    
      // 1. Fetch posts from MongoDB
      const posts = await Post.find(filters)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate({ path: "communityId", select: "name" });
    
      if (posts.length === 0) {
        return [];
      }
    
      // 2. Extract user IDs from the post.userId
      //    AND also from each comment's userId
      let userIdsSet = new Set();
    
      posts.forEach((post) => {
        // Add post's userId
        userIdsSet.add(post.userId);
    
        // Add each comment's userId
        post.comments.forEach((comment) => {
          if (comment.userId) {
            userIdsSet.add(comment.userId);
          }
        });
      });
    
      const userIds = [...userIdsSet];
    
      // 3. Fetch user details from your REST API endpoint
      if (userIds.length > 0) {
        const userResponse = await fetch(
          `https://empathaiv2-backend.onrender.com/users?ids=${userIds.join(",")}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const users = await userResponse.json();
    
        // 4. Create a map from userId to username
        const userMap = {};
        users.forEach((user) => {
          userMap[user.id] = user.username;
        });
    
        // 5. Attach the username to each post AND each comment
        const postsWithUsernames = posts.map((post) => {
          const postObj = post.toObject();
    
          // Attach username to the top-level post
          postObj.username = userMap[postObj.userId] || "Unknown";
    
          // For each comment, attach commentUsername
          postObj.comments = postObj.comments.map((comment) => {
            return {
              ...comment,
              commentUsername: userMap[comment.userId] || "Unknown",
            };
          });
    
          return postObj;
        });
    
        return postsWithUsernames;
      } else {
        // If no user IDs found, just return the posts as plain objects
        return posts.map((post) => post.toObject());
      }
    }
    
    async getCommunityPosts(communityId, pagination = { limit: 10, page: 1 }) {
      const { limit, page } = pagination;
      const posts = await Post.find({ communityId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate({ path: "communityId", select: "name" });
    
      if (posts.length === 0) {
        return [];
      }
    
      // 1. Collect user IDs from post.userId AND each comment's userId
      const userIdsSet = new Set();
      posts.forEach((post) => {
        // Post author
        userIdsSet.add(post.userId);
    
        // Comment authors
        if (post.comments && post.comments.length > 0) {
          post.comments.forEach((comment) => {
            if (comment.userId) {
              userIdsSet.add(comment.userId);
            }
          });
        }
      });
    
      const userIds = [...userIdsSet];
    
      // 2. Fetch user details if we have any user IDs
      if (userIds.length > 0) {
        const userResponse = await fetch(
          `https://empathaiv2-backend.onrender.com/users?ids=${userIds.join(",")}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const users = await userResponse.json();
    
        // 3. Create a map from userId to username
        const userMap = {};
        users.forEach((user) => {
          userMap[user.id] = user.username;
        });
    
        // 4. Attach username to each post AND commentUsername to each comment
        const postsWithUsernames = posts.map((post) => {
          const postObj = post.toObject();
    
          // Post author's username
          postObj.username = userMap[postObj.userId] || "Unknown";
    
          // Enrich each comment with commentUsername
          postObj.comments = postObj.comments.map((comment) => {
            return {
              ...comment,
              commentUsername: userMap[comment.userId] || "Unknown",
            };
          });
    
          return postObj;
        });
    
        return postsWithUsernames;
      } else {
        // If no user IDs found, just return the plain post objects
        return posts.map((post) => post.toObject());
      }
    }
    

    async getPostById(postId) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");
        return post;
    }

    async updatePost(postId, userId, updateData) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");
        if (post.userId !== userId) throw new Error("Unauthorized to update this post.");

        Object.assign(post, updateData);
        await post.save();
        return post;
    }

    async deletePost(postId, userId, isAdmin = false) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");
        if (!isAdmin && post.userId !== userId) throw new Error("Unauthorized to delete this post.");

        await Post.findByIdAndDelete(postId);
        return { message: "Post deleted successfully." };
    }

    async addComment(postId, userId, text) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");
    
        // Create the comment object with createdAt
        const newComment = {
          userId,
          text,
          createdAt: new Date(), // ensure we set a valid date
        };
    
        // Push to post.comments
        post.comments.push(newComment);
    
        // Save the post
        await post.save();
    
        // The newly added comment will be at the end of post.comments
        const addedComment = post.comments[post.comments.length - 1];
    
        // If you want to attach a username/profile_picture, you can do so here
        // e.g., fetch from your user DB or a separate service
    
        // Return only the newly added comment (not the entire post)
        return addedComment;
      }
    

    async deleteComment(postId, commentId, userId, isAdmin = false) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");

        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) throw new Error("Comment not found.");

        if (!isAdmin && post.comments[commentIndex].userId !== userId) {
            throw new Error("Unauthorized to delete this comment.");
        }

        post.comments.splice(commentIndex, 1);
        await post.save();

        return { message: "Comment deleted successfully!" };
    }

    // async getComments(postId) {
    //     const post = await Post.findById(postId).select("comments");
    //     if (!post) throw new Error("Post not found.");
        
    //     return post.comments;
    // }

    async getComments(postId) {
        // 1. Fetch the post's comments from MongoDB
        const post = await Post.findById(postId).select("comments");
        if (!post) throw new Error("Post not found.");
      
        const comments = post.comments;
        if (!comments || comments.length === 0) return [];
      
        // 2. Extract unique user IDs from the comments
        const userIds = [...new Set(comments.map(comment => comment.userId))];
      
        // 3. Fetch user details via a REST API endpoint that returns [{ id, username, profile_picture }]
        const userResponse = await fetch(
          `https://empathaiv2-backend.onrender.com/users?ids=${userIds.join(",")}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const users = await userResponse.json();
      
        // 4. Build a mapping from userId to user details
        const userMap = {};
        users.forEach(user => {
          userMap[user.id] = {
            username: user.username,
            profile_picture: user.profile_picture, // if available
          };
        });
      
        
        // 5. Enrich each comment with the user's username (and profile_picture if needed)
        const enrichedComments = comments.map(comment => {
          // If comment is a Mongoose subdocument, convert it to a plain object
          const commentObj = comment.toObject ? comment.toObject() : comment;
          const userInfo = userMap[commentObj.userId] || {};
          return {
            ...commentObj,
            username: userInfo.username || commentObj.userId,
            profile_picture: userInfo.profile_picture || "src/assets/avatar.png"
          };
        });
        return enrichedComments;
      }
      

    async reportPost(postId, userId, reason, description) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");

        if (post.reported_by.includes(userId)) {
            throw new Error("You have already reported this post.");
        }

        post.reported_by.push(userId);
        await post.save();

        await UserViolations.create({
            user_id: post.userId, // Post owner
            reported_by: userId,
            target_post_id: postId,
            violation_reason: reason,
            description,
        });

        return { message: "Post reported successfully!" };
    }

    async getReportedPosts() {
        return await Post.find({ reported_by: { $exists: true, $ne: [] } }).sort({ createdAt: -1 });
    }


    async moderatePost(postId, action) {
        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");

        if (action === "flag") {
            post.status = "flagged";
        } else if (action === "remove") {
            post.status = "removed";
        } else if (action === "ignore") {
            post.reported_by = []; 
        } else {
            throw new Error("Invalid action. Use 'flag', 'remove', or 'ignore'.");
        }

        await post.save();
        return { message: `Post ${action} successfully!` };
    }

}

export default new PostService();