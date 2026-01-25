
// Mock SMS service for SIH presentation
// In production, integrate with Twilio or Fast2SMS

export const sendSMS = async (mobile: string, message: string) => {
    console.log(`[SMS-SERVICE] Sending SMS to ${mobile}: ${message}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}
