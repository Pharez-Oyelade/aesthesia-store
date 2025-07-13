import express from "express";
import axios from "axios";

const mailRouter = express.Router();

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const DATACENTER = MAILCHIMP_API_KEY.split("-")[1]; // e.g. 'us21'

mailRouter.post("/subscribe", async (req, res) => {
  const { email, name } = req.body;
  console.log("Mailchimp subscribe request:", { email, name });
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await axios.post(
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
    res
      .status(400)
      .json({ error: err.response?.data?.detail || "Error subscribing" });
    console.error("Mailchimp error:", err.response?.data || err.message);
  }
});

// fetch latest campaigns
mailRouter.get("/latest-promotion", async (req, res) => {
  try {
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
    if (!campaign) return res.json({ promotion: null });

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
