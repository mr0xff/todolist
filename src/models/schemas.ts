import { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  pwd: String,
  bio: String,
}, {
  collection: "users_coll",
  timestamps: true,
});

const taskSchema = new Schema({
  title: String, 
  description: String,
  status: String, // pending or doned
  userId: Schema.Types.ObjectId,
  isDeleted: {
    type: Boolean, 
    default: false,
  }
}, {
  collection: "task_coll",
  timestamps: true,
});

const tokenSchema = new Schema({
  token: {
    type: String,
    unique: true,
  },
  userId: Schema.Types.ObjectId,
}, {
  collection: "access_tokens_coll",
  timestamps: true,
});

export {
  userSchema,
  taskSchema,
  tokenSchema
};