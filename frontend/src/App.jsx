import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/Home.jsx"));
const Create = lazy(() => import("./pages/Create.jsx"));
const Success = lazy(() => import("./pages/Success.jsx"));
const PublicLove = lazy(() => import("./pages/PublicLove.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage.jsx"));

const SiteLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0610' }}>
    <div style={{ width: '45px', height: '45px', border: '3px solid rgba(255, 79, 129, 0.2)', borderTopColor: '#ff4f81', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite' }} />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SiteLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/preview" element={<Navigate to="/create" replace />} />
          <Route path="/success" element={<Success />} />
          <Route path="/love/:slug" element={<PublicLove />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pages/:id" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
