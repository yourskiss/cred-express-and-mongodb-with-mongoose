import mongoose from "mongoose";

const tblSchema = new mongoose.Schema(
  {
      fullname: { type: String, required: true, trim: true },
      mobile: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const collection_name = process.env.COL_TEACHER;
if (!collection_name) {
  throw new Error('❌ Missing teacher collection name in environment variables.');
}

const teacherModels = mongoose.model(
  'teacherlist', 
  tblSchema,
  collection_name 
);

export default teacherModels;
