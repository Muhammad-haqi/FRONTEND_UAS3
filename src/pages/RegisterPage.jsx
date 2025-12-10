import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import BASE_URL from '../utils/apiConfig.js'; 

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: "", 
        namaLengkap: "", 
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        
        if (!formData.identifier || !formData.namaLengkap || !formData.password || !formData.confirmPassword) {
            setError("Semua field wajib diisi.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Konfirmasi Password tidak sesuai dengan Password.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password harus minimal 6 karakter.");
            return;
        }

        
        const registrationData = {
            identifier: formData.identifier,
            namaLengkap: formData.namaLengkap,
            password: formData.password,
        };

        setIsLoading(true);
        try {
            
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrationData),
            });

            setIsLoading(false);

            if (res.status === 409) {
                const errorData = await res.json();
                
                throw new Error(errorData.message || "Email atau Nomor HP sudah digunakan!");
            }

            if (!res.ok) {
                
                const errorData = await res.json();
                throw new Error(errorData.message || "Gagal mendaftar. Terjadi kesalahan server.");
            }

            setSuccess("Akun berhasil dibuat! Anda akan dialihkan ke halaman Login.");
            setFormData({ identifier: "", namaLengkap: "", password: "", confirmPassword: "" });
            
            
            setTimeout(() => navigate("/login"), 3000);

        } catch (err) {
            setIsLoading(false);
            setError(err.message);
        }
    };

    return (
        
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat"
            style={{
                background:
                    "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 45%, #fff5b7 100%)", 
            }}
        >
            <div className="bg-white/90 p-8 rounded-xl shadow-2xl w-full max-w-sm backdrop-blur-md border">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 flex items-center justify-center gap-2">
                    <UserPlus size={28} className="text-purple-600"/> Buat Akun Baru
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="namaLengkap">Nama Lengkap</label>
                        <input
                            type="text"
                            id="namaLengkap"
                            name="namaLengkap"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                            value={formData.namaLengkap}
                            onChange={handleChange}
                            placeholder="Masukkan Nama Lengkap Anda"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="identifier">Email atau Nomor HP</label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="contoh@domain.com atau 0812xxxx"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimal 6 karakter"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Konfirmasi Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Ulangi password Anda"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white py-3 rounded-lg font-semibold transition duration-300 
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : (
                            "Daftar Sekarang"
                        )}
                    </button>
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Sudah punya akun?{" "}
                    <span
                        className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition duration-150"
                        onClick={() => navigate("/login")}
                    >
                        Masuk di sini
                    </span>
                </p>
            </div>
        </div>
    );

}
