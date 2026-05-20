import OpenAI from "openai";
import ChatMessage from "../../models/ChatMessage.js";

const systemPrompt = `You are RideBridge Assist, a concise support chatbot for an AI-powered peer-to-peer vehicle rental and delivery platform. Help with bookings, delivery tracking, OTP handover, payments, owner listings, rider tasks, safety, and rental policies. Never ask for passwords or payment card numbers.`;

export async function askRentalAssistant(user, message) {
  if (!message || message.trim().length < 2) {
    return "Please share a little more detail so I can help with your rental, delivery, payment, or listing question.";
  }

  await ChatMessage.create({ user: user._id, role: "user", content: message });

  if (!process.env.OPENAI_API_KEY) {
    const fallback =
      "AI chatbot is not configured yet. Add OPENAI_API_KEY to the server environment. For now, you can browse vehicles, create bookings, track deliveries, and use OTP handover from the dashboard.";
    await ChatMessage.create({ user: user._id, role: "assistant", content: fallback, metadata: { fallback: true } });
    return fallback;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `User role: ${user.role}. User name: ${user.name}. Question: ${message}`
      }
    ],
    temperature: 0.4,
    max_tokens: 280
  });

  const answer = completion.choices[0]?.message?.content?.trim() || "I could not generate an answer right now.";
  await ChatMessage.create({ user: user._id, role: "assistant", content: answer });
  return answer;
}
