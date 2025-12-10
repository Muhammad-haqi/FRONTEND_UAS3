import { useEffect, useState } from "react";
import RiwayatItem from "../components/RiwayatItem";
import { useNavigate } from "react-router-dom";
import Refund from "../components/Refund";
import BASE_URL from '../utils/apiConfig.js'; 


const getToken = () => {
    try {
        return localStorage.getItem("userToken") || null;
    } catch (err) {
        return null;
    }
};

export default function RiwayatPage() {
    const [orders, setOrders] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");

    const [showRefundModal, setShowRefundModal] = useState(false);

    const getUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (user?.id) return user.id;
        } catch {}

        return null;
    };
    const userId = getUserId(); 

    
    useEffect(() => {
        const token = getToken();

        
        if (!token) { 
            alert("Silakan login dahulu.");
            navigate("/login");
            return;
        }

        
        fetch(`${BASE_URL}/api/pesanan/riwayat`, { 
            method: 'GET',
            headers: {
                
                "Authorization": `Bearer ${token}` 
            }
        })
        .then(async (res) => {
            
            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken"); 
                localStorage.removeItem("userInfo"); 
                navigate("/login");
                return { success: false, data: [] }; 
            }

            return res.json();
        })
        .then((data) => {
            setOrders(data.data || []);
        })
        .catch((err) => console.error("Error fetch orders:", err));
    }, [refreshKey, navigate]); 

    const refresh = () => setRefreshKey((k) => k + 1);

    

    const handlePay = (order) => {
        setSelectedOrder(order);
        setPaymentMethod("");
        setShowPayModal(true);
    };

    const confirmPayment = async () => {
        if (!paymentMethod)
            return alert("Pilih metode pembayaran dahulu!");

        const token = getToken(); 
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            navigate("/login");
            return;
        }

        const payload = { ...selectedOrder };
        delete payload.id;
        delete payload.totalFormatted;
        delete payload.tanggalOrder;
        delete payload.refunded;
        delete payload.paymentMethod;

        payload.paid = true;
        payload.status = "Sudah dibayar";

        try {
            const res = await fetch(`${BASE_URL}/api/pesanan/${selectedOrder.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return;
            }
            
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Gagal mengkonfirmasi pembayaran.");
            return;
        }

        setShowPayModal(false);
        refresh();
        alert("Pembayaran berhasil.");
    };

    

    const handleEdit = (order) => {
        navigate("/pesan", { state: { editOrder: order } });
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

        const token = getToken(); 
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/pesanan/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return;
            }
            
        } catch (error) {
            console.error("Error deleting order:", error);
        }

        refresh();
    };

    const handleRefund = (order) => {
        setSelectedOrder(order);
        setShowRefundModal(true);
    };

    const confirmRefund = async (reason) => {
        const token = getToken(); 
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            navigate("/login");
            return;
        }

        const payload = { ...selectedOrder };

        delete payload.id;
        delete payload.totalFormatted;
        delete payload.tanggalOrder;
        delete payload.paymentMethod;
        delete payload.refunded;
        delete payload.refundReason;

        payload.status = "Refund Berhasil";
        payload.paid = false;

        try {
            const res = await fetch(`${BASE_URL}/api/pesanan/${selectedOrder.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return;
            }

        } catch (error) {
            console.error("Error confirming refund:", error);
            alert("Gagal mengkonfirmasi refund.");
            return;
        }

        setShowRefundModal(false);
        refresh();
        alert("Refund berhasil.");
    };

    

    if (!orders || orders.length === 0) {
        return (
            <section className="min-h-screen py-20 text-center text-gray-600">
                <p>Belum ada pemesanan.</p>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#F5F7FC] py-14">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold mb-5 text-blue-800">
                    Riwayat Pemesanan Tiket
                </h2>

                {orders.map((o) => (
                    <RiwayatItem
                        key={o.id}
                        o={o}
                        onEdit={() => handleEdit(o)}
                        onDelete={handleDelete}
                        onPay={() => handlePay(o)}
                        onRefund={() => handleRefund(o)}
                    />
                ))}
            </div>

            {showPayModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[420px] rounded-xl shadow-lg p-6 space-y-4">
                        <h3 className="text-xl font-bold text-blue-700">
                            Pembayaran Tiket
                        </h3>
                        <p className="text-sm text-gray-600">
                            Total Pembayaran:{" "}
                            <span className="font-semibold text-green-700">
                                {selectedOrder.total}
                            </span>
                        </p>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Pilih Metode Pembayaran:</p>

                            <select
                                className="w-full border rounded-lg p-2"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">-- Pilih --</option>

                                <optgroup label="Bank Transfer">
                                    <option value="BCA">BCA</option>
                                    <option value="BRI">BRI</option>
                                    <option value="BNI">BNI</option>
                                    <option value="Mandiri">Mandiri</option>
                                </optgroup>

                                <optgroup label="E-Wallet">
                                    <option value="GoPay">GoPay</option>
                                    <option value="Dana">Dana</option>
                                    <option value="OVO">OVO</option>
                                    <option value="ShopeePay">ShopeePay</option>
                                </optgroup>

                                <optgroup label="QRIS">
                                    <option value="QRIS">QRIS</option>
                                </optgroup>
                            </select>
                        </div>

                        {paymentMethod && (
                            <div className="p-4 bg-gray-100 rounded-lg border mt-3">
                                <p className="font-medium text-sm mb-2">
                                    Informasi Pembayaran:
                                </p>

                                {paymentMethod === "QRIS" && (
                                    <div className="text-center">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SIMULASI-QRIS"
                                            className="w-48 mx-auto rounded-lg shadow-md"
                                        />
                                        <p className="text-xs mt-2 text-gray-600">
                                            Scan QRIS untuk melakukan pembayaran.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowPayModal(false)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                Batal
                            </button>

                            <button
                                onClick={confirmPayment}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRefundModal && selectedOrder && (
                <Refund
                    order={selectedOrder}
                    onCancel={() => setShowRefundModal(false)}
                    onSubmit={(reason) => confirmRefund(reason)}
                />
            )}
        </section>
    );

}
