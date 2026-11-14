
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const messages = req.body?.messages;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "صيغة الرسائل غير صحيحة" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY غير موجود في إعدادات Vercel" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: "أنت ليلى، شخصية خيالية ودودة وواقعية. تحدثي بالعربية بأسلوب طبيعي ولطيف.",
        input: messages.slice(-20)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "خطأ من OpenAI"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "لم أتمكن من الرد."
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "حدث خطأ في الخادم"
    });
  }
}
