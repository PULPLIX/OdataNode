//Main imports
import express from 'express'
import config from './envConfig.js'

//Routes Imports
import postsRoutes from "./routes/posts.routes.js";

const app = express()

//settings 
app.set('port', config.port);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", postsRoutes);

export default app;