import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../utils/apiConfig.js'; // ⬅️ PERBAIKAN: Import BASE_URL

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook, FaTiktok, FaUnlockAlt } from "react-icons/fa"; 

// ⬅️ PERBAIKAN: Hapus variabel lingkungan yang lama
// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        if (!identifier.trim() || !password.trim()) {
            setErrorMessage("Email/Nomor HP dan password harus diisi.");
            setIsLoading(false);
            return;
        }

        try {
            // ⬅️ PERBAIKAN: Mengganti URL lama dengan BASE_URL yang diimpor
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login gagal. Periksa kredensial Anda.");
            }
            
            const data = await response.json();

            
            localStorage.setItem("userToken", data.token); 
            localStorage.setItem("userInfo", JSON.stringify(data.user)); 
            
            if (onLogin) {
                onLogin(data.user);
            }
            
            
            if (data.user.role === 'admin') {
                navigate("/admin"); 
            } else {
                navigate("/"); 
            }

        } catch (err) {
            console.error("Login API error:", err);
            setIsLoading(false);
            
            // ⬅️ PERBAIKAN: Menghapus pesan error localhost yang spesifik
            // if (err.message.includes("Failed to fetch")) {
            //     setErrorMessage("Koneksi ke server gagal. Pastikan server Anda berjalan di port 5000.");
            // } else {
            //     setErrorMessage(err.message);
            // }
            setErrorMessage(err.message || "Terjadi kesalahan saat mencoba login.");
        } finally {
            setIsLoading(false);
        }
    }

    function loginWithGoogle() {
        setErrorMessage("Fitur login Google belum diimplementasikan.");
    }

    // ... (rest of the component JSX) ...
    return (
        <section
            className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat"
            style={{
                background:
                    "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 45%, #fff5b7 100%)",
            }}
        >
            <div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-md backdrop-blur-lg border text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-1">
                    skyfly <span className="text-yellow-400">•</span>
                </h1>
                <p className="text-gray-500 text-sm mb-6">Pemesanan tiket pesawat</p>

                <button
                    onClick={loginWithGoogle}
                    className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl mb-4 hover:bg-gray-50 transition cursor-pointer"
                >
                    <FcGoogle size={22} />
                    <span className="font-medium">Lanjutkan dengan Google</span>
                </button>

                <div className="flex items-center gap-3 my-5">
                    <div className="h-[1px] flex-1 bg-gray-300"></div>
                    <span className="text-gray-500 text-sm">atau</span>
                    <div className="h-[1px] flex-1 bg-gray-300"></div>
                </div>

                {errorMessage && (
                    <div 
                        className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm"
                    >
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 text-left">
                    <div>
                        <input
                            type="text"
                            name="identifier" 
                            className="w-full px-4 py-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Lanjut dengan Email atau Nomor HP"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password" 
                            className="w-full px-4 py-3 border rounded-xl bg-white/70 focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-3 rounded-xl transition ${
                            isLoading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isLoading ? (
                               <span className="flex items-center justify-center">
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Memproses...
                             </span>
                        ) : "Lanjutkan"}
                    </button>

                    
                    <div className="text-center pt-2">
                        <span
                            className="text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-800 transition"
                            onClick={() => navigate("/register")}
                        >
                            Belum punya akun? Daftar di sini
                        </span>
                    </div>
                </form>

                
                <div className="flex items-center gap-3 mt-6 mb-4">
                    <div className="h-[1px] flex-1 bg-gray-300"></div>
                </div>
                <button
                    onClick={() => navigate("/admin/login")}
                    className="w-full py-3 border border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition duration-200 flex items-center justify-center gap-2"
                >
                    <FaUnlockAlt /> Login sebagai Admin
                </button>
                


                <div className="flex justify-center gap-5 text-gray-700 mt-6">
                    
                </div>

                <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                    Dengan log in, kamu menyetujui{" "}
                    <span className="text-blue-600 cursor-pointer">Kebijakan Privasi</span>{" "}
                    dan{" "}
                    <span className="text-blue-600 cursor-pointer">
                        Syarat & Ketentuan
                    </span>{" "}
                    SkyFly.
                </p>
            </div>
        </section>
    );
}