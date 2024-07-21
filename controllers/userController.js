import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Song from "../models/Song.js";
import Playlist from "../models/Playlist.js";

//@desc Login a user
//@route POST /api/auth/login
//@access public
const loginUser = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	const user = await User.findOne({ username });

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		return res.status(400).json({ message: "Incorrect username or password!" });
	}

	const accessToken = jwt.sign(
		{
			user: {
				id: user.id,
				username: user.username,
			},
		},
		process.env.JWT_SECRET
	);

	const returnedUser = {
		id: user.id,
		username: user.username,
		name: user.name,
		image: user.image
	};
	res.status(200).json({ user: returnedUser, token: accessToken });
};

//@desc register a user
//@route POST /api/auth/register
//@access public
const registerUser = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const duplicateUsername = await User.findOne({ username });
	if (duplicateUsername) {
		return res.status(400).json({ message: "Username already exists!" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ username, password: hashedPassword });
	if (!newUser) {
		return res.status(400).json({ message: "User not created!" });
	}

	const accessToken = jwt.sign(
		{
			user: {
				id: newUser.id,
				username: newUser.username,
			},
		},
		process.env.JWT_SECRET
	);

	const returnedUser = {
		id: newUser.id,
		username: newUser.username,
		name: newUser.name,
		image: newUser.image,
	};

	res.status(200).json({ user: returnedUser, token: accessToken });
};

//@desc Get a user's favorite songs
//@route GET /api/songs/user/favorites
//@access private
const getUserFavoriteSongs = async (req, res) => {
	const { id } = req.user;
	const user = await User.findById(id);

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	const userFavorites = await Promise.all(
		user.favorites.map((id) => Song.findById(id))
	);

	if (!userFavorites) {
		return res.status(404).json({ message: "Not found!" });
	}

	res.status(200).json(userFavorites);
};

const getAllUser = async (req, res) => {
	const users = await User.find({});
  
	if (!users) {
	  return res.status(400).json({ message: "No user found" });
	}
  
	const filterUsers = users.map((user) => ({
	  id: user._id,
	  username: user.username,
	  name: user.name,
	  image: user.image,
	}));
  
	res.status(200).json(filterUsers);
  };
  


const getUserId = async (req,res) => {

	const { id } = req.params
	const user = await User.findById(id);

	if (!user) {return res.status(404).json({ message: "User not found!" });}

	try{
		const userCreateSongs = await Promise.all(
			user.songs.map((id) => Song.findById(id))
		);
	  
		const userFavoritesSongs = await Promise.all(
		user.favorites.map((id) => Song.findById(id))
		);
	
		const userPlaylist = await Promise.all(
		user.playlists.map((id) => Playlist.findById(id))
		);
	
		res.status(200).json(
			{
				user:user,
				userCreateSongs:userCreateSongs,
				userFavoritesSongs:userFavoritesSongs,
				userPlaylist:userPlaylist
			}
		);
	}catch(error){
		res.status(400).json({ message: error.message });
	}	
}


const editUser = async (req, res) => {
	const { id } = req.user;
	const { updatedName, updatedImage } = req.body;
  
	try {
	  const user = await User.findById(id);
  
	  if (!user) {
		return res.status(404).json({ message: "User not found!" });
	  }
	  if (!updatedName || !updatedImage) {
		return res.status(400).json({ message: "Updated name or image is missing" });
	  }
  
	  const updatedUser = await User.findOneAndUpdate(
		{ _id: id },
		{ name: updatedName, image: updatedImage },
		{ new: true }
	  );
  
	  const allSongs = await Song.find({ userId: id });
  
		await allSongs.map((song) => {
		  if (song.userId == id) {//(song.userId === id)
			return Song.findOneAndUpdate(
			  { _id: song._id },
			  { Artiste: updatedName },
			  { new: true }
			);
		}
		})

	  if (!updatedUser) {
		return res.status(404).json({ message: "User not found!" });
	  }
  
	  const filterUser = {
		id: updatedUser._id,
		username: updatedUser.username,
		name: updatedUser.name,
		image: updatedUser.image,
	  };
  
	  res.status(200).json(filterUser);
	} catch (error) {
	  res.status(500).json({ message: "Internal server error" });
	}
  };
	  

export { loginUser, registerUser, getUserFavoriteSongs,getUserId,getAllUser,editUser };
