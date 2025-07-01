import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  scores: [
    {
      subject: String,
      paper: String,
      score: Number,
      date: Date,
    },
  ],
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
