import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport";
import session from "express-session";
import "./config/passport.js";

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.use(
  session({
    secret: process.env.SESSION_SECRET || "some_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());



//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import premiumRoutes from "./routes/premium.routes.js";
import { schedulePremiumExpiryJob } from "./cron/premiumExpiryJob.js";
import billingRoutes from "./routes/billing.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/premium", premiumRoutes);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

schedulePremiumExpiryJob();
// http://localhost:8000/api/v1/users/register

app.use((err, _req, res, _next) => {
  console.error(" Error caught:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});




export { app }