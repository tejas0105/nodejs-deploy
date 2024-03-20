import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  ipAddress: { type: String, default: "127.0.0.1" },
  pincode: Number,
  geolocation: {
    type: { type: String, default: "Point" },
    coordinates: [{ lat: { type: Number }, long: { type: Number } }],
  },
  clicks: {
    type: Number,
    default: 0,
  },
});

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
    },
    originalLink: {
      type: String,
      required: ["true", "please provide original link"],
    },
    shortenLink: {
      type: String,
      required: ["true", "please provide original link"],
    },
    title: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    visitHistory: [
      {
        date: { type: Date },
        publicIP: [
          {
            ip: { type: String },
            date: { type: Date },
          },
        ],
        coordinates: { lat: { type: Number }, long: { type: Number } },
      },
    ],
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// urlSchema.pre("find", function (next) {
//   this.find({ hidden: { $ne: true } });
//   next();
// });

const ShortUrl = mongoose.model("ShortUrl", urlSchema);

export default ShortUrl;
