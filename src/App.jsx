import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PesanPage from "./pages/PesanPage";
import RiwayatPage from "./pages/RiwayatPage";
import About from "./pages/About";
import Bantuan from "./pages/Bantuan";
import Refund from "./components/Refund";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';



export default function App() {
  const [user, setUser] = useState(localStorage.getItem("loggedUser") || null);
  const [theme, setTheme] = useState(document.body.classList.contains("dark") ? "dark" : "light");
  const navigate = useNavigate();

  useEffect(() => {
    
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);

  function handleLogin(username) {
    localStorage.setItem("loggedUser", username);
    setUser(username);
    navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("loggedUser");
    setUser(null);
    navigate("/login");
  }

  function toggleTheme() {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <>
      {user && <Navbar onNav={(p) => navigate(p)} onLogout={handleLogout} onToggleTheme={toggleTheme} theme={theme} username={user} />}

      <main className="pt-20">
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/pesan" element={user ? <PesanPage /> : <Navigate to="/login" replace />} />
          <Route path="/riwayat" element={user ? <RiwayatPage /> : <Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-10 p-6 text-gray-800 dark:text-gray-200">
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <div>
      <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Hubungi Kami</div>
      <div>
        Telepon: <a href="tel:081234567890" className="text-blue-600 dark:text-blue-500 hover:underline">0812-3456-7890</a>
      </div>
      <div>
        Email: <a href="mailto:info@skyflypro.com" className="text-blue-600 dark:text-blue-500 hover:underline">info@skyflypro.com</a>
      </div>
    </div>
    <div className="flex flex-col items-center md:items-end">
      <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Media Sosial</div>
      <div className="flex gap-3 text-sm">
        <a href="https://www.instagram.com/haqirsyarzy_/?__pwa=1#" target="_blank" rel="noopener" className="hover:text-pink-500 dark:hover:text-pink-400">Instagram</a>
        <a href="https://facebook.com/skyflypro" target="_blank" rel="noopener" className="hover:text-blue-700 dark:hover:text-blue-400">Facebook</a>
        <a href="https://twitter.com/skyflypro" target="_blank" rel="noopener" className="hover:text-blue-400 dark:hover:text-blue-300">Twitter</a>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">&copy; 2025 SkyFly Pro. All rights reserved.</div>
    </div>
  </div>
</footer>

    </>
  );
}