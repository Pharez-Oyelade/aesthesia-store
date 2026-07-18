import Session from "../models/sessionModel.js";
import orderModel from "../models/orderModel.js";

export const logSession = async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      source,
      medium,
      campaign,
      referrer,
      landingPage,
    } = req.body;

    // server-side dedup (30 mins session check)
    const existingSession = await Session.findOne({
      visitorId,
      startedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) },
    });

    if (existingSession) {
      return res
        .status(200)
        .json({ message: "Session already logged within the last 30 minutes" });
    }

    // create new session
    const newSession = new Session({
      visitorId,
      sessionId,
      source,
      medium,
      campaign,
      referrer,
      landingPage,
    });

    await newSession.save();
    return res.status(201).json({ success: true, message: "Session logged successfully" });
  } catch (error) {
    console.error("Error logging session: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// link a visitor ID to a logged-in user
export const linkSession = async (req, res) => {
  try {
    const { visitorId, userId } = req.body;
    if (!visitorId || !userId) {
      return res.status(400).json({ success: false, message: "Missing visitorId or userId" });
    }

    await Session.updateMany(
      { visitorId, userId: null },
      { $set: { userId } }
    );

    return res.status(200).json({ success: true, message: "Sessions linked successfully" });
  } catch (error) {
    console.error("Error linking sessions: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get conversion detail of a specific order
export const getConversionDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId).lean();

    if (!order?.visitorId) {
      return res
        .status(404)
        .json({ message: "No visitor ID tracked for this order" });
    }

    const sessions = await Session.find({
      visitorId: order.visitorId,
      startedAt: { $lte: new Date(order.date) },
    })
      .sort({ startedAt: 1 })
      .lean();

    if (!sessions || sessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for this visitor ID" });
    }

    const firstSession = sessions[0];
    const converting = sessions[sessions.length - 1];
    const daysToConversion = Math.ceil(
      (new Date(order.date) - new Date(firstSession.startedAt)) /
        (1000 * 60 * 60 * 24),
    );

    return res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        visitorId: order.visitorId,
        firstSession,
        daysToConversion,
        convertingSession: converting,
      },
    });
  } catch (error) {
    console.error("Error fetching conversion detail: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
