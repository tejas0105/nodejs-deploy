import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
    },

    originalLink: { type: String, required: true },

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

    type: {
      podcast: Boolean,
      video: Boolean,
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
