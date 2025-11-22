import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendOTP = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    return {
      success: true,
      status: verification.status,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Twilio Send OTP Error:", error);
    throw new Error(error.message || "Failed to send OTP");
  }
};

export const verifyOTP = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    return {
      success: verificationCheck.status === "approved",
      status: verificationCheck.status,
    };
  } catch (error) {
    console.error("Twilio Verify OTP Error:", error);
    throw new Error(error.message || "Failed to verify OTP");
  }
};
