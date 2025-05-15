import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    /**
     * Sends a verification email to the user
     */
    async sendVerificationEmail(user) {
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const verificationLink = `http://localhost:5003/auth/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Verify Your Email - EmpathAI",
            text: `Hello ${user.username},\n\nClick the link below to verify your email:\n\n${verificationLink}\n\nThis link expires in 1 hour.`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    /**
     * Verifies email using the provided token
     */
    async verifyEmail(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token.");
        }
    }

    async sendPasswordResetEmail(user) {
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: process.env.RESET_PASSWORD_EXPIRY }
        );

        console.log("Reset token", token)
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Reset Your Password - EmpathAI",
            text: `Hello ${user.username},\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendAppointmentRequestEmail(appointment, user, therapist) {
        const scheduledAt = new Date(appointment.scheduled_at).toLocaleString();
    
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Appointment Request - EmpathAI",
          text: `Hello ${user.username},\n\nYour appointment with ${therapist.username} has been requested at ${scheduledAt}.\n\nThank you for choosing EmpathAI.\n\nBest regards,\nEmpathAI Team`,
        };
    
        await this.transporter.sendMail(mailOptions);
      }

    async sendAppointmentConfirmationEmail(appointment, user, therapist) {
        const scheduledAt = new Date(appointment.scheduled_at).toLocaleString();
    
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Appointment Request - EmpathAI",
          text: `Hello ${user.username},\n\nYour appointment with ${therapist.username} has been confirmed at ${scheduledAt}.\n\nThank you for choosing EmpathAI.\n\nBest regards,\nEmpathAI Team`,
        };
    
        await this.transporter.sendMail(mailOptions);
      }

      async sendSlotTakenEmail(appointment, user, therapist) {
        const scheduledAt = new Date(appointment.scheduled_at).toLocaleString();
    
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Appointment Slot taken - EmpathAI",
          text: `Hello ${user.username},\n\nYour appointment with ${therapist.username} has been taken by someone else in the queue.\n\nThank you for choosing EmpathAI.\n\nBest regards,\nEmpathAI Team`,
        };
    
        await this.transporter.sendMail(mailOptions);
      }

      async sendRejectionEmail(appointment, user, therapist) {
        const scheduledAt = new Date(appointment.scheduled_at).toLocaleString();
    
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Appointment denied - EmpathAI",
          text: `Hello ${user.username},\n\nYour appointment with ${therapist.username} has been cancelled due to scheduling reasons.\n\nThank you for choosing EmpathAI.\n\nBest regards,\nEmpathAI Team`,
        };
    
        await this.transporter.sendMail(mailOptions);
      }

}

export default new EmailService();
