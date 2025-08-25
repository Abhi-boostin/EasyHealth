import bcrypt from "bcryptjs";
import User from "../models/User.js";
import twilio from "twilio";
import generateToken from "../utils/generateToken.js";

//twilo client se baatcheet

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  //REGISTRATION 

  export const register = async (req,res) => {
    try {
        const { phone, password } = req.body;
        const exsitinguser = await User.findOne({phone});
        if(exsitinguser){
            return res.status(400).json({ msg: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
    
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    
        const user = await User.create({
          phone,
          password: hashedPassword,
          otp: hashedOtp,
          otpExpiresAt: otpExpiry,
        });
    } catch (error) {
        
    }
  }