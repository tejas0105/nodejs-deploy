import ShortUrl from "../models/linkModel.js";
import User from "../models/userModel.js";
import { nanoid } from "nanoid";
import axios from "axios";
import node_geocoder from "node-geocoder";

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
    // const referralSource = req.get("Referrer") || "Direct";
    // console.log(referralSource);
    // const ip = req.headers["x-forwarded-for"];
    // console.log(ip.split(" ")[0].split(",")[0]);
    // console.log(ip);
    return res.status(200).json({ data: urlDoc });
  } catch (error) {
    console.log(error?.message);
  }
};

const getcoords = async (req, res) => {
  try {
    // const geocoder = node_geocoder({
    //   provider: "opencage",
    //   apiKey: process.env.OPENCAGE_API_KEY,
    // });
    // const body = req.body;
    // // console.log(body.ip.ip);
    // const locationData = await geocoder.geocode(`${body.lat}, ${body.long}`);

    // const existingDoc = await User.findOne({
    //   zipcode: locationData?.[0]?.zipcode,
    // });

    // let currentDate = new Date();

    // let year = currentDate.getFullYear();
    // let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    // let day = currentDate.getDate().toString().padStart(2, "0");

    // let formattedDate = year + "-" + month + "-" + day;

    // if (existingDoc) {
    //   if (
    //     existingDoc?.clicks?.find((v) => v?.date === formattedDate)
    //     // existingDoc.clicks[existingDoc.clicks.length - 1].date === formattedDate
    //   ) {
    //     await User.findOneAndUpdate(
    //       {
    //         "clicks._id":
    //           existingDoc?.clicks?.[existingDoc?.clicks.length - 1]?._id,
    //         "clicks.date": formattedDate,
    //       },
    //       {
    //         $inc: {
    //           "clicks.$.clicks": 1,
    //         },
    //       }
    //     );
    //   } else {
    //     await User.findOneAndUpdate(
    //       {
    //         zipcode: existingDoc?.zipcode,
    //       },
    //       {
    //         $push: {
    //           clicks: { clicks: 1, date: formattedDate },
    //         },
    //       }
    //     );
    //   }
    //   if (!existingDoc?.publicIp?.find((v) => v === body.ip.ip)) {
    //     // console.log(
    //     //   existingDoc?.publicIp.find((v) => {
    //     //     return v === body.ip.ip;
    //     //   })
    //     // );
    //     await User.findOneAndUpdate(
    //       { zipcode: existingDoc?.zipcode },
    //       {
    //         $push: {
    //           publicIp: body.ip.ip,
    //         },
    //         // clicks: ++existingDoc.clicks,
    //       },
    //       { new: true }
    //     );
    //   }
    //   return res.status(200).json({ message: "Updated" });
    // } else {
    //   await User.create({
    //     zipcode: locationData?.[0]?.zipcode,
    //     location: `${locationData?.[0]?.streetName}, ${locationData?.[0]?.city}, ${locationData?.[0]?.county}, ${locationData?.[0]?.state}, ${locationData?.[0]?.country}`,
    //     publicIp: body.ip.ip,
    //     clicks: {
    //       clicks: 1,
    //       date: formattedDate,
    //     },
    //   });
    //   // console.log({ id: userDoc._id, clicks: userDoc.clicks });
    const geocoder = node_geocoder({
      provider: "opencage",
      apiKey: process.env.OPENCAGE_API_KEY,
    });
    const coordinates = {
      lat: Number(req.body.lat.toFixed(3)),
      long: Number(req.body.long.toFixed(3)),
    };
    const locationData = await geocoder.geocode(
      `${coordinates.lat}, ${coordinates.long}`
    );

    const existingDoc = await User.findOne({
      coordinates: { lat: coordinates.lat, long: coordinates.long },
    });
    if (
      existingDoc?.coordinates.lat === coordinates.lat && // if coordinates are same then just update the views
      existingDoc?.coordinates.long === coordinates.long
    ) {
      // if (!existingDoc?.publicIP.find((v) => v.ip === req.body.ip.ip)) {
      //   console.log("hello");
      //   await User.findOneAndUpdate(
      //     {
      //       coordinates: { lat: coordinates.lat, long: coordinates.long },
      //     },
      //     {
      //       $push: { publicIP: { ip: req.body.ip.ip, timeStamp: Date.now() } },
      //     }
      //   );
      // }
      await User.findOneAndUpdate(
        {
          coordinates: { lat: coordinates.lat, long: coordinates.long },
        },
        {
          $push: {
            views: { timeStamp: Date.now() },
            publicIP: { ip: req.body.ip.ip, timeStamp: Date.now() },
            deviceType: { type: req.body.deviceType, timeStamp: Date.now() },
          },
        }
      );
      return res.json({ message: "updated" });
    } else {
      const result = await User.create({
        coordinates: {
          lat: coordinates.lat,
          long: coordinates.long,
        },
        views: { timeStamp: Date.now() },
        publicIP: { ip: req.body.ip.ip, timeStamp: Date.now() },
        deviceType: { type: req.body.deviceType, timeStamp: Date.now() },
      });
      console.log(result);
    }
    // const existingDoc = await User.find({coordinates: coordinates});

    return res.status(201).json({ message: "Done" });
  } catch (error) {
    console.log(error);
  }
};

// const handleNullLocation = async (req, res) => {
//   try {
//     const existingDoc = await User.findOne({ zipcode: null });
//     const body = req.body;
//     // console.log(body?.ip);
//     console.log(existingDoc);
//     let currentDate = new Date();

//     let year = currentDate.getFullYear();
//     let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
//     let day = currentDate.getDate().toString().padStart(2, "0");

//     let formattedDate = year + "-" + month + "-" + day;
//     if (!existingDoc) {
//       await User.create({
//         publicIp: req.body?.ip,
//         clicks: {
//           clicks: 1,
//           date: formattedDate,
//         },
//       });

//       res.json({ message: "created but location not allowed" });
//     } else {
//       // console.log(userDoc);
//       if (!existingDoc?.publicIp?.find((v) => v === body?.ip)) {
//         await User.findOneAndUpdate(
//           { zipcode: existingDoc?.zipcode },
//           {
//             $push: {
//               publicIp: body?.ip,
//             },
//             // clicks: ++existingDoc.clicks,
//           }
//         );
//       } else if (existingDoc?.clicks?.find((v) => v?.date === formattedDate)) {
//         console.log("null");
//         await User.findOneAndUpdate(
//           {
//             "clicks._id":
//               existingDoc?.clicks?.[existingDoc?.clicks.length - 1]?._id,
//             "clicks.date": formattedDate,
//           },
//           {
//             $inc: {
//               "clicks.$.clicks": 1,
//             },
//           }
//         );
//       } else {
//         await User.findOneAndUpdate(
//           {
//             zipcode: existingDoc?.zipcode,
//           },
//           {
//             $push: {
//               clicks: { clicks: 1, date: formattedDate },
//             },
//           }
//         );
//       }

//       res.json({ message: "Updated but locaiton not allowed" });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

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

const getAnalytics = async (req, res) => {
  try {
    const userDoc = await User.find();
    // console.log(userDoc);
    const result = await User.aggregate([
      // { $match: { _id: userDoc[0]._id } },
      { $unwind: "$clicks" },
      {
        $group: {
          _id: "$clicks.date",
          totalClicks: { $sum: "$clicks.clicks" },
        },
      },
    ]);
    const lifeTimeClicks = result.reduce((acc, curr) => {
      return acc + curr.totalClicks;
    }, 0);
    const deviceType = req.useragent.isMobile ? "Mobile" : "Desktop";

    res.json({ lifeTimeClicks: lifeTimeClicks, deviceType: deviceType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
  getcoords,
  // handleNullLocatiosn,
  getAnalytics,
};
