import mongoose from "mongoose";

const clicksSchema = mongoose.Schema({
  clicks: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
  },
});

const userSchema = mongoose.Schema(
  {
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
    // clicks: {
    //   type: [Number],
    //   date: [Date],
    //   default: 0,
    // required: true,
    clicks: [clicksSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
