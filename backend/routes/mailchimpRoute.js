import express from "express";
import axios from "axios";

const mailRouter = express.Router();

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const DATACENTER = MAILCHIMP_API_KEY ? MAILCHIMP_API_KEY.split("-")[1] : null;

mailRouter.post("/subscribe", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Check if Mailchimp is properly configured
  if (!MAILCHIMP_API_KEY || !AUDIENCE_ID || !DATACENTER) {
    return res.status(500).json({
      error:
        "Newsletter service is not properly configured. Please contact support.",
    });
  }

  try {
    const response = await axios.post(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: name || "" },
      },
      {
        auth: {
          username: "anystring",
          password: MAILCHIMP_API_KEY,
        },
      }
    );

    res.status(200).json({ message: "Subscribed!" });
  } catch (err) {
    if (err.response && err.response.data.title === "Member Exists") {
      return res.status(200).json({ message: "Already subscribed." });
    }

    // Handle permanently deleted email
    if (
      err.response?.data?.detail &&
      err.response.data.detail.includes("permanently deleted")
    ) {
      return res.status(400).json({
        error:
          "This email was previously unsubscribed and cannot be re-added automatically. Please contact support to resubscribe.",
      });
    }

    // Handle specific Mailchimp errors
    if (err.response?.status === 401) {
      return res
        .status(500)
        .json({ error: "Newsletter service authentication failed" });
    }

    if (err.response?.status === 404) {
      return res.status(500).json({ error: "Newsletter audience not found" });
    }

    res.status(400).json({
      error:
        err.response?.data?.detail ||
        err.response?.data?.title ||
        "Error subscribing to newsletter",
    });
  }
});

// fetch latest campaigns
mailRouter.get("/latest-promotion", async (req, res) => {
  const { email } = req.query;

  // Check if Mailchimp is properly configured
  if (!MAILCHIMP_API_KEY || !AUDIENCE_ID || !DATACENTER) {
    return res.status(500).json({
      error: "Newsletter service is not properly configured",
    });
  }

  try {
    // First, verify if the user is subscribed to Mailchimp
    if (email) {
      try {
        const memberResponse = await axios.get(
          `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${email}`,
          {
            auth: {
              username: "anystring",
              password: MAILCHIMP_API_KEY,
            },
          }
        );

        // Check if user is subscribed
        if (memberResponse.data.status !== "subscribed") {
          return res.json({ promotion: null });
        }
      } catch (memberErr) {
        // If member not found or not subscribed, don't show promotion
        if (memberErr.response?.status === 404) {
          return res.json({ promotion: null });
        }
        return res.json({ promotion: null });
      }
    }

    // Fetch latest campaign
    const response = await axios.get(
      `https://${DATACENTER}.api.mailchimp.com/3.0/campaigns?status=sent&sort_field=send_time&sort_dir=DESC&count=1`,
      {
        auth: {
          username: "anystring",
          password: MAILCHIMP_API_KEY,
        },
      }
    );

    const campaign = response.data.campaigns[0];
    if (!campaign) {
      return res.json({ promotion: null });
    }

    // Fetch campaign content
    const contentRes = await axios.get(
      `https://${DATACENTER}.api.mailchimp.com/3.0/campaigns/${campaign.id}/content`,
      {
        auth: {
          username: "anystring",
          password: MAILCHIMP_API_KEY,
        },
      }
    );

    res.json({
      promotion: {
        title: campaign.settings.title,
        subject: campaign.settings.subject_line,
        html: contentRes.data.html,
        send_time: campaign.send_time,
      },
    });
  } catch (err) {
    res.status(400).json({
      error: err.response?.data?.detail || "Error fetching promotion",
    });
  }
});

export default mailRouter;
