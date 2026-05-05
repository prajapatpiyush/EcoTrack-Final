import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── Phase 1 ──────────────────────────────────────────────────────────────────
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// ── Phase 2 ──────────────────────────────────────────────────────────────────
import DashboardPage       from './pages/DashboardPage';
import WasteSubmissionPage from './pages/WasteSubmissionPage';
import WalletPage          from './pages/WalletPage';

// ── Phase 3 ──────────────────────────────────────────────────────────────────
import PickupRequestPage from './pages/PickupRequestPage';
import PickupHistoryPage from './pages/PickupHistoryPage';
import AdminPickupPage   from './pages/AdminPickupPage';

// ── Phase 4 ──────────────────────────────────────────────────────────────────
import AdminDashboardPage   from './pages/AdminDashboardPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import CompanyPickupsPage   from './pages/CompanyPickupsPage';
import AdminRecyclersPage   from './pages/AdminRecyclersPage';
import AdminBatchesPage     from './pages/AdminBatchesPage';

// ── Phase 5: Admin content management ────────────────────────────────────────
import AdminBlogsPage      from './pages/AdminBlogsPage';
import AdminCampaignsPage  from './pages/AdminCampaignsPage';
import AdminEventsPage     from './pages/AdminEventsPage';

// ── Phase 5: Public pages ─────────────────────────────────────────────────────
import PublicHomePage  from './pages/public/PublicHomePage';
import HowItWorksPage  from './pages/public/HowItWorksPage';
import RewardsPage     from './pages/public/RewardsPage';
import BlogsPage       from './pages/public/BlogsPage';
import BlogDetailPage  from './pages/public/BlogDetailPage';
import CampaignsPage   from './pages/public/CampaignsPage';
import EventsPage      from './pages/public/EventsPage';
import AboutPage       from './pages/public/AboutPage';
import ContactPage     from './pages/public/ContactPage';

// ── Phase 5: Auth user pages ──────────────────────────────────────────────────
import UserEventsPage  from './pages/UserEventsPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        {/* Global layout wrapper */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          {/* Page content grows to fill space */}
          <main style={{ flex: 1 }}>
            <Routes>

              {/* ── Public Routes (Phase 5) ── */}
              <Route path="/"            element={<PublicHomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/rewards"     element={<RewardsPage />} />
              <Route path="/blogs"       element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogDetailPage />} />
              <Route path="/campaigns"   element={<CampaignsPage />} />
              <Route path="/events"      element={<EventsPage />} />
              <Route path="/about"       element={<AboutPage />} />
              <Route path="/contact"     element={<ContactPage />} />

              {/* ── Auth Pages (Phase 1) ── */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ── Protected: all authenticated users ── */}
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
              <Route path="/submit-waste" element={
                <ProtectedRoute><WasteSubmissionPage /></ProtectedRoute>
              } />
              <Route path="/wallet" element={
                <ProtectedRoute><WalletPage /></ProtectedRoute>
              } />
              <Route path="/pickup-request" element={
                <ProtectedRoute><PickupRequestPage /></ProtectedRoute>
              } />
              <Route path="/pickup-history" element={
                <ProtectedRoute><PickupHistoryPage /></ProtectedRoute>
              } />
              <Route path="/my-events" element={
                <ProtectedRoute><UserEventsPage /></ProtectedRoute>
              } />

              {/* ── Protected: COMPANY only ── */}
              <Route path="/company/dashboard" element={
                <ProtectedRoute allowedRoles={['COMPANY']}><CompanyDashboardPage /></ProtectedRoute>
              } />
              <Route path="/company/pickups" element={
                <ProtectedRoute allowedRoles={['COMPANY']}><CompanyPickupsPage /></ProtectedRoute>
              } />

              {/* ── Protected: ADMIN only ── */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>
              } />
              <Route path="/admin/pickups" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminPickupPage /></ProtectedRoute>
              } />
              <Route path="/admin/recyclers" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminRecyclersPage /></ProtectedRoute>
              } />
              <Route path="/admin/batches" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminBatchesPage /></ProtectedRoute>
              } />
              <Route path="/admin/blogs" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminBlogsPage /></ProtectedRoute>
              } />
              <Route path="/admin/campaigns" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminCampaignsPage /></ProtectedRoute>
              } />
              <Route path="/admin/events" element={
                <ProtectedRoute allowedRoles={['ADMIN']}><AdminEventsPage /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
