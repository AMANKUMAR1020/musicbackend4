import express from "express";
import {
	createPlaylist,
	editPlaylist,
	getPlaylist,
	getPlaylists,
	deletePlaylist
} from "../controllers/playlistController.js";
import { verifyToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/", getPlaylists);
router.get("/:id", getPlaylist); //post id number
router.post("/create", verifyToken, createPlaylist);
router.put("/:id", verifyToken, editPlaylist);//give id of playlist
router.delete("/:playlistid", verifyToken, deletePlaylist);//give id of playlist

export { router as playlistRouter };