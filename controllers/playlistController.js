import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";
import User from "../models/User.js";

//@desc Get all the playlists
//@route GET /api/playlists
//@access public
const getPlaylists = async (req, res) => {
	const playlists = await Playlist.find({});

	if (!playlists) {
		return res.status(400).json({ message: "An error occured" });
	}

	res.status(200).json(playlists);
};

//@desc Create a playlist
//@route POST /api/playlists/create
//@access private
const createPlaylist = async (req, res) => {
	const { id } = req.user;
	const { title, description, isPrivate, songIds } = req.body;

	const user = await User.findById(id);

	if (!title || !songIds) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	await Promise.all(
		songIds.map(async (id) => {
			const songExists = await Song.findById(id);
			if (!songExists) {
				return res.status(404).json({ message: "Song not found" });
			}
		})
	);

	const newPlaylist = await Playlist.create({
		title,
		description,
		userId: id,
		songs: songIds,
		isPrivate,
	});

	if (!newPlaylist) {
		return res.status(400).json({ message: "An error occured!" });
	}

	user.playlists.push(newPlaylist.id);
	await user.save();

	res.status(201).json(newPlaylist);
};

const getPlaylist = async (req, res) => {
	const { id } = req.params;
	
	const playlist = await Playlist.findById(id);
	if (!playlist) {
		return res.status(404).json({ message: "Playlist not found!" });
	}

	try {

		const playlistSongs = await Promise.all(
			playlist.songs.map(async(id) => Song.findById(id))
		);

		res.status(200).json({playlist:playlist ,playlistSongs:playlistSongs});
	} 
	catch (error) {
		res.status(400).json({ message: error.message });
	}
};



//@desc Add or remove a song from a playlist
//@route PATCH /api/playlists/:id
//@access private
const editPlaylist = async (req, res) => {
	const { id } = req.params;
//	const userId = req.user.id;
	const { title, description, songIds } = req.body;
	const playlist = await Playlist.findById(id);

	if (!title || !songIds) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	if (!playlist) {
		return res.status(400).json({ message: "Playlist not found!" });
	}

	await Promise.all(
		songIds.map(async (id) => {
			const songExists = await Song.findById(id);
			if (!songExists) {
				return res.status(404).json({ message: "Song not found" });
			}
		})
	);

	const updatedPlaylist = await Playlist.findByIdAndUpdate(
		id,
		{ title, description, songs: songIds },
		{
			new: true,
		}
	);

	if (!updatedPlaylist) {
		return res.status(400).json({ message: "Playlist not updated!" });
	}
	res.status(200).json(updatedPlaylist);
};

const deletePlaylist = async (req,res)=>{
	const { id } = req.user;
	const playlistid = req.params.playlistid;
//	const songid = req.body.songid;
//	const songid = req.body;
	
	const user = await User.findById(id);
	if (!user) {
	  return res.status(404).json({ message: "User not found!" });
	}

	const playlist = await Playlist.findById(playlistid);
	if (!playlist) {
	  return res.status(404).json({ message: "playlist not found!" });
	}

	const isplaylists = user.playlists.includes(playlist);
	if(isplaylists){
		user.playlists.pull(playlist);
		await user.save()
	}

	const deleteSong = await playlist.deleteOne();
//	console.log(deleteSong)

	if (deleteSong) {
	  return res.status(200).json({ message: "Failed to delete song!",deleteSong:deleteSong });
	}
} 

export { getPlaylists, createPlaylist, getPlaylist, editPlaylist,deletePlaylist };