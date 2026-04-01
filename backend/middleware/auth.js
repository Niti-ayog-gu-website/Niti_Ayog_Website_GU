const verifyWebhookSecret = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey || apiKey !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or missing API key',
      });
    }
  
    next();
  };
  
  module.exports = { verifyWebhookSecret };