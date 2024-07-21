import express from "express";
import {
	getUserFavoriteSongs,
	loginUser,
	registerUser,
	getUserId,
	getAllUser,
	editUser
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/allusers", getAllUser);// artistes
router.get("/:id",verifyToken,getUserId);//all infornamtion will get for any user //post id number
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/favorites", verifyToken, getUserFavoriteSongs);
router.put("/myprofile",verifyToken,editUser)//only name and photo eill change

export { router as userRouter };