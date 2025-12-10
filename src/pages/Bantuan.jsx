import React, { useState } from "react";
import { MessageCircle, Mail, Phone, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Bantuan() {
    const [open, setOpen] = useState(null);

    const toggleFAQ = (index) => {
        setOpen(open === index ? null : index);
    };

    
    const WHATSAPP_NUMBER = "082274367514";
    const EMAIL_ADDRESS = "haqyrasya21@gmail.com";

    const handleWhatsAppChat = () => {
        const message = encodeURIComponent("Halo SkyFly, saya butuh bantuan terkait pemesanan tiket.");
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    };

    const handleEmail = () => {
        const subject = "Permintaan Bantuan Teknis SkyFly";
        window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}`;
    };

    const handlePhone = () => {
        const message = encodeURIComponent("Halo SkyFly, saya hubungi Anda melalui Telepon CS, mohon dibantu.");
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    };

    
    const faqContentVariants = {
        open: { 
            opacity: 1, 
            maxHeight: 500, 
            transition: { duration: 0.5, ease: "easeInOut" } 
        },
        closed: { 
            opacity: 0, 
            maxHeight: 0, 
            transition: { duration: 0.3, ease: "easeInOut" } 
        }
    };


    return (
        <motion.div 
            className="min-h-screen w-full pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >

            <motion.div 
                className="text-center mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h1 className="text-4xl font-extrabold text-blue-600">
                    Bantuan & Dukungan 📞
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                    Kami selalu siap membantu Anda. Temukan jawaban, panduan, dan bantuan langsung kapan pun dengan mudah.
                </p>
            </motion.div>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16 px-4">

                <motion.div
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <MessageCircle className="text-blue-600" size={40} />
                    <h3 className="text-xl font-semibold mt-4 text-gray-800">Live Chat</h3>
                    <p className="text-gray-600 mt-2">
                        Butuh bantuan cepat? CS kami tersedia 24/7 melalui live chat.
                    </p>
                    <button 
                        onClick={handleWhatsAppChat} 
                        className="w-full mt-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        Mulai Chat
                    </button>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Mail className="text-blue-600" size={40} />
                    <h3 className="text-xl font-semibold mt-4 text-gray-800">Email Support</h3>
                    <p className="text-gray-600 mt-2">
                        Kirim pertanyaan atau keluhan Anda, kami akan balas secepatnya.
                    </p>
                    <button 
                        onClick={handleEmail} 
                        className="w-full mt-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        Kirim Email
                    </button>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <Phone className="text-blue-600" size={40} />
                    <h3 className="text-xl font-semibold mt-4 text-gray-800">Telepon CS</h3>
                    <p className="text-gray-600 mt-2">
                        Hubungi kami setiap hari pukul 08.00 – 22.00.
                    </p>
                    <button 
                        onClick={handlePhone} 
                        className="w-full mt-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                        Hubungi Sekarang
                    </button>
                </motion.div>

            </div>

            
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                    <HelpCircle size={28} /> Pertanyaan yang Sering Diajukan
                </h2>

               
                {[
                    { t: "Bagaimana cara memesan tiket?", d: "Anda dapat memilih destinasi, tanggal, lalu klik pesan dan lanjutkan pembayaran." },
                    { t: "Apakah saya bisa refund tiket?", d: "Refund dapat dilakukan sesuai syarat & ketentuan maskapai yang berlaku." },
                    { t: "Bagaimana jika terjadi error saat pembayaran?", d: "Silakan hubungi CS melalui live chat atau email agar kami bantu prosesnya." },
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        className="mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <button
                            onClick={() => toggleFAQ(i)}
                            className="w-full flex justify-between items-center bg-white shadow-md border border-gray-100 px-5 py-4 rounded-xl text-left font-semibold text-gray-800"
                        >
                            {item.t}
                            <span>{open === i ? "▲" : "▼"}</span>
                        </button>

                        <AnimatePresence>
                            {open === i && (
                                <motion.div
                                    className="bg-white border border-gray-200 rounded-xl px-5 py-3 text-gray-700 overflow-hidden"
                                   
                                    variants={faqContentVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                >
                                    {item.d}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                ))}

            </div>

        </motion.div>
    );

}
