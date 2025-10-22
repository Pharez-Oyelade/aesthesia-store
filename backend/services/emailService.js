import { Resend } from "resend";

function isEmailNotificationsEnabled() {
  return process.env.EMAIL_NOTIFICATIONS_ENABLED === "true";
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL;

// --- ORDER CONFIRMATION ---
export async function sendOrderConfirmationEmail({ to, order }) {
  if (!isEmailNotificationsEnabled()) return;
  const subject = `Order Confirmation #${order._id}`;
  const html = orderConfirmationTemplate(order);
  return sendEmail({ to, subject, html });
}

// --- ORDER STATUS UPDATE ---
export async function sendOrderStatusEmail({ to, orderId, newStatus }) {
  if (!isEmailNotificationsEnabled()) return;
  const subject = `Your Order #${orderId} Status Has Been Updated`;
  const html = orderStatusTemplate(orderId, newStatus);
  return sendEmail({ to, subject, html });
}

async function sendEmail({ to, subject, html }) {
  //   if (!process.env.RESEND_API_KEY || !FROM_EMAIL) {
  //     throw new Error(
  //       "Email not configured (RESEND_API_KEY or FROM_EMAIL missing)."
  //     );
  //   }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) throw error;
  return true;
}

// --- EMAIL TEMPLATES ---
function orderConfirmationTemplate(order) {
  const itemsList = (order.items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding: 8px 0;">${it.name || it.title}</td>
        <td style="padding: 8px 0; text-align:center;">${it.quantity || 1}</td>
        <td style="padding: 8px 0; text-align:right;">${
          it.price ? `₦${it.price}` : ""
        }</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial, sans-serif; background-color:#f8f9fa; padding:20px;">
    <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
      <tr>
        <td style="background-color:#111827; color:white; padding:20px 30px;">
          <h2 style="margin:0;">Thank You for Your Order!</h2>
          <p style="margin:4px 0 0;">Order #${order._id}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <p>Hi there,</p>
          <p>Your order has been successfully placed. Below are your order details:</p>

          <h3 style="margin-top:30px;">Order Summary</h3>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid #ddd;">
                <th style="text-align:left;">Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>

          <p style="margin-top:20px; font-size:16px;">
            <strong>Total:</strong> ₦${order.amount}
          </p>

          <h3 style="margin-top:30px;">Shipping Details</h3>
          <pre style="background:#f1f1f1; padding:10px; border-radius:6px; font-size:14px;">
${safeJson(order.address)}
          </pre>

          <p style="margin-top:30px;">We'll send another email once your order is shipped.</p>
        <p style="margin-top:40px;">Cheers,<br><strong>Aesthesia Haven Team</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background:#f3f4f6; text-align:center; padding:15px; font-size:12px; color:#555;">
          © ${new Date().getFullYear()} Aesthesia Haven — All rights reserved.
        </td>
      </tr>
    </table>
  </div>
  `;
}

function orderStatusTemplate(orderId, newStatus) {
  return `
  <div style="font-family:Arial, sans-serif; background-color:#f8f9fa; padding:20px;">
    <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
      <tr>
        <td style="background-color:#111827; color:white; padding:20px 30px;">
          <h2 style="margin:0;">Order Update</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <p>Hi there,</p>
          <p>Your order <strong>#${orderId}</strong> has been updated.</p>
          <p>The new status is:</p>
          <div style="background:#e0f2fe; color:#0369a1; padding:10px 15px; border-radius:5px; display:inline-block;">
            <strong>${newStatus}</strong>
          </div>

          <p style="margin-top:30px;">You can view your order status on your account dashboard.</p>
          <p style="margin-top:40px;">Best regards,<br><strong>Aesthesia Haven Team</strong></p>
        </td>
      </tr>
      <tr>
        <td style="background:#f3f4f6; text-align:center; padding:15px; font-size:12px; color:#555;">
          © ${new Date().getFullYear()} Aesthesia Haven — All rights reserved.
        </td>
      </tr>
    </table>
  </div>
  `;
}

function safeJson(obj) {
  try {
    return JSON.stringify(obj || {}, null, 2);
  } catch {
    return "";
  }
}
