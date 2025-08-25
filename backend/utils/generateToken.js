import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // payload
    process.env.JWT_SECRET, // secret key (ENV me rakhi hogi)
    {
      expiresIn: "30d", 
    }
  );
};

export default generateToken;
