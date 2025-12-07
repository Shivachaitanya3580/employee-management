import express from "express";
import connection from "../utils/db.js";
import jwt from "jsonwebtoken";
const router = express.Router();
import bcrypt from "bcrypt";
import multer from 'multer';
import path from "path";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();


// Admin Login Route
router.post("/adminlogin", (req, res) => {
  const mysql2 = "SELECT * from employee.admin where email=? and password =?";
  connection.query(
    mysql2,
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) return res.json({ loginStatus: false, err });
      if (result.length > 0) {
        const email = result[0].email;
        const token = jwt.sign(
          { role: "admin", email: email,id:result[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        // res.cookie("token", token,{httpOnly:true});
        return res.json({ loginStatus: true ,"token":token});
      } else {
        return res.json({ loginStatus: false, Error: "invalid credentials" });
      }
    }
  );
});

// Get Categories
router.get("/category", (req, res) => {
  const mysql2 = "SELECT * from category";
  connection.query(mysql2, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    else return res.json({ Status: true, Result: result });
  });
});

// Add Category
router.post("/add-category", (req, res) => {
  const mysql2 = "INSERT into category (`name`) VALUES (?)";
  connection.query(mysql2, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    else return res.json({ Status: true });
  });
});

// Image Uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

// Add Employee
router.post("/add-employee", upload.single('image'), (req, res) => {
  const mysql2 = `INSERT INTO employee (name,email,password,address,salary,image,category_id) values (?)`;

  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: err });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
    ];
    connection.query(mysql2, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      else return res.json({ Status: true });
    });
  });
});

// Get All Employees
router.get("/employee", (req, res) => {
  const mysql2 = "SELECT * FROM employee";
  connection.query(mysql2, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    else return res.json({ Status: true, Result: result });
  });
});






// Get Employee by ID
router.get("/employee/:id", (req, res) => { 
  const id = req.params.id;
  const mysql2 = "SELECT * FROM employee WHERE id=?";
  connection.query(mysql2, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    else return res.json({ Status: true, Result: result });
  });
});

// Update Employee (Removed validation check)
router.put('/edit-employee/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, salary, address, category_id } = req.body;

  const mysql2 = `UPDATE employee set name= ?, email= ?, salary = ?, address = ?, category_id = ? WHERE id = ?`;
  const values = [name, email, salary, address, category_id];
  connection.query(mysql2, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

// deleting employees
router.delete('/delete_employee/:id', (req, res) => { 
  const id = req.params.id;
  const mysql2 = "DELETE FROM employee WHERE id=?";
  connection.query(mysql2, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});


// for admin
router.get('/admin_count',(req,res)=>{
  const mysql2 = "select count(id) as admin from admin"
  connection.query(mysql2, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
})

// for employee count
router.get('/employee_count',(req,res)=>{
  const mysql2 = "select count(id) as employee from employee"
  connection.query(mysql2, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
})

// for salary count
router.get('/salary_count',(req,res)=>{
  const mysql2 = "select sum(salary) as salaryOfEmp from employee"
  connection.query(mysql2, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
})


// admin records
router.get('/admin_records',(req,res)=>{
  const mysql2 = "select * from admin"
  connection.query(mysql2, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
})

// to logout
router.get('/logout',(req,res)=>{
  res.clearCookie('token')
  return res.json({Status:true})
})



// for edit in home.jsx
// Update Admin
router.put('/edit-admin/:id', (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;  // Admin should be able to update email and password

  // If a new password is provided, hash it
  let query = "UPDATE admin SET email = ?";
  let values = [email];

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.json({ Status: false, Error: err });

      query = "UPDATE admin SET email = ?, password = ?";
      values = [email, hashedPassword];

      connection.query(query, [...values, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
      });
    });
  } else {
    connection.query(query, [...values, id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true, Result: result });
    });
  }
});


// for delete in home.jsx
// Delete Admin
router.delete('/delete-admin/:id', (req, res) => {
  const { id } = req.params;
  const mysql2 = "DELETE FROM admin WHERE id = ?";

  connection.query(mysql2, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});



//*************************************************** */ for profile page




const verifyUser = (req, res, next) => {
  // const token = req.cookies.token; // Get the token from the cookies
 // Extract token 
 let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ Status: false, Error: "Invalid token" });
      }
      
      req.id = decoded.id; // Set the decoded ID from the token
      req.role = decoded.role; // Set the decoded role from the token
      next(); // Proceed to the next middleware (route handler)
    });
  } else {
    return res.status(401).json({ Status: false, Error: "Not Authenticated" });
  }
};



// Route to verify user
router.get('/verify',verifyUser, (req, res) => {
  const mysqlQuery = "SELECT * FROM admin WHERE id = ?";

  connection.query(mysqlQuery, [req.id], (err, result) => {
    
    if (err || result.length === 0) {
      return res.status(500).json({ Status: false, Error: "Database query failed" });
    }

    const admin = result[0];
    res.json({
      Status: true,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
    });
  });
});









export { router as AdminRouter };

