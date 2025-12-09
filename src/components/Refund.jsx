import { useState } from "react";

export default function Refund({ order, onCancel, onSubmit }) {
  const [reason, setReason] = useState("");
  const [kodeBooking, setKodeBooking] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Alasan refund wajib diisi!");
    onSubmit(reason);
  };

  return (
    
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-lg p-6 space-y-4 animate-fadeIn">
        <h3 className="text-xl font-bold text-red-700">Pengajuan Refund</h3>

       <p className="text-sm">Kode Booking:</p>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={2}
          value={kodeBooking}
          onChange={(e) => setKodeBooking(e.target.value)}
          placeholder="Kode Booking..."
        />

        <p className="text-sm">Alasan Refund:</p>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan refund..."
        />

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Ajukan Refund
          </button>
        </div>
      </div>
    </div>
  );
}