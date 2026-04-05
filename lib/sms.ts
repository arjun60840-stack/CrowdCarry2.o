/**
 * CrowdCarry SMS Utility
 * Handles sending OTP and notifications via external SMS providers.
 * Default implementation is a placeholder that logs to console but can be 
 * easily connected to Twilio, Vonage, or Msg91.
 */

interface SMSPayload {
  to: string;
  body: string;
}

export async function sendSMS({ to, body }: SMSPayload) {
  const provider = process.env.SMS_PROVIDER || "LOG"; // LOG, TWILIO, MSG91
  
  console.log(`[SMS ${provider}] Sending to ${to}: ${body}`);

  if (provider === "FAST2SMS") {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      console.error("Fast2SMS API key missing");
      return { success: false, error: "API key missing" };
    }

    try {
      const otpCode = body.match(/\d+/)?.[0] || "1234";
      const cleanPhone = to.replace(/\D/g, "").slice(-10);
      const apiUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otpCode}&numbers=${cleanPhone}`;
      
      console.log(`[SMS FAST2SMS] Attempting to send OTP ${otpCode} to ${cleanPhone}`);

      const res = await fetch(apiUrl, { method: "GET" });
      const data = await res.json();

      if (!res.ok || !data.return) {
        console.error("Fast2SMS API Error Response:", data);
        return { success: false, error: data.message || "Failed to send SMS" };
      }
      
      console.log("[SMS FAST2SMS] Successfully sent!");
      return { success: true };
    } catch (error: any) {
      console.error("Fast2SMS Exception:", error.message);
      return { success: false, error: error.message };
    }
  }

  if (provider === "TWILIO") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !from) {
      console.error("Twilio credentials missing");
      return { success: false, error: "Credentials missing" };
    }

    try {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to.startsWith("+") ? to : `+91${to}`,
          From: from,
          Body: body,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Twilio error");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Twilio SMS send failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Default: Just log and return success for demo purposes
  return { success: true };
}

export async function sendOTP(phone: string, otp: string) {
  const body = `Your CrowdCarry verification code is: ${otp}. Do not share this with anyone. Valid for 5 minutes.`;
  return sendSMS({ to: phone, body });
}
