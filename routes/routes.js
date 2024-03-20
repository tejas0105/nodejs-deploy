import express from "express";
import {
  home,
  createShortLink,
  getShortLinkAndRedirect,
  updateView,
  getAllData,
  updateDoc,
  finalPage,
  getcoords,
  handleNullLocation,
  getShareLink,
  redirectShareLink,
  getAnalytics,
  getViewsAndClicks,
  getViewsAndClicksByDate,
} from "../controllers/controller.js";

const router = express.Router();

router.route("/").get(home);
router.route("/getalldata").get(getAllData);
router.route("/short").post(createShortLink);
router.route("/:id").get(getShortLinkAndRedirect);
router.route("/api/updateView").post(updateView);
router.route("/update/:id").patch(updateDoc);
router.route("/api/finalpage").get(finalPage);
router.route("/api/getCoord").post(getcoords);
router.route("/api/handlenulllocation").post(handleNullLocation);
router.route("/api/getAnalytics").get(getAnalytics);
router.route("/api/getsharelink/:id").get(getShareLink);
router.route("/api/redirectsharelink/:id").get(redirectShareLink);
router.route("/api/getviewsbydate").get(getViewsAndClicks);
router.route("/api/getViewsAndClicksByDate").post(getViewsAndClicksByDate);

export default router;
