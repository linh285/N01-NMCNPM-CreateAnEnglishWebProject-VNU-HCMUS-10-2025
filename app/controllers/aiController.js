const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCC0dUvVULHGTKe9tFIiyyfykabtDsqRTo",
});

const MODEL = "gemini-flash-lite-latest";

const SYSTEM_PROMPT = `
Bạn là một gia sư tiếng Anh trên website học tập.

Người học: Bạn hãy hỏi trình độ tiếng anh của họ trước
Quy tắc:
- Giải thích ngữ pháp, từ vựng bằng tiếng Việt, đơn giản và dễ hiểu
- Sửa lỗi ngữ pháp của học viên
- Đưa ví dụ minh họa
- Thỉnh thoảng đặt một câu hỏi nhỏ
- Hãy thân thiện và khích lệ

Khả năng:
- Giải thích ngữ pháp
- Giải thích từ vựng
- Thực hành hội thoại
- Bài tập nhỏ
`;

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    const finalPrompt = `
${SYSTEM_PROMPT}

User message:
${message}

Assistant:
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ text: finalPrompt }]
    });

    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text || 
      "No response";

    res.json({
      success: true,
      reply: reply
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Gemini API error" });
  }
};
