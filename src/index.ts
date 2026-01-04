import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import fishRoutes from "./routes/fishRoutes";
import articleRoutes from "./routes/articleRoutes";
import messageRoutes from "./routes/messageRoutes";
import adminRoutes from "./routes/adminRoutes";
import { attachCurrentUser } from "./controllers/middleware";

const app = express();

app.use(express.json());
app.use(attachCurrentUser);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/fish", fishRoutes);
app.use("/articles", articleRoutes);
app.use("/", messageRoutes);
app.use("/admin", adminRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
