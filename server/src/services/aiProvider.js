/**
 * Abstracted AI Provider Interface for SAHAYAK
 * Direct REST integration with Gemini API (when GEMINI_API_KEY is available)
 * with robust local NLP fallback.
 */

const generateLLMResponse = async ({ prompt, systemInstruction, modelName = "gemini-1.5-flash" }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn("⚠️ Gemini REST API call failed. Using internal rule engine fallback:", err.message);
    }
  }

  return null;
};

module.exports = { generateLLMResponse };
