import express from "express";
import db from "../utils/db.js";

const router = express.Router();

// router.get("/employee-of-the-month", async (req, res) => {
//     try {
//       console.log("Getting employee of the month...");
//       const [rows] = await db.query(`
//         SELECT 
//           e.id,
//           e.name,
//           e.email,
//           e.image,
//           e.category,
//           e.salary,
//           COUNT(p.id) AS completed_projects
//         FROM employee e
//         JOIN projects p ON e.id = p.employee_id
//         WHERE p.status = 'Completed'
//         GROUP BY e.id
//         ORDER BY completed_projects DESC
//         LIMIT 1
//       `);
  
//       console.log("Query result:", rows);
  
//       if (rows.length === 0) {
//         return res.status(404).json({ message: "No completed projects found." });
//       }
  
//       res.json(rows[0]);
//     } catch (error) {
//       console.error("Error fetching employee of the month:", error);
//       res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
//   });
  

export default router;
