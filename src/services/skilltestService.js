// services/skilltestService.js
import api from "./api";

export async function fetchTopics() {
  const res = await api.get("/skilltest/topics/");
  return res.data.data; // array of { id, label, icon, color }
}

export async function generateTest({ topic, difficulty, count = 10 }) {
  const res = await api.post("/skilltest/generate/", { topic, difficulty, count });
  return res.data.data;
}

export async function submitTest(sessionId, { answers, time_taken_seconds }) {
  // answers = { "0": 2, "1": 0, "3": 1 }  (index → chosen option index)
  const res = await api.post(`/skilltest/submit/${sessionId}/`, {
    answers,
    time_taken_seconds,
  });
  return res.data.data;
}

export async function fetchAttemptHistory() {
  const res = await api.get("/skilltest/attempts/");
  return res.data.data; // last 50 attempts
}

export async function fetchLeaderboard(topic = "", difficulty = "") {
  const params = {};
  if (topic)      params.topic      = topic;
  if (difficulty) params.difficulty = difficulty;
  const res = await api.get("/skilltest/leaderboard/", { params });
  return res.data.data; // top 10 { rank, user_name, score_pct, grade, time_taken }
}