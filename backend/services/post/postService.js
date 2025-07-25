import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Community from "../../models/Community.js"
import UserViolations from "../../models/UserViolations.js"
import axios from 'axios';

class PostService{

  

    async createPost(userId, postData) {
      
      const { content, media, categories, community_id } = postData;
      console.log(postData)
      const user = await User.findByPk(userId)
      // Validate community membership if community_id is provided
      if (community_id) {
          const community = await Community.findById(community_id);
          if (!community) throw new Error("The community could not be found");
                  
          if (community.type === "private" && !community.members.includes(userId)) {
              throw new Error("You are not part of this community. Please click join and post once approved");
          }
      }
  
      const candidateLabels = [
        "Grief & Bereavement",
        "Depression",
        "Anxiety",
        "Coping Strategies",
        "Self-Care",
        "Emotional Healing",
        "Social Support",
        "Resilience",
        "Abuse & Harassment",
        "Offensive Content"
      ];
       
//       try {
//         const response = await fetch('https://flask-app-275410178944.europe-west2.run.app/classify', {  
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             user_post: content,
//             candidate_labels: candidateLabels
//           })
//         });
//         // const result = await response.json();
//         // console.log(result)

//         if (!response.ok) {
//           const text = await response.text();
//           console.error('Non-200 from classify endpoint:', text);
//           throw new Error(`Classification API returned HTTP ${response.status}`);
//         }

//         const contentType = response.headers.get('content-type') || '';
// if (!contentType.includes('application/json')) {
//   const text = await response.text();
//   console.error('Expected JSON but got:', text);
//   throw new Error('Classification API did not return JSON');
// }


// // Now safely parse
// const result = await response.json();

//         // If no topics or top score too low, discard post
//         // if (!result.topics || result.topics.length === 0) {
//         //   throw new Error("Your post has been removed by Team EmpathAI for its disturbing content.");
//         // }
//         // Sort by score desc
//         result.topics.sort((a, b) => b.score - a.score);
      
//         // Set your minimum acceptable score threshold
//         console.log(result.topics)
//         if (result.topics[0].label === "Offensive Content" || result.topics[0].label === "Abuse & Harassment") {
//           throw new Error("Your post has been removed by Team EmpathAI for its disturbing content.");
//         }

//         const topThreeLabels = result.topics
//                                 .slice(0, 3)                // take at most the first 3
//                                 .map((t) => t.label);       // pull out their labels

//         const banned = ["Offensive Content", "Abuse & Harassment"];

//         // if any of the top-three is banned, reject
//         if (topThreeLabels.some((label) => banned.includes(label))) {
//             throw new Error(
//             "Your post has been removed by Team EmpathAI for its disturbing content."
//             );
//           }
      
//         // Take top two labels
//         const topTwoCategories = result.topics.slice(0, 2).map((t) => t.label);
//         console.log("Top two categories:", topTwoCategories);
      
        // Create the post as before
        const newPost = await Post.create({
          userId,
          content,
          media,
          categories,
          communityId: community_id || null,
        });
      
        // Attach username if you need
        const postObj = newPost.toObject();
        postObj.username = user.username || "EmpathAIUser";
      
        return postObj;

      } catch (error) {
          // Handle errors from the classification API call if needed
          throw new Error(error);
      }
  
    



// async createPost(userId, postData) {

//   const HF_API_TOKEN = process.env.HF_API_TOKEN;
//   const HF_MODEL_ID  = process.env.HF_MODEL_ID || 'facebook/bart-large-mnli';
//   const HF_API_URL   = process.env.HF_API_URL

//   const CANDIDATE_LABELS = [
//     "Grief & Bereavement",
//     "Depression",
//     "Anxiety",
//     "Coping Strategies",
//     "Self-Care",
//     "Emotional Healing",
//     "Social Support",
//     "Resilience",
//     "Abuse & Harassment",
//     "Offensive Content"
//   ];

//   const { content, media, categories, community_id } = postData;

//   // 1) Fetch user
//   const user = await User.findByPk(userId);
//   if (!user) throw new Error('User not found');

//   // 2) Validate community membership
//   if (community_id) {
//     const community = await Community.findByPk(community_id);
//     if (!community) throw new Error('The community could not be found');
//     if (community.type === 'private' && !community.members.includes(userId)) {
//       throw new Error('You are not part of this private community');
//     }
//   }

//   // 3) Call Hugging Face inference API
//   let hfResults;
//   try {
//     const hfResp = await axios.post(
//       HF_API_URL,
//       {
//         inputs: content,
//         parameters: { candidate_labels: CANDIDATE_LABELS }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${HF_API_TOKEN}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 30000
//       }
//     );
//     hfResults = hfResp.data;
//   } catch (err) {
//     console.error('HF inference error:', err.response?.data || err.message);
//     throw new Error('Classification service unavailable');
//   }

//   // 4) Validate HF response shape
//   if (
//     !hfResults.labels ||
//     !Array.isArray(hfResults.labels) ||
//     !hfResults.scores ||
//     !Array.isArray(hfResults.scores) ||
//     hfResults.labels.length !== hfResults.scores.length
//   ) {
//     throw new Error('Invalid classification response');
//   }

//   // 5) Build and sort topics by score descending
//   const topics = hfResults.labels.map((label, idx) => ({
//     label,
//     score: hfResults.scores[idx]
//   })).sort((a, b) => b.score - a.score);

//   // 6) Block if top topic is banned
//   const banned = new Set(['Abuse & Harassment', 'Offensive Content']);
//   if (topics[0] && banned.has(topics[0].label)) {
//     throw new Error('Your post was removed for disturbing content.');
//   }

//   // 7) Pick top two categories for tagging
//   const topTwoCategories = topics.slice(0, 2).map(t => t.label);
//   console.log('Top two categories:', topTwoCategories);

//   // 8) Persist the post
//   const newPost = await Post.create({
//     userId,
//     content,
//     media: media || null,
//     // merge user-provided categories with HF categories, if desired:
//     categories: categories?.concat(topTwoCategories) || topTwoCategories,
//     communityId: community_id || null
//   });

//   // 9) Attach username and return
//   const postObj = newPost.toJSON();
//   postObj.username = user.username || 'UnknownUser';
//   postObj.classifiedCategories = topTwoCategories;
//   return postObj;
// }
    
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
          console.log("Error in userid fetch")
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
          postObj.username = userMap[postObj.userId] || "EmpathAIUser";
    
          // For each comment, attach commentUsername
          postObj.comments = postObj.comments.map((comment) => {
            return {
              ...comment,
              commentUsername: userMap[comment.userId] || "EmpathAIUser",
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
          console.log("Error in 2")

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
          postObj.username = userMap[postObj.userId] || "EmpathAIUser";
    
          // Enrich each comment with commentUsername
          postObj.comments = postObj.comments.map((comment) => {
            return {
              ...comment,
              commentUsername: userMap[comment.userId] || "EmpathAIUser",
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
    
      const user = await User.findByPk(userId);
      const username = user.username;
    
      // Create and push the comment
      const newComment = { userId, text, createdAt: new Date() };
      post.comments.push(newComment);
      await post.save();
    
      // Grab the freshly added comment as a plain object
      const added = post.comments[post.comments.length - 1].toObject();
    
      // Flatten into one object
      const comment = {
        username,
        ...added
      };
    
      console.log(comment);
      return comment;
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
          console.log("Error in 3")

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
        post.status="flagged"
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

    async getPostsByUser(userId, { page = 1, limit = 20 } = {}) {
      // 1) Query Mongo for that user’s posts
      const skip = (page - 1) * limit;
      const posts = await Post.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "communityId", select: "name" }); // if you need community name
  
      // 2) Gather all userIds (authors + commenters) for enrichment
      const userIds = new Set();
      posts.forEach((p) => {
        userIds.add(p.userId);
        (p.comments || []).forEach((c) => {
          if (c.userId) userIds.add(c.userId);
        });
      });
  
      // 3) Fetch usernames from your Postgres-backed /users endpoint
      let userMap = {};
      if (userIds.size) {
        const resp = await fetch(
          `https://empathaiv2-backend.onrender.com/users?ids=${[...userIds].join(",")}`
        );
        const users = await resp.json();
        users.forEach((u) => {
          userMap[u.id] = u.username;
        });
      }
  
      // 4) Build the final enriched array
      const result = posts.map((postDoc) => {
        const post = postDoc.toObject();
        post.username = userMap[post.userId] || "EmpathAIUser";
  
        post.comments = (post.comments || []).map((c) => {
          return {
            ...c,
            commentUsername: userMap[c.userId] || "EmpathAIUser",
          };
        });
  
        return post;
      });
  
      return result;
    }

    async countByUser(userId) {
       count = await Post.countDocuments({ userId });
       console.log(count)
       return count
    }

}

export default new PostService();