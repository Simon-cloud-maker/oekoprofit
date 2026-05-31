// Returns which server-side API keys are configured.
// Used by the frontend to hide key input fields that are unnecessary on Vercel.
module.exports = function handler(req, res) {
  res.status(200).json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasOpenrouterKey: !!process.env.OPENROUTER_API_KEY,
  });
};
