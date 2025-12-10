import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUnlockAlt } from "react-icons/fa"; 
import BASE_URL from '../utils/apiConfig.js'; 

export default function AdminLoginPage() {
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
            
            
            const userRole = data.user.role ? data.user.role.trim() : '';

            if (userRole === 'admin') {
                navigate("/admin"); 
            } else {
                
                setErrorMessage("Hanya akun Admin yang diizinkan di sini.");
                localStorage.removeItem("userToken"); 
                localStorage.removeItem("userInfo");
            }

        } catch (err) {
            console.error("Login API error:", err);
            setIsLoading(false);
            
            if (err.message.includes("Failed to fetch")) {
                setErrorMessage("Koneksi ke server gagal.");
            } else {
                setErrorMessage(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section
            className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat"
            
            style={{
                background:
                    "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 45%, #fff5b7 100%)", 
            }}
        >
            <div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-md backdrop-blur-lg border text-center">
                <h1 className="text-3xl font-bold text-red-700 mb-1 flex items-center justify-center gap-2">
                    <FaUnlockAlt size={20} /> Admin Login
                </h1>
                <p className="text-gray-500 text-sm mb-6">Akses khusus Administrator</p>

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
                            placeholder="Email atau Nomor HP Admin"
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
                            placeholder="Masukkan password admin"
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
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                Memproses...
                            </span>
                        ) : "Login Admin"}
                    </button>
                    
                    <div className="text-center pt-4">
                        <span
                            className="text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-800 transition"
                            onClick={() => navigate("/login")}
                        >
                            Kembali ke Login User
                        </span>
                    </div>
                </form>
            </div>
        </section>
    );

}
