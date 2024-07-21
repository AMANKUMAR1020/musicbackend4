import Song from "../models/Song.js";
import User from "../models/User.js";

//@desc Get all the songs
//@route GET /api/songs
//@access public
const getSongs = async (req, res) => {
	const songs = await Song.find({});

	if (!songs) {
		return res.status(400).json({ message: "An error occured!" });
	}

	const shuffledSongs = songs.sort(() => (Math.random() > 0.5 ? 1 : -1));

	res.status(200).json(shuffledSongs);
};

const getTopSongs = async (req, res) => {

	try {
		const songs = await Song.find({});

		const results = songs.sort((a, b) => (a.likes.size() < b.likes.size() ? 1 : -1));
		
		res.status(200).json(results);
	
	} catch (error) {
	
		res.status(400).json({ message: error.message });
	
	}
};

const likeSong = async (req, res) => {
	const { id } = req.user;
	const { songId } = req.params; // Destructure songId from req.params
  
	console.log("id", id);
	console.log("songId", songId);
  
	const user = await User.findById(id);
	const song = await Song.findById(songId);
  
	if (!user) {
	  console.log("user not found");
	  return res.status(404).json({ message: "User not found!" });
	}
	if (!song) {
	  console.log("song not found");
	  return res.status(404).json({ message: "Song not found!" });
	}
  
	try {
	  const isLiked = song.likes.includes(id);
  
	  if (!isLiked) {
		await Song.updateOne(
		  { _id: songId },
		  { $addToSet: { likes: id } }
		);
  
		await User.updateOne(
		  { _id: id },
		  { $addToSet: { favorites: songId } }
		);
  
		console.log("like");
		return res.status(200).json({ message: "You liked it" });
	  } else {
		await Song.findByIdAndUpdate(
		  songId,
		  { $pull: { likes: id } },
		  { new: true }
		);
  
		await User.findByIdAndUpdate(
		  id,
		  { $pull: { favorites: songId } },
		  { new: true }
		);
  
		console.log("unlike");
		return res.status(200).json({ message: "You disliked it" });
	  }
	} catch (error) {
	  return res.status(500).json({ error: error.message });
	}
  };
  

const createSong = async (req, res) => {
	const { id } = req.user;
	//const data = req.body;
	const {title,coverImage, songUrl} = req.body
	const user = await User.findById(id);
  
	if (!user) {
	  return res.status(404).json({ message: "User not found!" });
	}
  
	if (!coverImage || !title || !songUrl) {
	  return res.status(400).json({ message: "Data fields are required" });
	}
  
	const newSong = await Song.create({
	  title: title,
	  coverImage: coverImage,
	  songUrl: songUrl,
	  Artiste: user.name,
	  userId: id,
	});

	if (newSong) {
	  user.songs.push(newSong._id);
	  await user.save();
	  return res.status(200).json(newSong);
	} else {
	  return res.status(500).json({ message: "Failed to create new song!" });
	}
  };

  


const deleteSong = async (req, res) => {
	const { id } = req.user;
	const songid = req.params.songid;

	const user = await User.findById(id);
	const song = await Song.findById(songid);
  
	if (!user) {
	  return res.status(404).json({ message: "User not found!" });
	}
	if (!song) {
	  return res.status(404).json({ message: "Song not found!" });
	}
  
	const allusers = await User.find({});
  
	await Promise.all(
	  allusers.reduce((accumulator, user) => {
		if (user.favorites.includes(songid)) {
		  user.favorites.pull(songid);
		  return user.save();
		}
		return accumulator;
	  }, [])
	);
  
	if (user.songs.includes(songid)) {
	  user.songs.pull(songid);
	  await user.save();
	}
  
	const deleteSong = await song.deleteOne();
  
	if (deleteSong) {
	  return res.status(200).json(deleteSong);
	} else {
	  return res.status(500).json({ message: "Failed to delete song!" });
	}
};
  

const getSongsById = async(res,req)=>{
	const { id } = req.params;
	//const { id } = req.body;
	const user = await User.findById(id);
  
	if (!user) {
	  return res.status(404).json({ message: "User not found!" });
	}
  
	const userFavorites = await Promise.all(
	  user.songs.map((id) => Song.findById(id))
	);
  
	if (!userFavorites) {
	  return res.status(404).json({ message: "Not found!" });
	}
//	res.status(200).json({user:user, userFavorites:userFavorites});
	res.status(200).json(userFavorites);
}
  
export {
	getSongs,
	getTopSongs,
	likeSong,
	createSong,
	deleteSong,
	getSongsById
};
