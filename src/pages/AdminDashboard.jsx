import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/apiConfig.js'; 

const getToken = () => localStorage.getItem("userToken") || null;

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

        
        if (!token || userInfo.role !== 'admin') {
            
            alert("Akses Admin ditolak atau sesi berakhir. Silakan login sebagai Admin.");
            localStorage.removeItem("userToken");
            localStorage.removeItem("userInfo");
            navigate("/login");
            return;
        }

        const fetchAllOrders = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const res = await fetch(`${BASE_URL}/api/pesanan/admin/all`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                });

                
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Akses ditolak atau sesi berakhir.");
                }
                
                const data = await res.json();
                
                if (data.success) {
                    setOrders(data.data);
                } else {
                    setError(data.error || "Gagal mengambil data admin.");
                }

            } catch (err) {
                console.error("Fetch Admin Orders Error:", err);
                setError(err.message || "Terjadi kesalahan koneksi.");
                
                if (err.message.includes("Akses ditolak")) {
                     localStorage.removeItem("userToken");
                     localStorage.removeItem("userInfo");
                     navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [navigate]);

    if (loading) {
        return <div className="p-10 text-center">Memuat Data Pesanan Global...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <section className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Dashboard: Semua Pesanan ({orders.length})</h1>
                
                {orders.length === 0 ? (
                    <p className="text-gray-500">Tidak ada pesanan yang ditemukan.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((o) => (
                            <div key={o.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <p className="font-bold text-lg text-blue-600">ID Pesanan: {o.id}</p>
                                <p>Pemesan: {o.namaPemesan} (User ID: {o.userId})</p>
                                <p>Rute: {o.asal} → {o.tujuan} ({o.maskapai})</p>
                                <p>Total: {o.totalFormatted || o.total}</p>
                                <p className={`font-semibold ${o.paid ? 'text-green-600' : 'text-red-600'}`}>
                                    Status: {o.status}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

}
