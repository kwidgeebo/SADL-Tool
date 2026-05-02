import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ProjectPage from "./pages/ProjectPage"
import AnalysePhasePage from "./pages/AnalysePhasePage"
import ApprovalReviewPage from "./pages/ApprovalReviewPage"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
      <Route path="/projects/:id/analyse" element={<ProtectedRoute><AnalysePhasePage /></ProtectedRoute>} />
      <Route path="/approvals/analyse/:projectId" element={<ProtectedRoute><ApprovalReviewPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}