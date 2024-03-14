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
  views: [{ date: { type: Date } }],
  publicIP: [
    {
      ip: { type: String },
      date: { type: Date },
    },
  ],
  deviceType: [
    {
      type: { type: String },
      date: { type: Date },
    },
  ],
  coordinates: {
    lat: { type: Number, default: null },
    long: { type: Number, default: null },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
