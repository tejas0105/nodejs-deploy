import express from "express";
import {
  home,
  createShortLink,
  getShortLinkAndRedirect,
  getAllData,
  updateDoc,
  finalPage,
  getcoords,
  // handleNullLocation,
  getAnalytics,
} from "../controllers/controller.js";

const router = express.Router();

router.route("/").get(home);
router.route("/getalldata").get(getAllData);
router.route("/short").post(createShortLink);
router.route("/:id").get(getShortLinkAndRedirect);
router.route("/update/:id").patch(updateDoc);
router.route("/api/finalpage").get(finalPage);
router.route("/api/getCoord").post(getcoords);
// router.route("/api/handlenulllocation").post(handleNullLocation);
router.route("/api/getAnalytics").get(getAnalytics);

export default router;
