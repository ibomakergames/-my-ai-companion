export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: "أنت ليلى، شخصية خيالية ودودة وواقعية. تحدثي باللغة العربية بأسلوب طبيعي ولطيف.",
        input: messages.slice(-20),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي." });
    }

    return res.status(200).json({
      reply: data.output_text || "لم أتمكن من الرد."
    });
  } catch (error) {
    return res.status(500).json({ error: "حدث خطأ في الخادم." });
  }
}
