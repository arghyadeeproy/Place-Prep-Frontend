// App.jsx — Final version with correct import paths
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }          from "./AuthContext";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

// Auth
import PlacePrepLogin     from "./pages/PlacePrepLogin";

// Dashboard
import PlacePrepDashboard from "./PlacePrepDashboard";

// SkillTest
import SkillTest          from "./pages/SkillTest";
import MCQPage            from "./pages/skillTest/MCQPage";

// Placement Prep
import PlacementPrep      from "./pages/PlacementPrep";
import CompanyDetail      from "./pages/PlacementPrep/CompanyDetail";

// Dev2Dev
import Dev2DevHelp        from "./pages/Dev2DevHelp";

// Study Subjects
import StudySub           from "./pages/StudySub";
import SubjectModules     from "./pages/studySub/SubjectModules";
import ModuleDetail       from "./pages/studySub/ModuleDetails";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — redirects to /dashboard if already logged in */}
          <Route path="/" element={
            <PublicRoute><PlacePrepLogin /></PublicRoute>
          } />

          {/* Protected — redirects to / if not logged in */}
          <Route path="/dashboard" element={
            <ProtectedRoute><PlacePrepDashboard /></ProtectedRoute>
          } />

          <Route path="/skillTest" element={
            <ProtectedRoute><SkillTest /></ProtectedRoute>
          } />
          <Route path="/skillTest/:testId" element={
            <ProtectedRoute><MCQPage /></ProtectedRoute>
          } />

          <Route path="/PlacementPrep" element={
            <ProtectedRoute><PlacementPrep /></ProtectedRoute>
          } />
          <Route path="/PlacementPrep/:companyId" element={
            <ProtectedRoute><CompanyDetail /></ProtectedRoute>
          } />

          <Route path="/Dev2DevHelp" element={
            <ProtectedRoute><Dev2DevHelp /></ProtectedRoute>
          } />

          <Route path="/StudySub" element={
            <ProtectedRoute><StudySub /></ProtectedRoute>
          } />
          <Route path="/StudySub/:subjectId" element={
            <ProtectedRoute><SubjectModules /></ProtectedRoute>
          } />
          <Route path="/StudySub/:subjectId/:moduleId" element={
            <ProtectedRoute><ModuleDetail /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}