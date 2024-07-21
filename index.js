import express from "express";
import dotenv from "dotenv";
//import cors from "cors";
import { connectDB } from "./config/dbConnection.js";
import { songsRouter } from "./routes/songRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
//import { corsOptions } from "./config/corsOptions.js";
import { playlistRouter } from "./routes/playlistRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
//app.use(cors(corsOptions));
//app.use(cors());
app.use((req, res, next) =>{
		  res.setHeader('Access-Control-Allow-Origin','http://localhost:3000/');
	//	  res.setHeader('Access-Control-Allow-Origin','https://musicfrontend2.vercel.app/');
		  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT,PATCH, DELETE');
		  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		  next();
		});

connectDB();


app.use("/api/songs/", songsRouter);
app.use("/api/users/", userRouter);
app.use("/api/playlists/", playlistRouter);

const port = process.env.PORT || 3500;

app.get('/api/', (req, res) => {
    return res.json({
        messages: "hello world!"
    })
})

app.listen(port, async () => {
	console.log(`server is running on port ${port}`);
});

//module.exports = app;


















// import express, { Router } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { connectDB } from "./config/dbConnection.js";
// import { songsRouter } from "./routes/songRoutes.js";
// import { userRouter } from "./routes/userRoutes.js";
// import { playlistRouter } from "./routes/playlistRoutes.js";
// import serverless from "serverless-http";

// dotenv.config();

// const app = express();
// const router = express.Router();

// app.use(express.json());
// app.use(cors());
// connectDB();

// router.use("/songs/", songsRouter);
// router.use("/users/", userRouter);
// router.use("/playlists/", playlistRouter);

// router.get('/', (req, res) => {
//     return res.json({
//         messages: "hello world!"
//     })
// })

// api.use("/api/", router);
// export const handler = serverless(api);

// // app.use('/.netlify/functions/index',router)
// // const handler = ServerlessHttp(app);

// // module.exports.handler = async(event, context) => {
// //     const result = await handler(event, context);
// //     return result;
// // }

















// import express from "express";
// import dotenv from "dotenv";
// //import cors from "cors";
// import { connectDB } from "./config/dbConnection.js";
// import { songsRouter } from "./routes/songRoutes.js";
// import { userRouter } from "./routes/userRoutes.js";
// //import { corsOptions } from "./config/corsOptions.js";
// import { playlistRouter } from "./routes/playlistRoutes.js";
// import ServerlessHttp from "serverless-http";

// dotenv.config();

// const app = express();
// app.use(express.json());
// //app.use(cors(corsOptions));
// //app.use(cors());
// app.use((req, res, next) =>{
// 	//	  res.setHeader('Access-Control-Allow-Origin','http://localhost:3000/');
// 		  res.setHeader('Access-Control-Allow-Origin','https://musicfrontend2.vercel.app/');
// 		  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT,PATCH, DELETE');
// 		  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 		  next();
// 		});

// connectDB();


// app.use("/api/songs/", songsRouter);
// app.use("/api/users/", userRouter);
// app.use("/api/playlists/", playlistRouter);

// const port = process.env.PORT || 3500;

// app.get('/api/', (req, res) => {
//     return res.json({
//         messages: "hello world!"
//     })
// })

// const handler = ServerlessHttp(app);

// // app.listen(port, async () => {
// // 	console.log(`server is running on port ${port}`);
// // });

// app.use('/.netlify/functions/index')
// module.exports.handler = async(event, context) => {
//     const result = await handler(event, context);
//     return result;
// }

