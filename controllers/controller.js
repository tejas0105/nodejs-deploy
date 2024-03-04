import ShortUrl from "../models/models.js";
import { nanoid } from "nanoid";
import axios from "axios";
// import ip from "ip";

const home = async (req, res) => {
  res.send("<h1>This is the home route</h1>");
};

const getAllData = async (req, res) => {
  try {
    const urlDoc = await ShortUrl.find();
    res.status(200).json({ status: "success", data: { urlDoc } });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ status: "failed", message: "Data not found" });
  }
};

const finalPage = async (req, res) => {
  try {
    const urlDoc = await ShortUrl.find({ hidden: false });
    console.log(req.ip.split("ffff")[1].split(":")[1]);
    return res.status(200).json({ data: urlDoc });
  } catch (error) {
    console.log(error?.message);
  }
};

const createShortLink = async (req, res) => {
  try {
    const link = req.body.originalLink;
    const regex =
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    const existingLink = await ShortUrl.findOne({ originalLink: link });
    if (existingLink) {
      return res
        .status(200)
        .json({ status: "success", data: { link: existingLink?.shortenLink } });
    }
    const validLink = regex.test(link);
    if (validLink) {
      const randomId = nanoid(10);
      const shortLink = `http://127.0.0.1:8000/${randomId}`;
      const videoId = link.split("?v=")[1].split("&")[0];
      const videoData = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.API_KEY}`
      );
      const result = await ShortUrl.create({
        shortId: randomId,
        originalLink: link,
        shortenLink: shortLink,
        title: videoData?.data?.items?.[0]?.snippet?.title,
        thumbnail:
          videoData?.data?.items?.[0]?.snippet?.thumbnails?.maxres?.url,
      });
      res.status(201).json({ status: "success", data: { result } });
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "something went wrong" });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const getShortLinkAndRedirect = async (req, res) => {
  try {
    const params = req.params.id;
    // console.log("REQUEST->", req.socket.remoteAddress);
    // console.log(ip.address());
    // const ip =
    //   req.headers["cf-connecting-ip"] ||
    //   req.headers["x-real-ip"] ||
    //   req.headers["x-forwarded-for"] ||
    //   req.socket.remoteAddress ||
    //   "";
    // console.log(ip);
    // const userData = {
    //   ipAddress: ip.address(),
    //   pincode: 12345,
    //   geolocation: {
    //     type: "Point",
    //     coordinates: [{ lat: 40.7128, long: -74.006 }],
    //   },
    //   clicks: 1,
    // };
    // const userDoc = await ShortUrl.findOneAndUpdate(
    //   { shortId: params },
    //   { $push: { userDetails: userData } },
    //   { new: true }
    // );
    // console.log(userDoc);
    const urlDoc = await ShortUrl.findOneAndUpdate(
      { shortId: params },
      { $push: { visitHistory: { timeStamp: Date.now() } } }
    );
    res.redirect(urlDoc?.originalLink);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ status: "failed", message: "Not found" });
  }
};

const updateDoc = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const setHidden = req.body.setHidden;
    console.log(req.body);
    const urlDoc = await ShortUrl.findOneAndUpdate(
      { shortId: id },
      { $set: { hidden: setHidden } }
    );
    const updatedData = await ShortUrl.find({ shortId: id });
    res.json({ updatedData });
  } catch (error) {
    console.log(error.message);
    res.json({ error });
  }
};

export {
  home,
  createShortLink,
  getShortLinkAndRedirect,
  getAllData,
  updateDoc,
  finalPage,
};
