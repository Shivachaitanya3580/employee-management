import express from "express";
import connection from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();


router.post("/employee_login", (req, res) => {
    const mysql2 = "SELECT * from employee where email=?";
    connection.query(
      mysql2,
      [req.body.email],
      (err, result) => {
        if (err) return res.json({ loginStatus: false, err });
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password,(err,response)=>{
                if (err) return res.json({ loginStatus: false, Error:'wrong password' });
                if(response){
                    const email = result[0].email;
                    const token = jwt.sign(
                      { role: "employee", email: email,id:result[0].id },
                      process.env.JWT_SECRET,
                      { expiresIn: "1d" }
                    );
                    res.cookie("token", token);                                  // we r storing token inside the cookie
                    return res.json({ loginStatus: true, id:result[0].id });
                }
            })
        } else {
          return res.json({ loginStatus: false, Error: "invalid credentials" });
        }
      }
    );
  });

  router.get('/detail/:id',(req,res)=>{                                
    const id = req.params.id;
    const mysql2 = "SELECT * FROM employee where id = ?"
    connection.query(mysql2,[id],(err,result)=>{
      if(err) return res.json({Status:false})
        return res.json(result)
    })
  })

  router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({Status:true})
  })

 export {router as EmployeeRouter} 