const path = require("path");
const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./db/database");
const { seedAll } = require("./db/seed");
const { authMiddleware, requireRole } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const readersRoutes = require("./routes/readers");
const specializationsRoutes = require("./routes/specializations");
const bookTitlesRoutes = require("./routes/bookTitles");
const bookCopiesRoutes = require("./routes/bookCopies");
const borrowsRoutes = require("./routes/borrows");
const reportsRoutes = require("./routes/reports");
const dashboardRoutes = require("./routes/dashboard");

initDatabase();
seedAll();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "UniLib backend is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, requireRole("admin"), usersRoutes);
app.use("/api/readers", authMiddleware, readersRoutes);
app.use("/api/specializations", authMiddleware, specializationsRoutes);
app.use("/api/book-titles", authMiddleware, bookTitlesRoutes);
app.use("/api/book-copies", authMiddleware, bookCopiesRoutes);
app.use("/api/borrows", authMiddleware, borrowsRoutes);
app.use("/api/reports", authMiddleware, reportsRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "He thong gap loi noi bo.", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`UniLib backend listening on http://localhost:${PORT}`);
});
