import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    userId:       { type: String,   required: true },
    date:         { type: Date,     default: Date.now },
    title:        { type: String,   default: '' },
    body:         { type: String,   required: true },
    mood:         { type: String,   enum: ['😃','😔','😡','😌'], default: '😃' },
    tags:         [{ type: String }],
    private:      { type: Boolean,  default: true },
    attachments:  [{ type: String }],      // URLs to uploaded files
  });
  export default mongoose.model('Journal', journalSchema);
  