import { ShieldCheck, Timer, Ticket, Plane, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";



export default function About() {
  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <section className="relative h-[350px] flex items-center justify-center text-white">
        <img
          src="/aboutt.jpg"
          alt="SkyFly"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold z-10 drop-shadow-lg"
        >
          Tentang SkyFly
        </motion.h1>
      </section>

      {/* DESKRIPSI UTAMA */}
      <section className="px-6 lg:px-20 py-12 bg-gradient-to-br from-sky-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto backdrop-blur-xl bg-white/40 p-8 rounded-2xl shadow-lg border border-white/30"
        >
          <h2 className="text-3xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <Plane className="w-8 h-8" />
            Mengapa SkyFly?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            SkyFly hadir sebagai solusi pemesanan tiket pesawat yang modern,
            cepat, dan aman. Kami percaya bahwa perjalanan yang menyenangkan
            dimulai dari proses pemesanan yang mudah. Dengan teknologi terbaru,
            tampilan yang sederhana, serta layanan yang responsif, kami
            memberikan pengalaman terbaik bagi setiap pengguna.
          </p>
        </motion.div>
      </section>

      {/* KEUNGGULAN */}
      <section className="px-6 lg:px-20 pb-14">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">
          Keunggulan SkyFly
        </h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* CARD 1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40"
          >
            <ShieldCheck className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700">
              Keamanan Data Terjamin
            </h3>
            <p className="text-gray-600 mt-2">
              Sistem enkripsi modern memastikan data dan transaksi Anda tetap aman.
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40"
          >
            <Timer className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700">
              Pemesanan Lebih Cepat
            </h3>
            <p className="text-gray-600 mt-2">
              Optimasi sistem membuat proses pencarian tiket sangat cepat.
            </p>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40"
          >
            <Ticket className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700">
              Harga Transparan
            </h3>
            <p className="text-gray-600 mt-2">
              Tidak ada biaya tersembunyi. Semua harga jelas dan jujur.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="bg-white py-14 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
          Perjalanan SkyFly
        </h2>

        <div className="border-l-4 border-blue-400 pl-6 max-w-2xl mx-auto space-y-10">
          {[
            {
              title: "Oktober-2025 — Awal Terbentuk",
              desc: "SkyFly pertama kali dikembangkan sebagai proyek kuliah."
            },
            {
              title: "November-2025 — Peningkatan Fitur",
              desc: "Ditambah fitur Riwayat, Pembayaran, dan Destinasi Pilihan."
            },
            {
              title: "Desember-2025 — Semakin Berkembang",
              desc: "SkyFly menjadi aplikasi pemesanan yang lebih profesional."
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-semibold text-blue-600">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="px-6 lg:px-20 py-16 bg-gradient-to-br from-blue-50 to-sky-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Tim Pengembang
        </h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              role: "Muhammad Haqi",
              
              img: "/haqiii.jpg",
            },
            {
              role: "Syahid Lukman",
              
              img: "/syahid.png",
            },
            {
              role: "Nabilah Putri",
              
              img: "/nabila.jpg",
            },
            {
              role: "Imam Al-Bukhori",
              
              img: "/imam.jpg",
            },
            {
              role: "Jefri Al-Bukhori",
              
              img: "/jefri.jpg",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40 text-center"
            >
              {/* FOTO */}
              <img
                src={item.img}
                alt={item.role}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md border border-white"
              />

              <h3 className="text-xl font-semibold text-blue-700">{item.role}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-700 mb-4"
        >
          Mulai perjalananmu bersama SkyFly ✈️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Nikmati pemesanan tiket yang lebih cepat dan nyaman.
        </motion.p>

        <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.3 }}
>
  <Link
    to="/pesan"
    className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
  >
    Pesan Tiket Sekarang
  </Link>
</motion.div>

      </section>
    </div>
  );
}
