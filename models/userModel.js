import mongoose from "mongoose";

// const clicksSchema = mongoose.Schema({
//   clicks: {
//     type: Number,
//     default: 0,
//   },
//   date: {
//     type: String,
//   },
// });

// const userSchema = mongoose.Schema(
//   {
//     zipcode: {
//       type: String,
//       default: null,
//     },
//     location: {
//       type: String,
//       default: null,
//     },
//     publicIp: [String],

//     clicks: [clicksSchema],
//   },
//   { timestamps: true }
// );

const userSchema = mongoose.Schema({
  views: [{ timeStamp: { type: String } }],
  publicIP: [
    {
      ip: { type: String },
      timeStamp: { type: String },
    },
  ],
  deviceType: [
    {
      type: { type: String },
      timeStamp: { type: String },
    },
  ],
  coordinates: {
    lat: Number,
    long: Number,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
