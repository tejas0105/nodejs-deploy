import mongoose from "mongoose";

const subLinkSchema = new mongoose.Schema(
  {
    id: { type: String },
    mainLink: { type: String, required: true },
    platform: {
      spotify: {
        link: { type: String },
        shortId: { type: String },
        shortenLink: { type: String },
        visitHistory: [
          {
            date: { type: Date },
          },
        ],
      },
      apple: {
        link: { type: String },
        shortId: { type: String },
        shortenLink: { type: String },
        visitHistory: [
          {
            date: { type: Date },
          },
        ],
      },
      google: {
        link: { type: String },
        shortId: { type: String },
        shortenLink: { type: String },
        visitHistory: [
          {
            date: { type: Date },
          },
        ],
      },
    },
  },
  { timestamps: true }
);

const SubLink = mongoose.model("SubLink", subLinkSchema);
export default SubLink;
