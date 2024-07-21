import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		default:"new Artiste"
	},
	image: {
		type: String,
		required: true,
		default:"https://cdn.vectorstock.com/i/1000v/38/05/male-face-avatar-logo-template-pictograph-vector-11333805.jpg"
	},
	songs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Song",
	},],
	playlists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Playlist",
	},],
	favorites: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Song",
	},],
});

const User = mongoose.model("User", UserSchema);
export default User;













// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	},
// 	favorites: {
// 		type: Array,
// 		default: [],
// 	},
// 	playlists: {
// 		type: Array,
// 		default: [],
// 	},
// });

// const User = mongoose.model("User", UserSchema);
// export default User;
