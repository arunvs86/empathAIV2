import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Appointments = sequelize.define("Appointments", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    therapist_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Therapists",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false, 
    },
    session_duration: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 60, 
    },
    session_type: {
        type: DataTypes.ENUM("text", "voice", "video"),
        allowNull: false,
        defaultValue: "text",
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled", "no_show"),
        defaultValue: "pending",
    },
    notes: {
        type: DataTypes.TEXT, 
        allowNull: true,
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
    timestamps: false,
});

export default Appointments;
