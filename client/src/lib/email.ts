/**
 * Email Notification Service using Nodemailer
 * 
 * Setup required in .env:
 * EMAIL_HOST=smtp.gmail.com
 * EMAIL_PORT=587
 * EMAIL_USER=your-email@gmail.com
 * EMAIL_PASS=your-app-password (not regular password, use App Passwords from Google)
 * EMAIL_FROM="AgrowCart <noreply@agrowcart.com>"
 */

import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
    // Priority: use service 'gmail' if user is gmail
    const config: any = {
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    };

    if (process.env.EMAIL_USER?.includes('gmail.com')) {
        config.service = 'gmail';
    } else {
        config.host = process.env.EMAIL_HOST || 'smtp.gmail.com';
        config.port = parseInt(process.env.EMAIL_PORT || '587');
        config.secure = config.port === 465;
    }

    return nodemailer.createTransport(config);
};

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Send email using configured transporter
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    const transporter = createTransporter();

    try {
        // Verify connection configuration
        await transporter.verify();

        const fromEmail = process.env.EMAIL_USER;
        const fromName = "AgrowCart";

        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || '',
        });

        console.log(`✅ Email sent to ${options.to}`);
        return { success: true };
    } catch (error: any) {
        console.error('❌ Email error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Order Confirmation Email Template
 */
export function orderConfirmationEmail(data: {
    customerName: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: string }>;
    totalAmount: number;
    address: string;
    paymentMethod: string;
}): string {
    const itemsHtml = data.items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${item.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">₹${item.price}</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🌾 AgrowCart</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Order Confirmed!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hello <strong>${data.customerName}</strong>,</p>
                <p style="font-size: 14px; color: #666;">Thank you for your order! We've received your order and will begin processing it soon.</p>
                
                <!-- Order ID Box -->
                <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Order ID</p>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #16a34a;">${data.orderId}</p>
                </div>
                
                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background: #f9f9f9;">
                            <th style="padding: 12px; text-align: left; color: #666; font-size: 12px; text-transform: uppercase;">Item</th>
                            <th style="padding: 12px; text-align: center; color: #666; font-size: 12px; text-transform: uppercase;">Qty</th>
                            <th style="padding: 12px; text-align: right; color: #666; font-size: 12px; text-transform: uppercase;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
                            <td style="padding: 15px; text-align: right; font-weight: bold; color: #16a34a; font-size: 18px;">₹${data.totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <!-- Delivery Address -->
                <div style="background: #fafafa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0 0 5px; font-size: 12px; color: #666; text-transform: uppercase;">Delivery Address</p>
                    <p style="margin: 0; font-size: 14px; color: #333;">${data.address}</p>
                </div>
                
                <!-- Payment Method -->
                <p style="font-size: 14px; color: #666;">
                    <strong>Payment Method:</strong> ${data.paymentMethod === 'online' ? 'Paid Online ✓' : 'Cash on Delivery'}
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #18181b; padding: 20px; text-align: center;">
                <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                    Questions? Email us at <a href="mailto:vibhusun01@gmail.com" style="color: #4ade80;">vibhusun01@gmail.com</a>
                </p>
                <p style="color: #71717a; font-size: 10px; margin: 10px 0 0;">
                    © 2026 AgrowCart. Made with ❤️ in Kurukshetra, India
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Send Order Confirmation Email
 */
export async function sendOrderConfirmation(
    email: string,
    data: Parameters<typeof orderConfirmationEmail>[0]
): Promise<{ success: boolean; error?: string }> {
    return sendEmail({
        to: email,
        subject: `🌾 Order Confirmed! #${data.orderId.slice(-8).toUpperCase()}`,
        html: orderConfirmationEmail(data),
        text: `Your order ${data.orderId} has been confirmed. Total: ₹${data.totalAmount}`
    });
}

/**
 * Order Dispatched Email
 */
export async function sendOrderDispatchedEmail(
    email: string,
    customerName: string,
    orderId: string,
    deliveryPartner: string
): Promise<{ success: boolean; error?: string }> {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">🚚 Your Order is On the Way!</h2>
        <p>Hello ${customerName},</p>
        <p>Great news! Your order <strong>#${orderId.slice(-8).toUpperCase()}</strong> has been dispatched and is on its way to you.</p>
        <p><strong>Delivery Partner:</strong> ${deliveryPartner}</p>
        <p>You will receive an OTP for delivery verification.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">AgrowCart Team</p>
    </div>
    `;

    return sendEmail({
        to: email,
        subject: `🚚 Order Dispatched! #${orderId.slice(-8).toUpperCase()}`,
        html,
        text: `Your order ${orderId} has been dispatched!`
    });
}
