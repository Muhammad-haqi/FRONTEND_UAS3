import React, { useState, useEffect } from "react";
import { Menu, X, Search, Bell, LogOut, Shield, Info, HelpCircle } from "lucide-react"; 
import { useLocation, useNavigate, Link } from "react-router-dom"; 

// Dapatkan info pengguna dari localStorage saat komponen dimuat
const getUserInfo = () => {
    const userInfoStr = localStorage.getItem("userInfo");
    const token = localStorage.getItem("userToken");

    if (userInfoStr && token) {
        try {
            const user = JSON.parse(userInfoStr);
            return { 
                ...user,
                isLoggedIn: true,
                isAdmin: user.role && user.role.trim() === 'admin' 
            };
        } catch (e) {
            console.error("Gagal parsing userInfo dari localStorage", e);
            return { isLoggedIn: false, isAdmin: false, namaLengkap: "Pengguna" };
        }
    }
    return { isLoggedIn: false, isAdmin: false, namaLengkap: "Pengguna" };
};

export default function Navbar({ onNav }) { 
    const navigate = useNavigate();
    const location = useLocation();

    
    const [userData, setUserData] = useState(getUserInfo());

    const [open, setOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    
    const [scrollUp, setScrollUp] = useState(true);
    const [lastScroll, setLastScroll] = useState(0);

    
    const adminNavItems = [
        { name: "Dashboard", path: "/admin", icon: Shield },
        { name: "About", path: "/about", icon: Info },
        { name: "Bantuan", path: "/bantuan", icon: HelpCircle },
    ];
    
    
    const userNavItems = [
        { name: "Home", path: "/" },
        { name: "Pesan", path: "/pesan" },
        { name: "Riwayat", path: "/riwayat" },
        { name: "Tentang", path: "/about" },
        { name: "Bantuan", path: "/bantuan" },
    ];


    useEffect(() => {
        setUserData(getUserInfo());

        const handleScroll = () => {
            const curr = window.scrollY;
            if (curr > lastScroll && curr > 80) setScrollUp(false);
            else setScrollUp(true);
            setLastScroll(curr);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScroll, location.pathname]); 

    
    const displayName = userData.namaLengkap || "Pengguna";
    const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

    
    const navBtnClass = (active) =>
        `relative px-2 py-1.5 font-bold text-lg transition-all rounded-xl 
        ${active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
        group`;

    const handleNav = (path) => {
        navigate(path);
        setOpen(false); 
        setShowProfile(false); 
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        setUserData(getUserInfo()); 
        navigate("/login"); 
        window.location.reload(); 
    };
    
    
    const currentNavItems = userData.isAdmin ? adminNavItems : userNavItems;


    return (
        <>
            {/* NAVBAR */}
            <header
                className={`
                    fixed top-0 left-0 right-0 z-50 
                    backdrop-blur-xl border-b border-white/20
                    transition-all duration-300
                    ${scrollUp ? "translate-y-0" : "-translate-y-full"}
                `}
                style={{
                    background:
                        "linear-gradient(to right, rgba(255,255,255,0.6), rgba(255,255,255,0.4))",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
                }}
            >
                
                <nav className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between"> 

                    {/* 1. KELOMPOK KIRI (LOGO) */}
                    <div className="flex items-center space-x-8">
                        <div
                            onClick={() => handleNav("/")}
                            className="cursor-pointer text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent select-none"
                            style={{ animation: "glow 4s ease-in-out infinite alternate" }}
                        >
                            SkyFly ✈
                        </div>
                    </div>


                    {/* 2. KELOMPOK TENGAH (NAVIGASI) */}
                    <div className="hidden md:flex items-center gap-4"> 
                            
                        
                        {currentNavItems.map((item) => (
                            
                            (item.name === 'Riwayat' && !userData.isLoggedIn) ? null : (
                                <div
                                    key={item.name}
                                    className="relative"
                                >
                                    <button
                                        onClick={() => handleNav(item.path)}
                                        className={navBtnClass(location.pathname === item.path)}
                                    >
                                        
                                        {userData.isAdmin && item.icon && <item.icon size={18} className="inline mr-1" />}
                                        {item.name}

                                        <span className="
                                            absolute left-0 -bottom-0.5 w-0 h-[3px] bg-blue-600 rounded-full 
                                            group-hover:w-full transition-all duration-300
                                        "></span>
                                    </button>
                                </div>
                            )
                        ))}
                    </div>

                    {/* 3. KELOMPOK KANAN (PROFILE/LOGIN) */}
                    <div className="flex items-center space-x-3">
                        {userData.isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfile((s) => !s)}
                                    className="
                                        flex items-center gap-2 px-4 py-2
                                        bg-blue-600 hover:bg-blue-700
                                        text-white rounded-full shadow
                                        transition
                                    "
                                >
                                    <div className="
                                        w-7 h-7 bg-white text-blue-600 font-bold rounded-full 
                                        flex items-center justify-center shadow-sm
                                    ">
                                        {avatarLetter} 
                                    </div>
                                    {displayName.split(' ')[0]} 
                                </button>

                                {showProfile && (
                                    <div className="
                                        absolute right-0 mt-2 p-2 w-40 rounded-xl
                                        bg-white shadow-xl border
                                        animate-fadeDown
                                    ">
                                        <div className="px-3 py-2 text-sm text-gray-700 font-medium border-b mb-1">
                                            {displayName}
                                        </div>
                                        {userData.isAdmin && (
                                             <Link to="/admin" className="
                                                w-full text-left px-3 py-2 rounded-lg
                                                text-red-600 font-semibold flex items-center
                                                hover:bg-red-50 transition mb-1
                                            " onClick={() => setShowProfile(false)}>
                                                <Shield size={16} className="mr-2"/> Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="
                                                w-full text-left px-3 py-2 rounded-lg
                                                text-red-600 font-semibold flex items-center
                                                hover:bg-red-50 transition
                                            "
                                        >
                                            <LogOut size={16} className="mr-2"/> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition shadow-md"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
                        onClick={() => setOpen((s) => !s)}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* MOBILE MENU */}
                {open && (
                    <div className="
                        md:hidden px-4 py-4 flex flex-col gap-4 
                        bg-white/90 backdrop-blur-xl
                        border-t animate-fadeDown
                    ">
                        
                        {currentNavItems.map((item) => (
                            (item.name === 'Riwayat' && !userData.isLoggedIn) ? null : (
                                <button
                                    key={item.path}
                                    className={navBtnClass(location.pathname === item.path)}
                                    onClick={() => {
                                        handleNav(item.path);
                                        setOpen(false);
                                    }}
                                >
                                    {userData.isAdmin && item.icon && <item.icon size={16} className="inline mr-1" />}
                                    {item.name}
                                </button>
                            )
                        ))}


                        <hr className="border-gray-300" />
                        
                        {/* Mobile Logout/Login Button */}
                        {userData.isLoggedIn ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setOpen(false);
                                }}
                                className="
                                    px-3 py-2 rounded-xl bg-red-500 text-white font-semibold 
                                    hover:bg-red-600 transition flex items-center justify-center
                                "
                            >
                                <LogOut size={16} className="mr-2"/> Logout ({displayName.split(' ')[0]})
                            </button>
                        ) : (
                             <Link
                                to="/login"
                                className="px-3 py-2 text-center text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition"
                            >
                                Login / Daftar
                            </Link>
                        )}
                        
                    </div>
                )}
            </header>

            {/* FLOATING BUTTON */}
            {userData.isLoggedIn && !userData.isAdmin && (
                <button
                    onClick={() => handleNav("/pesan")}
                    className="
                        fixed bottom-6 right-6 z-50 
                        bg-blue-600 hover:bg-blue-700 text-white  
                        w-14 h-14 rounded-full shadow-xl
                        flex items-center justify-center text-3xl
                        transition
                    "
                >
                    ✈
                </button>
            )}

            <style>{`
                @keyframes glow {
                    from { filter: drop-shadow(0 0 4px rgba(0, 150, 255, 0.4)); }
                    to   { filter: drop-shadow(0 0 10px rgba(0, 150, 255, 0.8)); }
                }

                .animate-fadeDown {
                    animation: fadeDown .25s ease-out;
                }
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}