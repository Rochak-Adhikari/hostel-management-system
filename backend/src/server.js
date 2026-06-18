const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes (add one by one as you build them)
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/students",    require("./routes/studentRoutes"));
app.use("/api/rooms",       require("./routes/roomRoutes"));
app.use("/api/allocations", require("./routes/allocationRoutes"));
app.use("/api/fees",        require("./routes/feeRoutes"));
app.use("/api/complaints",  require("./routes/complaintRoutes"));
app.use("/api/visitors",    require("./routes/visitorRoutes"));
app.use("/api/notices",     require("./routes/noticeRoutes"));

app.get("/", (req, res) => res.send("HostelHub API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));