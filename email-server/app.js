const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express')
const { check, validationResult } = require("express-validator");
const swaggerDocument = require('./swagger.json');
const PORT = process.env.PORT || 8080;
const nodemailer = require('nodemailer');
require("dotenv").config();
const {connection} = require("../database/connector")


app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

app.listen(PORT, () => {
    console.log(`Server is running on port`, PORT);
});

app.post("/sendInvite",async(req, res) => {
    try{
        const {email} = req.body
        console.log(process.env.API_MAIL);
        const transporter = nodemailer.createTransport({
            host: "smtp.mandrillapp.com",
            port: 587,
            secure: false,
            auth: {
            user: 'testovtestov22@gmail.com',
            pass:process.env.API_MAIL
            }
            
        })
        const mailOptions = {
            from: 'testovtestov22@gmail.com',
            to: email,
            //replyTo:email,
            subject: `Email confirmation for ${email}`,
            text:`Thank you for creating a profile on our website. To confirm your profile please click the link specified
              Link: http://localhost:8080/confirmation/`,
          };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            return res.status(500).json({
                message: "",
                errors: [
                { value: error, msg: error.message, },
                ],
            });
            } else {
            console.log('Email sent: ' + info.response);
            }
        }); 
    }
    catch(e){ 
        console.log(e);
        return res.status(500).json({
            message: "",
            errors: [
            { value: e, msg: e.message, },
            ],
        });
    }
   
})
app.get("/confirmation",[],async(req,res)=>{
    try{
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data sent for confirmation",
        });
      }
      //const {hash}= req.body;
      const hash ="hash"
      const user= ""
      //await User.findOne({confirmationHash:hash});
    
      if(user){
        if(user.emailConfirmed){
          res.status(200).json({message:"Email was already confirmed",emailConfirmed:true})
        }
        user.emailConfirmed = true;
        user.confirmationHash = " ";
        await user.save();
        res.status(200).json({message:"Successfully confirmed email",emailConfirmed:true});
      }else{
        res.status(500).json({ message: "User not found" ,errors:[{value:"email",msg:"User not found"}]});
      }
    }catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Invalid data",
        errors: [
          { value: error, msg: error.message },
        ],
      });
    }
  
})
app.get("/testDB",(req, res) => {

  const session =connection()
  session.executeRead(tx=>tx.run("MATCH (n) return n")).then(records=>records.records.forEach(record=>console.log(record.get('n'))))
  res.json({return:"HELLO"})
})