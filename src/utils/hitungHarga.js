export function hitungTotalFromData(maskapai, kelas, jumlah) {
  const prices = {
    "Garuda Indonesia": 1500000,
    "Lion Air": 900000,
    "Citilink": 800000,
    "AirAsia": 850000,
  };
  const multipliers = {
    Ekonomi: 1,
    Bisnis: 1.8,
    "First Class": 2.5,
  };
  const base = prices[maskapai] || 0;
  const mult = multipliers[kelas] || 1;
  const jml = Number(jumlah) || 1;
  return "Rp" + Math.round(base * mult * jml).toLocaleString("id-ID");
}
