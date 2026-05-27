import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// PIPELINE
export const runPipeline = async () => {
  const res = await api.post("/run-pipeline");
  return res.data;
};

// ANALYTICS
export const fetchAnalytics = async () => {
  const res = await api.get("/analytics");
  return res.data;
};

// TREND
export const fetchTrends = async () => {
  const res = await api.get("/analytics/trends");
  return res.data;
};

// TOPICS
export const fetchTopics = async () => {
  const res = await api.get("/analytics/topics");
  return res.data;
};

// KEYWORDS
export const fetchKeywords = async () => {
  const res = await api.get("/analytics/keywords");
  return res.data;
};