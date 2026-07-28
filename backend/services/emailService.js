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

// ADMIN NOTIFICATION FOR NEW ORDER
export async function sendNewOrderAdminNotification({ order }) {
  if (!isEmailNotificationsEnabled()) return;

  const raw = process.env.ADMIN_EMAIL_ADDRESS || "";
  if (!raw) {
    // No admin address configured — nothing to do
    console.warn("ADMIN_EMAIL_ADDRESS not set — skipping admin notification");
    return;
  }

  // Normalize recipients: allow comma or semicolon separated lists
  const recipients = raw
    .split(/[;,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Accept either plain emails or "Name <email@example.com>" formats.
  const isValidRecipient = (r) => {
    // if it contains a <...> part, check that inner is an email
    const angleMatch = r.match(/<([^>]+)>/);
    if (angleMatch) {
      const email = angleMatch[1].trim();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r);
  };

  const validRecipients = recipients.filter(isValidRecipient);
  if (validRecipients.length === 0) {
    console.warn(
      "No valid admin email addresses found in ADMIN_EMAIL_ADDRESS — skipping admin notification",
      raw,
    );
    return;
  }

  const subject = `New Order Received #${order._id}`;
  const html = adminOrderConfirmationTemplate(order);

  // sendEmail expects either a single email or an array; pass array to be explicit
  return sendEmail({ to: validRecipients, subject, html });
}

//  --- SEND PASSWORD RESET EMAIL ---
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const subject = "Password Reset Request";
  const html = passwordResetTemplate(resetUrl);
  return sendEmail({ to, subject, html });
}

// --- SEND WAITLIST EMAIL ---
export async function sendWaitlistEmail({
  to,
  code,
  discountValue,
  expiresAt,
}) {
  if (!isEmailNotificationsEnabled()) return;
  const subject = `Your access code for Aesthesia Haven`;
  const html = waitlistEmailTemplate({ code, discountValue, expiresAt });
  return sendEmail({ to, subject, html });
}

// --- SEND PROMO EMAIL ---
export async function sendPromoEmail({
  to,
  code,
  discountValue,
  expiresAt,
}) {
  if (!isEmailNotificationsEnabled()) return;
  const subject = `Your access code for Aesthesia Haven`;
  const html = promoEmailTemplate({ code, discountValue, expiresAt });
  return sendEmail({ to, subject, html });
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY || !FROM_EMAIL) {
    throw new Error(
      "Email not configured (RESEND_API_KEY or FROM_EMAIL missing).",
    );
  }

  const recipients = Array.isArray(to) ? to : [to];

  // Retry transient network errors (DNS failures, timeouts, connection resets)
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: recipients,
        subject,
        html,
      });

      if (error) {
        // Resend SDK returned an error payload
        throw error;
      }

      return true;
    } catch (err) {
      const codeOrMessage = String(err.code || err.message || err);
      const isTransient =
        /Unable to fetch|ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN/i.test(
          codeOrMessage,
        );

      console.error(`sendEmail attempt ${attempt} failed:`, codeOrMessage);

      if (attempt === maxAttempts || !isTransient) {
        // Permanent or exhausted attempts — surface a clearer error
        throw new Error(
          `Failed to send email to ${recipients.join(
            ", ",
          )} after ${attempt} attempt(s): ${codeOrMessage}`,
        );
      }

      // Exponential backoff before retrying
      const backoffMs = 500 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
  // Should not reach here
  throw new Error("Failed to send email: unknown error");
}

// --- EMAIL TEMPLATES ---

function orderConfirmationTemplate(order) {
  const itemsList = (order.items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500; color: #111827; margin-bottom: 4px;">${
            it.name || it.title
          }</div>
          ${
            it.description
              ? `<div style="font-size: 13px; color: #6b7280;">${it.description}</div>`
              : ""
          }
        </td>
        <td style="padding: 12px 8px; text-align:center; border-bottom: 1px solid #e5e7eb; color: #374151;">×${
          it.quantity || 1
        }</td>
        <td style="padding: 12px 8px; text-align:right; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #111827;">
          ${it.price ? `₦${Number(it.price).toLocaleString()}` : ""}
        </td>
      </tr>`,
    )
    .join("");

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Order Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed! 🎉</h1>
                <p style="margin: 12px 0 0; color: #d1d5db; font-size: 16px;">Thank you for your purchase</p>
              </td>
            </tr>

            <!-- Success Message -->
            <tr>
              <td style="padding: 30px 30px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px;">
                      <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.5;">
                        <strong>Order #${
                          order._id
                        }</strong> has been successfully placed and is being processed.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Order Info -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Order Date:</span>
                      <span style="color: #111827; font-size: 14px; font-weight: 500; margin-left: 8px;">${orderDate}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 8px;">
                      <span style="color: #6b7280; font-size: 14px;">Order Status:</span>
                      <span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; margin-left: 8px;">
                        ${order.status || "Processing"}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Order Items -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; font-weight: 600;">Order Summary</h2>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 2px solid #e5e7eb;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px 8px; text-align: left; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
                      <th style="padding: 12px 8px; text-align: center; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                      <th style="padding: 12px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Total -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 2px solid #e5e7eb;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #111827; font-size: 18px; font-weight: 600;">Total Amount</td>
                          <td style="text-align: right; color: #111827; font-size: 24px; font-weight: 700;">
                            ₦${Number(order.amount).toLocaleString()}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shipping Address -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600;">Shipping Address</h2>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                  ${formatAddress(order.address)}
                </div>
              </td>
            </tr>

            <!-- Next Steps -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #eff6ff; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td>
                      <h3 style="margin: 0 0 12px; color: #1e40af; font-size: 16px; font-weight: 600;">📦 What's Next?</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                        <li>We'll prepare your order for shipment</li>
                        <li>You'll receive a shipping confirmation email with tracking details</li>
                        <li>Track your order status in your account dashboard</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Support Section -->
            <tr>
              <td style="padding: 0 30px 40px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #e5e7eb; padding-top: 30px;">
                  <tr>
                    <td style="text-align: center; padding-bottom: 20px;">
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">Need help with your order?</p>
                      <a href="mailto:support@aesthesiahaven.com" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Contact Support</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; color: #111827; font-size: 16px; font-weight: 600;">Aesthesia Haven</p>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px;">Embrace Your Beautiful</p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Aesthesia Haven. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function orderStatusTemplate(orderId, newStatus) {
  const statusConfig = {
    processing: {
      color: "#3b82f6",
      bg: "#dbeafe",
      icon: "⏳",
      message: "Your order is being processed",
    },
    processed: {
      color: "#3b82f6",
      bg: "#dbeafe",
      icon: "📦",
      message: "Your order has been processed",
    },
    shipped: {
      color: "#8b5cf6",
      bg: "#ede9fe",
      icon: "🚚",
      message: "Your order has been shipped",
    },
    delivered: {
      color: "#10b981",
      bg: "#d1fae5",
      icon: "📦✅",
      message: "Your order has been delivered",
    },
    cancelled: {
      color: "#ef4444",
      bg: "#fee2e2",
      icon: "❌",
      message: "Your order has been cancelled",
    },
  };

  const status = statusConfig[newStatus.toLowerCase()] || {
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: "📋",
    message: "Your order status has been updated",
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Order Status Update</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 40px 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">${
                  status.icon
                }</div>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Order Update</h1>
                <p style="margin: 12px 0 0; color: #d1d5db; font-size: 16px;">Status changed for order #${orderId}</p>
              </td>
            </tr>

            <!-- Status Banner -->
            <tr>
              <td style="padding: 30px 30px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="background: ${
                      status.bg
                    }; border-left: 4px solid ${
                      status.color
                    }; padding: 20px; border-radius: 8px; text-align: center;">
                      <p style="margin: 0 0 8px; color: #111827; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">New Status</p>
                      <p style="margin: 0; color: ${
                        status.color
                      }; font-size: 24px; font-weight: 700; text-transform: capitalize;">${newStatus}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">${
                  status.message
                }</p>
                <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                  You can track your order and view all details in your account dashboard.
                </p>
              </td>
            </tr>

            <!-- Order Timeline (if applicable) -->
            ${
              newStatus.toLowerCase() !== "cancelled"
                ? `
            <tr>
              <td style="padding: 0 30px 30px;">
                <h3 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">Order Journey</h3>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="width: 30px; vertical-align: top; padding-top: 4px;">
                      <div style="width: 20px; height: 20px; border-radius: 50%; background: ${
                        newStatus.toLowerCase() === "processing" ||
                        newStatus.toLowerCase() === "shipped" ||
                        newStatus.toLowerCase() === "delivered"
                          ? "#10b981"
                          : "#d1d5db"
                      };"></div>
                    </td>
                    <td style="padding-bottom: 20px;">
                      <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Order Placed</div>
                      <div style="color: #6b7280; font-size: 13px;">Your order has been received</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30px; vertical-align: top; padding-top: 4px;">
                      <div style="width: 20px; height: 20px; border-radius: 50%; background: ${
                        newStatus.toLowerCase() === "shipped" ||
                        newStatus.toLowerCase() === "delivered"
                          ? "#10b981"
                          : "#d1d5db"
                      };"></div>
                    </td>
                    <td style="padding-bottom: 20px;">
                      <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Shipped</div>
                      <div style="color: #6b7280; font-size: 13px;">Your order is on its way</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30px; vertical-align: top; padding-top: 4px;">
                      <div style="width: 20px; height: 20px; border-radius: 50%; background: ${
                        newStatus.toLowerCase() === "delivered"
                          ? "#10b981"
                          : "#d1d5db"
                      };"></div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Delivered</div>
                      <div style="color: #6b7280; font-size: 13px;">Enjoy your purchase!</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            `
                : ""
            }

            <!-- CTA Button -->
            <tr>
              <td style="padding: 0 30px 40px; text-align: center;">
                <a href="${
                  process.env.FRONTEND_URL
                }/orders" style="display: inline-block; background: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">View Order Details</a>
              </td>
            </tr>

            <!-- Support -->
            <tr>
              <td style="padding: 0 30px 40px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td style="text-align: center;">
                      <p style="margin: 0 0 12px; color: #374151; font-size: 14px;">Questions about your order?</p>
                      <a href="mailto:support@order.aesthesiahaven.com" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;">Contact Support →</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; color: #111827; font-size: 16px; font-weight: 600;">Aesthesia Haven</p>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px;">Curating beauty, delivering excellence</p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Aesthesia Haven. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function adminOrderConfirmationTemplate(order) {
  const itemsList = (order.items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500; color: #111827;">${
            it.name || it.title
          }</div>
          ${
            it.sku
              ? `<div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">SKU: ${it.sku}</div>`
              : ""
          }
        </td>
        <td style="padding: 12px 8px; text-align:center; border-bottom: 1px solid #e5e7eb; color: #374151;">×${
          it.quantity || 1
        }</td>
        <td style="padding: 12px 8px; text-align:right; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #111827;">
          ₦${it.price ? Number(it.price).toLocaleString() : "0"}
        </td>
      </tr>`,
    )
    .join("");

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>New Order Notification</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 650px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
                <div style="font-size: 42px; margin-bottom: 10px;">🔔</div>
                <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">New Order Received!</h1>
                <p style="margin: 10px 0 0; color: #fecaca; font-size: 15px;">Order #${
                  order._id
                }</p>
              </td>
            </tr>

            <!-- Alert Banner -->
            <tr>
              <td style="padding: 25px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px;">
                      <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                        ⚡ ACTION REQUIRED: New order needs processing
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Order Quick Info -->
            <tr>
              <td style="padding: 0 30px 25px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td style="width: 50%; padding-bottom: 12px;">
                      <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Order Date</div>
                      <div style="color: #111827; font-size: 14px; font-weight: 600;">${orderDate}</div>
                    </td>
                    <td style="width: 50%; padding-bottom: 12px; text-align: right;">
                      <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Total Amount</div>
                      <div style="color: #111827; font-size: 18px; font-weight: 700;">₦${Number(
                        order.amount,
                      ).toLocaleString()}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px; border-top: 1px solid #e5e7eb;">
                      <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Payment Method</div>
                      <div style="color: #111827; font-size: 14px; font-weight: 600;">${
                        order.paymentMethod || "Online"
                      }</div>
                    </td>
                    <td style="padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: right;">
                      <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Status</div>
                      <span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Customer Info -->
            <tr>
              <td style="padding: 0 30px 25px;">
                <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">Customer Information</h2>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <strong style="color: #111827; font-size: 14px;">Name:</strong>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">${
                        order.address.firstName || "N/A"
                      }</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <strong style="color: #111827; font-size: 14px;">Email:</strong>
                      <a href="mailto:${
                        order.customerEmail || order.user?.email
                      }" style="color: #3b82f6; text-decoration: none; margin-left: 8px; font-size: 14px;">${
                        order.address.email || order.user?.email || "N/A"
                      }</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong style="color: #111827; font-size: 14px;">Phone:</strong>
                      <span style="color: #374151; font-size: 14px; margin-left: 8px;">${
                        order.address.phone || "N/A"
                      }</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Order Items -->
            <tr>
              <td style="padding: 0 30px 25px;">
                <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">Order Items (${
                  order.items?.length || 0
                })</h2>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb;">Product</th>
                      <th style="padding: 12px 8px; text-align: center; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb;">Qty</th>
                      <th style="padding: 12px 8px; text-align: right; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding: 16px 8px; text-align: right; font-weight: 600; color: #111827; font-size: 15px; border-top: 2px solid #e5e7eb;">Total:</td>
                      <td style="padding: 16px 8px; text-align: right; font-weight: 700; color: #111827; font-size: 18px; border-top: 2px solid #e5e7eb;">₦${Number(
                        order.amount,
                      ).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <!-- Shipping Address -->
            <tr>
              <td style="padding: 0 30px 25px;">
                <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">Shipping Address</h2>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.8;">
                  ${formatAddress(order.address)}
                </div>
              </td>
            </tr>

            <!-- Action Required -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td>
                      <h3 style="margin: 0 0 12px; color: #991b1b; font-size: 16px; font-weight: 600;">⚠️ Next Steps</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                        <li>Review order details for accuracy</li>
                        <li>Process payment if not completed</li>
                        <li>Prepare items for shipment</li>
                        <li>Update order status in admin panel</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Admin CTA -->
            <tr>
              <td style="padding: 0 30px 40px; text-align: center;">
                <a href="${
                  process.env.ADMIN_URL
                }/orders" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin-right: 10px;">Process Order</a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; color: #111827; font-size: 15px; font-weight: 600;">Aesthesia Haven Admin</p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  This is an automated notification sent to administrators only.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function passwordResetTemplate(resetUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Password Reset Request</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 40px 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">🔒</div>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
                <p style="margin: 12px 0 0; color: #d1d5db; font-size: 16px;">Secure your account</p>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                  We received a request to reset the password for your Aesthesia Haven account. Click the button below to create a new password.
                </p>

                <!-- CTA Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="text-align: center; padding: 30px 0;">
                      <a href="${resetUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        Reset Your Password
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="margin: 12px 0 0; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; word-break: break-all; font-size: 13px; color: #3b82f6; text-align: center;">
                  ${resetUrl}
                </p>
              </td>
            </tr>

            <!-- Security Notice -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 12px; color: #92400e; font-size: 14px; font-weight: 600;">⚠️ Important Security Information</p>
                      <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; line-height: 1.7;">
                        <li>This link will expire in <strong>1 hour</strong> for security reasons</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Your password will remain unchanged unless you click the link</li>
                        <li>Never share this link with anyone</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Didn't Request Section -->
            <tr>
              <td style="padding: 0 30px 40px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 20px; text-align: center;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 12px; color: #111827; font-size: 15px; font-weight: 600;">Didn't request a password reset?</p>
                      <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If you didn't make this request, your account may be at risk. Please contact our support team immediately.
                      </p>
                      <a href="mailto:support@aesthesiahaven.com" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px;">Contact Support</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Tips Section -->
            <tr>
              <td style="padding: 0 30px 40px;">
                <h3 style="margin: 0 0 16px; color: #111827; font-size: 16px; font-weight: 600; text-align: center;">🛡️ Password Security Tips</h3>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="color: #374151; font-size: 13px; line-height: 1.6;">
                        ✓ Use at least 8 characters with mixed case, numbers, and symbols
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="color: #374151; font-size: 13px; line-height: 1.6;">
                        ✓ Avoid using personal information or common words
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="color: #374151; font-size: 13px; line-height: 1.6;">
                        ✓ Use a unique password for each online account
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="color: #374151; font-size: 13px; line-height: 1.6;">
                        ✓ Consider using a password manager for added security
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; color: #111827; font-size: 16px; font-weight: 600;">Aesthesia Haven</p>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px;">Curating beauty, delivering excellence</p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Aesthesia Haven. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function waitlistEmailTemplate({ code, discountValue, expiresAt }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi there,</p>
    <p>Thank you for joining the Aesthesia Haven waitlist. Here is your access code:</p>
    <p style="font-size: 18px; font-weight: bold; padding: 10px 0;">${code}</p>
    <p>You can use this code at checkout. It is valid until ${formatExpiry(expiresAt)}.</p>
    <br>
    <p>Best regards,<br>Aesthesia Haven Team</p>
  </body>
  </html>
  `;
}

function promoEmailTemplate({ code, discountValue, expiresAt }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi there,</p>
    <p>You have been granted exclusive access. Here is your personal code for Aesthesia Haven:</p>
    <p style="font-size: 18px; font-weight: bold; padding: 10px 0;">${code}</p>
    <p>Benefits included with this code:</p>
    <ul style="padding-left: 20px; margin-top: 5px;">
      <li>Complimentary Doorstep Nationwide Delivery</li>
      <li>First Production Batch</li>
      <li>Priority Access Before Public Launch</li>
    </ul>
    <p>You can apply this code at checkout. It is valid until ${formatExpiry(expiresAt)}.</p>
    <br>
    <p>Best regards,<br>Aesthesia Haven Team</p>
  </body>
  </html>
  `;
}

// Helper function to format address
function formatAddress(address) {
  if (!address)
    return '<p style="margin: 0; color: #6b7280;">No address provided</p>';

  if (typeof address === "string") {
    return `<p style="margin: 0; white-space: pre-wrap;">${address}</p>`;
  }

  // If address is an object
  const parts = [];
  if (address.name) parts.push(`<strong>${address.name}</strong>`);
  if (address.street || address.address1)
    parts.push(address.street || address.address1);
  if (address.address2) parts.push(address.address2);

  const cityStateParts = [];
  if (address.city) cityStateParts.push(address.city);
  if (address.state) cityStateParts.push(address.state);
  if (cityStateParts.length > 0) parts.push(cityStateParts.join(", "));

  if (address.postalCode || address.zipCode)
    parts.push(address.postalCode || address.zipCode);
  if (address.country) parts.push(address.country);
  if (address.phone) parts.push(`📞 ${address.phone}`);

  return parts.length > 0
    ? parts
        .map((part) => `<div style="margin-bottom: 4px;">${part}</div>`)
        .join("")
    : '<p style="margin: 0; color: #6b7280;">No address details available</p>';
}

function safeJson(obj) {
  try {
    return JSON.stringify(obj || {}, null, 2);
  } catch {
    return "";
  }
}

function formatExpiry(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
