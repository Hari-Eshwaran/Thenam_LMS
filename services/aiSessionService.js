import { AiHistory } from "../models/AiHistory.js";
import { AiSession } from "../models/AiSession.js";

function buildSessionId(studentId, subject) {
  return `ai-${studentId}-${String(subject).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export async function recordAiInteraction({ studentId, subject, question, answer, sources = [], tokensUsed = 0 }) {
  const sessionId = buildSessionId(studentId, subject);
  const now = new Date();

  await AiSession.findOneAndUpdate(
    { session_id: sessionId },
    {
      $setOnInsert: {
        session_id: sessionId,
        student_id: studentId,
        subject,
        title: `${subject} tutoring session`,
      },
      $set: {
        last_message_at: now,
      },
      $inc: { message_count: 1 },
    },
    { upsert: true, new: true },
  );

  await AiHistory.create({
    session_id: sessionId,
    student_id: studentId,
    subject,
    question,
    answer,
    sources,
    tokens_used: tokensUsed,
  });

  return { session_id: sessionId };
}
