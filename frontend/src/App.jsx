import "@/App.css";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetail from "@/pages/PropertyDetail";
import LegalPage from "@/pages/LegalPage";

// The owner area is only downloaded when someone opens /admin.
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const Overview = lazy(() => import("@/pages/admin/Overview"));
const Leads = lazy(() => import("@/pages/admin/Leads"));
const Properties = lazy(() => import("@/pages/admin/Properties"));
const PropertyForm = lazy(() => import("@/pages/admin/PropertyForm"));

// New page -> top. "/#about" style links -> scroll to that section (below the fixed header).
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollManager />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:slug" element={<PropertyDetail />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="leads" element={<Leads />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/:id" element={<PropertyForm />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
