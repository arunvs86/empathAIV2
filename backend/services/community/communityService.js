import Community from "../../models/Community.js";

class CommunityService {
    /**
     * Create a Community
     */
    async createCommunity(userId, communityData) {
        const { name, description, type } = communityData;

        const newCommunity = await Community.create({
            name,
            description,
            type,
            createdBy: userId, 
            members: [userId], 
            moderators: [userId], 
        });

        return newCommunity;
    }

    /**
     * Get All Communities
     */
    async getAllCommunities() {
        return await Community.find().sort({ createdAt: -1 });
    }

    /**
     * Get a Single Community by ID
     */
    async getCommunityById(communityId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");
        return community;
    }

    /**
     * Update Community (Only Owner or Admin)
     */
    async updateCommunity(communityId, userId, updateData) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (community.createdBy !== userId) {
            throw new Error("Unauthorized to update this community.");
        }

        Object.assign(community, updateData);
        await community.save();
        return community;
    }

    /**
     * Delete a Community (Only Owner or Admin)
     */
    async deleteCommunity(communityId, userId, isAdmin = false) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (!isAdmin && community.createdBy !== userId) {
            throw new Error("Unauthorized to delete this community.");
        }

        await Community.findByIdAndDelete(communityId);
        return { message: "Community deleted successfully." };
    }

    async joinCommunity(userId, communityId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (community.members.includes(userId)) {
            throw new Error("You are already a member of this community.");
        }

        if (community.type === "public") {
            community.members.push(userId);
        } else {
            throw new Error("This is a private community. Send a join request instead.");
        }

        await community.save();
        return { message: "Successfully joined the community!" };
    }

    /**
     * Request to Join a Private Community
     */
    async requestToJoin(userId, communityId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");
        
        if (community.type !== "private") {
            throw new Error("This is a public community. You can join directly.");
        }

        if (community.pending_requests.includes(userId)) {
            throw new Error("You have already requested to join this community.");
        }

        community.pending_requests.push(userId);
        await community.save();

        return { message: "Join request sent successfully!" };
    }

    /**
     * Approve/Reject a Join Request
     */
    async approveJoinRequest(communityId, adminId, userId, action) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (!community.moderators.includes(adminId)) {
            throw new Error("Unauthorized: Only admins or moderators can approve requests.");
        }

        if (!community.pending_requests.includes(userId)) {
            throw new Error("No pending request found for this user.");
        }

        if (action === "approve") {
            community.members.push(userId);
        }

        community.pending_requests = community.pending_requests.filter(id => id !== userId);
        await community.save();

        return { message: `Join request ${action}d successfully!` };
    }

    /**
     * Leave a Community
     */
    async leaveCommunity(userId, communityId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        community.members = community.members.filter(id => id !== userId);
        
        await community.save();
        return { message: "Successfully left the community!" };
    }

    async removePost(communityId, postId, moderatorId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (!community.moderators.includes(moderatorId)) {
            throw new Error("Unauthorized: Only moderators or admins can remove posts.");
        }

        const post = await Post.findById(postId);
        if (!post) throw new Error("Post not found.");

        if (post.communityId?.toString() !== communityId) {
            throw new Error("This post does not belong to the specified community.");
        }

        await Post.findByIdAndDelete(postId);
        return { message: "Post removed successfully!" };
    }

    /**
     *  Ban a User from a Community
     */
    async banUser(communityId, adminId, userId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (!community.moderators.includes(adminId)) {
            throw new Error("Unauthorized: Only moderators or admins can ban users.");
        }

        if (!community.members.includes(userId)) {
            throw new Error("User is not a member of this community.");
        }

        community.banned_users.push(userId);
        community.members = community.members.filter(id => id !== userId);

        await community.save();
        return { message: "User banned successfully!" };
    }

    /**
     *  Unban a User from a Community
     */
    async unbanUser(communityId, adminId, userId) {
        const community = await Community.findById(communityId);
        if (!community) throw new Error("Community not found.");

        if (!community.moderators.includes(adminId)) {
            throw new Error("Unauthorized: Only moderators or admins can unban users.");
        }

        if (!community.banned_users.includes(userId)) {
            throw new Error("User is not banned.");
        }

        community.banned_users = community.banned_users.filter(id => id !== userId);
        await community.save();

        return { message: "User unbanned successfully!" };
    }
}

export default new CommunityService();
