import express from "express";
import {
	getSongs,
	getTopSongs,
	likeSong,
	createSong,
	deleteSong,
} from "../controllers/songController.js";
import { verifyToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/top", getTopSongs);
router.patch("/:songId",verifyToken, likeSong);//click to like the song
router.post("/create",verifyToken,createSong);// there is also need to do some work >>>
router.delete("/:songid",verifyToken,deleteSong);//pass the song id in it

export { router as songsRouter };
