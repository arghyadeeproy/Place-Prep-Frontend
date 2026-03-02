// services/studyService.js
// Exact endpoints confirmed from api/urls.py:
//   GET  /api/study/<subject_id>/modules/
//   GET  /api/study/<subject_id>/<module_id>/
//   POST /api/study/<module_id>/complete/   body: { lesson_order: <1-indexed int> }

import api from "./api";

/**
 * Fetch all modules for a subject.
 * Response: { success: true, data: [ { id, title, icon, difficulty,
 *   lesson_count, completed_lessons (array), subject_id, ... } ] }
 */
export async function fetchSubjectModules(subjectId) {
  const { data } = await api.get(`/study/${subjectId}/modules/`);
  return Array.isArray(data) ? data : (data.data ?? []);
}

/**
 * Fetch module + AI-generated lessons.
 * Groq generates on first call; subsequent calls return cached Firestore data.
 * Response: { success: true, data: { module: {...}, lessons: [
 *   { title, type, content, order }  ] } }
 */
export async function fetchModuleDetail(subjectId, moduleId) {
  const { data } = await api.get(`/study/${subjectId}/${moduleId}/`);
  return data.data ?? data;  // { module, lessons }
}

/**
 * Mark a lesson complete for the authenticated user.
 * lesson_order is 1-indexed (matches backend "order" field).
 * Response: { success: true, data: { completed_lessons: [1, 2, ...] } }
 */
export async function markLessonComplete(moduleId, lessonOrder) {
  const { data } = await api.post(`/study/${moduleId}/complete/`, {
    lesson_order: lessonOrder,
  });
  return data.data ?? data;
}