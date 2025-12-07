import express from "express";
import cors from "cors";
import Jwt from "jsonwebtoken";
import employeeOfTheMonthRoute from "./Routes/EmpOfTheMonthRoute.js";
import { AdminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import { ProjectsRoutes } from "./Routes/ProjectsRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connection from "./utils/db.js";
dotenv.config();
const app = express();

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "http://localhost:5173",
//         "https://emp-management-weld.vercel.app",
//       ];

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );


// CORS config
const allowedOrigins = [
  "http://localhost:5173",
  "https://emp-management-weld.vercel.app",
  "https://emp-management-aulwgluho-jayakrishnas-projects-9b5fa761.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS error:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Handle preflight
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use("/auth", AdminRouter);
app.use("/employee", EmployeeRouter);
app.use("/api", ProjectsRoutes);
app.use(express.static("Public"));
app.use("/api/emp", employeeOfTheMonthRoute);
// app.use('/', router);


app.get("/", (req, res) => {
  res.send("root api is working");
});

let PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server has been started");
});
