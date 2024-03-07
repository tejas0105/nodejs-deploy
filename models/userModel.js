import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  zipcode: {
    type: String,
    default: null,
    // required: true,
  },
  location: {
    type: String,
    default: null,
  },
  publicIp: [String],
  clicks: {
    type: Number,
    default: 0,
    // required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
