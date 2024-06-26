import ShortUrl from "../models/linkModel.js";
import SubLink from "../models/subLinkModel.js";
import User from "../models/userModel.js";
import { nanoid } from "nanoid";
import axios from "axios";
import node_geocoder from "node-geocoder";
import { load } from "cheerio";

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

const getAllSublinkData = async (req, res) => {
  try {
    const subLinkDoc = await SubLink.find();
    if (!subLinkDoc) {
      return res.status(404).json({ status: "failed", message: "Not Found" });
    }
    return res.status(200).json({ status: "success", subLinkDoc });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

const finalPage = async (req, res) => {
  try {
    const referrer = req.body?.referrer;
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
            views: { date: Date.now() },
            publicIP: { ip: req.body.ip.ip, date: Date.now() },
            deviceType: { type: req.body.deviceType, date: Date.now() },
            referrer: { source: req.body.referrer || "direct" },
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
        views: { date: Date.now() },
        publicIP: { ip: req.body.ip.ip, date: Date.now() },
        deviceType: { type: req.body.deviceType, date: Date.now() },
        referrer: { source: req.body.referrer || "direct" },
      });
      // console.log(result);
    }
    // const existingDoc = await User.find({coordinates: coordinates});

    return res.status(201).json({ message: "Done" });
  } catch (error) {
    console.log(error);
  }
};

const handleNullLocation = async (req, res) => {
  try {
    const coordinates = {
      lat: req.body.lat,
      long: req.body.long,
    };
    const existingDoc = await User.findOne({
      coordinates: { lat: null, long: null },
    });

    if (
      existingDoc?.coordinates.lat === coordinates.lat &&
      existingDoc?.coordinates.long === coordinates.long
    ) {
      await User.findOneAndUpdate(
        {
          coordinates: { lat: coordinates.lat, long: coordinates.long },
        },
        {
          $push: {
            views: { date: Date.now() },
            publicIP: { ip: req.body.ip.ip, date: Date.now() },
            deviceType: { type: req.body.deviceType, date: Date.now() },
            referrer: { source: req.body.referrer || "direct" },
          },
        }
      );
      return res.json({ message: "updated but locaiton not allowed" });
    } else {
      const result = await User.create({
        coordinates: {
          lat: coordinates.lat,
          long: coordinates.long,
        },
        views: { date: Date.now() },
        publicIP: { ip: req.body.ip.ip, date: Date.now() },
        deviceType: { type: req.body.deviceType, date: Date.now() },
        referrer: { source: req.body.referrer || "direct" },
      });
    }
    res.json({ message: "Updated but locaiton not allowed" });
  } catch (error) {
    console.log(error.message);
  }
};

const createShortLink = async (req, res) => {
  try {
    const link = req.body.originalLink;
    const podcast = req.body.podcast;
    const video = req.body.video;
    const regex =
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    const existingLink = await ShortUrl.findOne({
      originalLink: link,
    });

    if (existingLink) {
      return res
        .status(200)
        .json({ status: "success", data: { link: existingLink?.shortenLink } });
    }
    const validLink = regex.test(link);
    if (validLink) {
      const randomId = nanoid(10);
      const shortLink = `http://127.0.0.1:5000/${randomId}`;

      const response = await fetch(link);
      const html = await response.text();
      const $ = load(html);

      const ogTitle = $('meta[property="og:title"]').attr("content");
      const ogImage = $('meta[property="og:image"]').attr("content");

      if (podcast) {
        if (req.body.spotify || req.body.apple || req.body.google) {
          try {
            const subLinkObject = {
              spotify: nanoid(10),
              apple: nanoid(10),
              google: nanoid(10),
            };

            const subLinkDoc = await SubLink.create({
              mainLink: link,
              id: randomId,
              platform: {
                spotify: {
                  link: req.body.spotify || "",
                  shortId: subLinkObject.spotify,
                  shortenLink: `http://127.0.0.1:5000/spotify/${randomId}/${subLinkObject.spotify}`,
                },
                apple: {
                  link: req.body.apple || "",
                  shortId: subLinkObject.apple,
                  shortenLink: `http://127.0.0.1:5000/apple/${randomId}/${subLinkObject.apple}`,
                },
                google: {
                  link: req.body.google || "",
                  shortId: subLinkObject.google,
                  shortenLink: `http://127.0.0.1:5000/google/${randomId}/${subLinkObject.google}`,
                },
              },
            });

            const result = await ShortUrl.create({
              shortId: randomId,
              originalLink: link,
              shortenLink: shortLink,
              title: ogTitle,
              thumbnail: ogImage,
              type: { podcast: podcast, video: video },
            });

            return res
              .status(201)
              .json({ status: "success", data: { result, subLinkDoc } });
          } catch (error) {
            console.log(error.message);

            return res
              .status(500)
              .json({ status: "failed", message: error.message });
          }
        }
      } else {
        const result = await ShortUrl.create({
          shortId: randomId,
          originalLink: link,
          shortenLink: shortLink,
          title: ogTitle,
          thumbnail: ogImage,
          type: { podcast: podcast, video: video },
        });
        return res.status(201).json({ status: "success", data: { result } });
      }
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
    const shortId = req.params.id;
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
    const url = await ShortUrl.findOne({ shortId: shortId });

    return res.redirect(url?.originalLink);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ status: "failed", message: "Not found" });
  }
};

const getShareLink = async (req, res) => {
  const params = req.params.id;
  const urlDoc = await ShortUrl.find({ shortId: params });
  return res.status(200).json({
    status: "success",
    message: `http://localhost:3000?linkId=${urlDoc?.[0]?.shortId}`,
  });
};

const redirectShareLink = async (req, res) => {
  const params = req.params.linkId;
  const urlDoc = await ShortUrl.find({ shortId: params });
  return res
    .status(302)
    .redirect(`http://localhost:3000?linkId=${urlDoc?.[0]?.shortId}`);
};

const updateView = async (req, res) => {
  try {
    await ShortUrl.findOneAndUpdate(
      { shortId: req.body?.linkId },
      {
        $push: {
          visitHistory: {
            date: Date.now(),
            publicIP: { ip: req.body.ip.ip, date: Date.now() },
            coordinates: { lat: req.body?.lat, long: req.body?.long },
          },
        },
      }
    );
    return res.status(200).json({ status: "success", message: "View Updated" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

const redirectPodcastLink = async (req, res) => {
  const platform = req.params.platform;
  const subLinkDoc = await SubLink.findOne({ id: req.params.id1 });
  const platformData = subLinkDoc?.platform[platform];
  const visitData = {
    date: new Date(),
  };
  const query = {};
  query[`platform.${platform}.shortId`] = platformData?.shortId;

  await SubLink.findOneAndUpdate(
    query,
    {
      $push: {
        [`platform.${platform}.visitHistory`]: visitData,
      },
    },
    { new: true }
  );
  // console.log(updateClicks);
  return res.redirect(platformData?.link);
};

// const updateViewSublink = async (req, res) => {
//   try {
//     const visitData = {
//       date: new Date(),
//       publicIP: [{ ip: "192.168.1.1", date: new Date() }],
//       coordinates: { lat: 40.7128, long: -74.006 },
//     };
//     const query = {};
//     query[`platform.${platform}.shortId`] = platformData?.shortId;
//     await SubLink.findOneAndUpdate(
//       query,
//       {
//         $push: {
//           [`platform.${platform}.visitHistory`]: visitData,
//         },
//       },
//       { new: true }
//     );
//     return res.status(200).json({ status: "success", message: "View Updated" });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ status: "failed", message: "Internal Server Error" });
//   }
// };

const getViewsAndClicks = async (req, res) => {
  try {
    const userDoc = await User.find();
    const linkDoc = await ShortUrl.find();
    const calculateVisitHistorySum = (obj) => {
      return obj.visitHistory.length;
    };
    const calculateTotalViews = (obj) => {
      return obj.views.length;
    };
    const totalViews = userDoc.reduce(
      (accumulator, currentValue) =>
        accumulator + calculateTotalViews(currentValue),
      0
    );
    const totalVisitHistorySum = linkDoc.reduce(
      (accumulator, currentValue) =>
        accumulator + calculateVisitHistorySum(currentValue),
      0
    );
    res.json({
      views: totalViews,
      clicks: totalVisitHistorySum,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getViewsAndClicksByDate = async (req, res) => {
  try {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const totalViews = await User.aggregate([
      {
        $unwind: "$views",
      },
      {
        $match: {
          "views.date": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
        },
      },
    ]);
    console.log(totalViews?.[0]?.totalViews);
    const uniqueViews = await User.aggregate([
      {
        $match: {
          "views.date": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$publicIP",
      },
      {
        $group: {
          _id: "$publicIP.ip",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          uniqueViews: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      data: {
        totalViews: totalViews?.[0]?.totalViews || "no data found",
        uniqueViews: uniqueViews?.[0]?.uniqueViews || "no data found",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const startDate = new Date("2024-03-14");
    const endDate = new Date("2024-03-16");

    // // views in given date range
    // const result = await ShortUrl.aggregate([
    //   {
    //     $unwind: "$visitHistory",
    //   },
    //   {
    //     $match: {
    //       "visitHistory.date": {
    //         $gte: startDate,
    //         $lte: endDate,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalClicks: { $sum: 1 },
    //     },
    //   },
    // ]);

    // give views for each date
    // const result = await User.aggregate([
    //   { $unwind: "$views" },
    //   {
    //     $group: {
    //       _id: { $dateToString: { format: "%Y-%m-%d", date: "$views.date" } },
    //       viewCount: { $sum: 1 },
    //     },
    //   },
    // ]);

    // count of unique ips
    // const result = await User.aggregate([
    //   { $unwind: "$publicIP" },
    //   {
    //     $group: {
    //       _id: "$publicIP.ip",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // count of each device type
    // const result = await User.aggregate([
    //   { $unwind: "$deviceType" },
    //   {
    //     $group: {
    //       _id: "$deviceType.type",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // calculate average cooridnates
    // const result = await User.aggregate([
    //   {
    //     $group: {
    //       _id: null,
    //       avgLat: { $avg: "$coordinates.lat" },
    //       avgLong: { $avg: "$coordinates.long" },
    //     },
    //   },
    // ]);

    // const result = await User.aggregate([
    //   {
    //     $match: {
    //       "views.date": { $gte: startDate, $lte: endDate },
    //     },
    //   },
    //   {
    //     $unwind: "$publicIP",
    //   },
    //   {
    //     $group: {
    //       _id: "$publicIP.ip",
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       uniqueViews: { $sum: 1 },
    //     },
    //   },
    // ]);

    const result = await User.aggregate([
      { $unwind: "$referrer" },
      { $match: { "referrer.source": "direct" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const setHidden = req.body.setHidden;
    await ShortUrl.findOneAndUpdate(
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
  redirectShareLink,
  updateView,
  getAllData,
  updateDoc,
  finalPage,
  getcoords,
  handleNullLocation,
  getAnalytics,
  getShareLink,
  getViewsAndClicks,
  getViewsAndClicksByDate,
  redirectPodcastLink,
  getAllSublinkData,
};
