import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Stores from './pages/Stores.jsx'
import Contact from './pages/Contact.jsx'
import Store from './pages/Store.jsx'
import Promotions from './pages/Promotions.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminStoresPage from './pages/admin/AdminStoresPage.jsx'
import AdminStoreFormPage from './pages/admin/AdminStoreFormPage.jsx'
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage.jsx'
import AdminPromotionFormPage from './pages/admin/AdminPromotionFormPage.jsx'
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Wraps all public routes with the shared Navbar and Footer.
// Uses <Outlet /> so React Router renders matched child routes here.
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public routes — wrapped in PublicLayout (Navbar + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/store/:slug" element={<Store />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin routes — no public Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="stores" element={<AdminStoresPage />} />
          <Route path="stores/new" element={<AdminStoreFormPage />} />
          <Route path="stores/:slug/edit" element={<AdminStoreFormPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="promotions/new" element={<AdminPromotionFormPage />} />
          <Route path="promotions/:slug/edit" element={<AdminPromotionFormPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
