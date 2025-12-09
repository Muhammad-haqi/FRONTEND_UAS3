import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PesanItem from "../components/PesanItem";
import BASE_URL from '../utils/apiConfig.js'; // ⬅️ PERBAIKAN: Import BASE_URL

const getToken = () => {
    try {
        return localStorage.getItem("userToken") || null;
    } catch (err) {
        return null;
    }
};

export default function PesanPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const orderToEdit = location.state?.editOrder ?? null; 
    const initialData = location.state?.initialData ?? null; 

    const [form, setForm] = useState({
        id: null,
        namaPemesan: "",
        nomorHp: "",
        email: "",
        maskapai: "",
        kelas: "",
        asal: "",
        tujuan: "",
        tanggalBerangkat: "",
        penumpang: 1,
        namaPenumpang: [""],
        kursi: [],
    });

    
    const maskapaiData = [
        { nama: "Lion Air", harga: 800000 },
        { nama: "Sriwijaya Air", harga: 950000 },
        { nama: "Garuda Indonesia", harga: 1500000 },
        { nama: "Pelita Air", harga: 1200000 },
    ];

    const kelasOptions = [
        { label: "Ekonomi", multiplier: 1 },
        { label: "Bisnis", multiplier: 1.8 },
        { label: "First Class", multiplier: 2.5 },
    ];

    const seatRows = 10;
    const seatColumns = ["A", "B", "C", "D", "E", "F"];

    
    useEffect(() => {
        if (orderToEdit) {
            setForm({
                id: orderToEdit.id,
                namaPemesan: orderToEdit.namaPemesan || "",
                nomorHp: orderToEdit.nomorHp || "",
                email: orderToEdit.email || "",
                maskapai: orderToEdit.maskapai || "",
                kelas: orderToEdit.kelas || "",
                asal: orderToEdit.asal || "",
                tujuan: orderToEdit.tujuan || "",
                tanggalBerangkat: orderToEdit.tanggalBerangkat ? orderToEdit.tanggalBerangkat.slice(0, 10) : "", 
                penumpang: Number(orderToEdit.penumpang) || 1, 
                namaPenumpang: orderToEdit.namaPenumpang || [""], 
                kursi: orderToEdit.kursi || [],
            });
        }
    }, [orderToEdit]); 
    
    useEffect(() => {
        if (!orderToEdit && initialData) { 
            setForm((prevForm) => ({
                ...prevForm,
                asal: initialData.asal || prevForm.asal,
                tujuan: initialData.tujuan || prevForm.tujuan,
                maskapai: initialData.maskapai || prevForm.maskapai,
                kelas: initialData.kelas || prevForm.kelas,
            }));
        }
    }, [initialData, orderToEdit]);

    
    function handleChange(e) {
        let { name, value } = e.target;

        if (name === "penumpang") {
            const jumlah = Number(value) || 1;
            let namaArr = [...form.namaPenumpang];

            if (jumlah > namaArr.length) {
                while (namaArr.length < jumlah) namaArr.push("");
            } else {
                namaArr = namaArr.slice(0, jumlah);
            }

            setForm({
                ...form,
                penumpang: jumlah,
                namaPenumpang: namaArr,
                kursi: [],
            });
            return;
        }

        setForm({ ...form, [name]: value });
    }

    function handleNamaPenumpang(i, value) {
        const updated = [...form.namaPenumpang];
        updated[i] = value;
        setForm({ ...form, namaPenumpang: updated });
    }

    function toggleSeat(seat) {
        let selected = [...form.kursi];

        if (selected.includes(seat)) {
            selected = selected.filter((s) => s !== seat);
        } else {
            if (selected.length < form.penumpang) {
                selected.push(seat);
            } else {
                alert("Jumlah kursi sudah sesuai jumlah penumpang!");
                return;
            }
        }

        setForm({ ...form, kursi: selected });
    }

    
    async function handleSubmit(e) {
        e.preventDefault();

        const token = getToken();
        
        if (!token) {
            alert("Silakan login terlebih dahulu untuk melanjutkan.");
            navigate("/login");
            return;
        }

        if (form.kursi.length !== form.penumpang) {
            alert("Jumlah kursi harus sesuai jumlah penumpang!");
            return;
        }

        
        const hargaMaskapai =
            maskapaiData.find((m) => m.nama === form.maskapai)?.harga || 0;
        const kelasMultiplier =
            kelasOptions.find((k) => k.label === form.kelas)?.multiplier || 1;
        const totalHarga = Math.round(
            hargaMaskapai * kelasMultiplier * form.penumpang
        );

        

        const order = {
            namaPemesan: form.namaPemesan,
            nomorHp: form.nomorHp,
            email: form.email,
            maskapai: form.maskapai,
            kelas: form.kelas,
            asal: form.asal,
            tujuan: form.tujuan,
            tanggalBerangkat: form.tanggalBerangkat,
            penumpang: form.penumpang,
            namaPenumpang: form.namaPenumpang,
            kursi: form.kursi,
            total: totalHarga,
            totalFormatted: `IDR ${totalHarga.toLocaleString("id-ID")}`,
            ...(orderToEdit && {
                paid: orderToEdit.paid,
                status: orderToEdit.status,
            }),
            
        };

        const method = orderToEdit ? "PUT" : "POST";
        // ⬅️ PERBAIKAN: Menggunakan BASE_URL untuk PUT dan POST
        const url = orderToEdit
            ? `${BASE_URL}/api/pesanan/${form.id}` // Untuk Edit (PUT)
            : `${BASE_URL}/api/pesanan`;         // Untuk Buat Baru (POST)

        const successMessage = orderToEdit ? "Perubahan pesanan berhasil disimpan!" : "Pemesanan berhasil!";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
                body: JSON.stringify(order),
            });
            
            
            if (res.status === 401) {
                alert("Sesi Anda berakhir atau token tidak valid. Silakan login kembali.");
                localStorage.removeItem("userToken"); 
                localStorage.removeItem("userInfo"); 
                navigate("/login");
                return;
            }

            const result = await res.json();

            if (result.success) {
                alert(successMessage);
                navigate("/riwayat");
            } else {
                alert(`Gagal ${orderToEdit ? "mengubah" : "membuat"} pesanan: ${result.error || result.message || ''}`);
            }
        } catch (err) {
            console.error("Error submit:", err);
            alert("Terjadi kesalahan server");
        }
    }
    
    
    const hargaMaskapai =
        maskapaiData.find((m) => m.nama === form.maskapai)?.harga || 0;
    const kelasMultiplier =
        kelasOptions.find((k) => k.label === form.kelas)?.multiplier || 1;
    const totalHarga = Math.round(
        hargaMaskapai * kelasMultiplier * form.penumpang
    );


    return (
        <section className="min-h-screen bg-[#F5F7FC] py-10">
            <div className="max-w-4xl mx-auto px-4">

                <h2 className="text-4xl font-extrabold text-blue-800 mb-7 tracking-tight drop-shadow-sm">
                    {orderToEdit ? "Edit Pemesanan" : "Form Pemesanan Tiket"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <PesanItem title="Data Pemesan">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" name="namaPemesan" className="input-field"
                                value={form.namaPemesan} onChange={handleChange} placeholder="Nama Pemesan *" required />

                            <input type="tel" name="nomorHp" className="input-field"
                                value={form.nomorHp} onChange={handleChange} placeholder="Nomor HP *" required />

                            <input type="email" name="email" className="input-field md:col-span-2"
                                value={form.email} onChange={handleChange} placeholder="Email Pemesan *" required />
                        </div>
                    </PesanItem>

                    <PesanItem title="Detail Penerbangan">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" name="asal" className="input-field"
                                value={form.asal} onChange={handleChange} placeholder="Asal Penerbangan *" required />

                            <input type="text" name="tujuan" className="input-field"
                                value={form.tujuan} onChange={handleChange} placeholder="Tujuan Penerbangan *" required />

                            <input type="date" name="tanggalBerangkat" className="input-field"
                                value={form.tanggalBerangkat} onChange={handleChange} required />

                            <select name="maskapai" className="input-field"
                                value={form.maskapai} onChange={handleChange} required>
                                <option value="">Pilih Maskapai *</option>
                                {maskapaiData.map((m) => (
                                    <option key={m.nama} value={m.nama}>{m.nama}</option>
                                ))}
                            </select>

                            <select name="kelas" className="input-field"
                                value={form.kelas} onChange={handleChange} required>
                                <option value="">Pilih Kelas *</option>
                                {kelasOptions.map((k) => (
                                    <option key={k.label} value={k.label}>{k.label}</option>
                                ))}
                            </select>

                            <input type="number" min="1" name="penumpang" className="input-field"
                                value={form.penumpang} onChange={handleChange} placeholder="Jumlah Penumpang *" required />
                        </div>
                    </PesanItem>

                    <PesanItem title="Nama-nama Penumpang">
                        {form.namaPenumpang.map((np, i) => (
                            <input
                                key={i}
                                type="text"
                                className="input-field"
                                placeholder={`Penumpang ${i + 1}`}
                                value={np}
                                onChange={(e) => handleNamaPenumpang(i, e.target.value)}
                                required
                            />
                        ))}
                    </PesanItem>

                    <PesanItem title="Pilih Kursi">
                        <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 border rounded-lg shadow-inner">
                            {Array.from({ length: seatRows }).map((_, rowIndex) =>
                                seatColumns.map((col) => {
                                    const seatId = `${rowIndex + 1}${col}`;
                                    const selected = form.kursi.includes(seatId);
                                    return (
                                        <button
                                            type="button"
                                            key={seatId}
                                            className={`seat-btn ${selected ? "active" : ""}`}
                                            onClick={() => toggleSeat(seatId)}
                                        >
                                            {seatId}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </PesanItem>

                    <PesanItem title="Total Pembayaran">
                        <div className="text-3xl font-extrabold text-blue-900 tracking-wide">
                            Rp {totalHarga.toLocaleString("id-ID")}
                        </div>
                    </PesanItem>

                    <button
                        type="submit"
                        className="btn-primary-lg w-full py-3 text-xl rounded-xl"
                    >
                        {orderToEdit ? "Simpan Perubahan" : "Lanjut Bayar"}
                    </button>
                    
                    {orderToEdit && (
                        <button
                            type="button"
                            onClick={() => navigate("/riwayat")}
                            className="btn-secondary-lg w-full py-3 text-xl rounded-xl mt-2"
                        >
                            Batal Edit
                        </button>
                    )}
                </form>

            </div>
        </section>
    );
}