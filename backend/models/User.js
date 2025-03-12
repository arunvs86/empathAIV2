import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js"; // Import PostgreSQL connection
import USER_ROLES from "./enums/UserRoles.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(USER_ROLES)),
        allowNull: false,
        defaultValue: USER_ROLES.USER,
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true, // User can upload an image
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional
    },
    dob: {
        type: DataTypes.DATEONLY, // Stores only YYYY-MM-DD
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM("male", "female", "non-binary", "prefer not to say"),
        allowNull: true, // Optional field
    },
    location: {
        type: DataTypes.STRING(255), // City, Country
        allowNull: true, // Optional field
    },
    religious_support: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default: No religious support needed
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true, // Updated on login
    },
    account_status: {
        type: DataTypes.ENUM("active", "banned", "deactivated"),
        defaultValue: "active",
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.DATE, 
        allowNull: true,
    },
}, {
    timestamps: true, 
});

export default User;
