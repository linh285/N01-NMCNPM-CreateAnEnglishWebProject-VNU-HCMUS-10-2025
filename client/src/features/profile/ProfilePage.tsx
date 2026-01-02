import { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Globe, Save, Camera } from 'lucide-react';

const ProfilePage = () => {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State (Mock)
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');
    const [phone, setPhone] = useState('0987654321');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className={`min-h-screen transition-all duration-500 font-sans ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-800'
            }`}>
            <div className="flex relative">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 md:ml-64 p-6 md:p-10 transition-all duration-300">

                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="bg-cyan-500 w-2 h-8 rounded-full"></span>
                            Quản lý tài khoản
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Left Column: Avatar & Basic Info */}
                            <div className="md:col-span-1">
                                <div className={`rounded-3xl p-6 text-center shadow-lg ${isDarkMode ? 'bg-[#151e32]' : 'bg-white'}`}>
                                    <div className="relative inline-block mb-4 group cursor-pointer">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/30">
                                            <img
                                                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" />
                                        </div>
                                    </div>
                                    <h2 className="font-bold text-xl mb-1">{user?.name}</h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.role.toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Right Column: Edit Form */}
                            <div className="md:col-span-2">
                                <div className={`rounded-3xl p-8 shadow-lg space-y-8 ${isDarkMode ? 'bg-[#151e32]' : 'bg-white'}`}>

                                    {/* Personal Information */}
                                    <section>
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-cyan-500">
                                            <User size={20} /> Thông tin cá nhân
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium opacity-80">Họ và tên</label>
                                                    <div className={`flex items-center px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                        <User size={18} className="text-gray-400 mr-3" />
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={e => setName(e.target.value)}
                                                            className="bg-transparent outline-none w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium opacity-80">Số điện thoại</label>
                                                    <div className={`flex items-center px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                        <Phone size={18} className="text-gray-400 mr-3" />
                                                        <input
                                                            type="text"
                                                            value={phone}
                                                            onChange={e => setPhone(e.target.value)}
                                                            className="bg-transparent outline-none w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium opacity-80">Email (Không thể thay đổi)</label>
                                                <div className={`flex items-center px-4 py-3 rounded-xl border opacity-60 cursor-not-allowed ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                    <Mail size={18} className="text-gray-400 mr-3" />
                                                    <input type="text" value={email} readOnly className="bg-transparent outline-none w-full cursor-not-allowed" />
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="w-full h-px bg-gray-200 dark:bg-white/10"></div>

                                    {/* Security */}
                                    <section>
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-cyan-500">
                                            <Lock size={20} /> Bảo mật
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium opacity-80">Đổi mật khẩu</label>
                                                <div className={`flex items-center px-4 py-3 rounded-xl border mb-3 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                    <Lock size={18} className="text-gray-400 mr-3" />
                                                    <input
                                                        type="password"
                                                        placeholder="Mật khẩu hiện tại"
                                                        value={currentPassword}
                                                        onChange={e => setCurrentPassword(e.target.value)}
                                                        className="bg-transparent outline-none w-full"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className={`flex items-center px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                        <Lock size={18} className="text-transparent mr-3" />
                                                        <input
                                                            type="password"
                                                            placeholder="Mật khẩu mới"
                                                            value={newPassword}
                                                            onChange={e => setNewPassword(e.target.value)}
                                                            className="bg-transparent outline-none w-full"
                                                        />
                                                    </div>
                                                    <div className={`flex items-center px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                                        <Lock size={18} className="text-transparent mr-3" />
                                                        <input
                                                            type="password"
                                                            placeholder="Nhập lại mật khẩu mới"
                                                            value={confirmPassword}
                                                            onChange={e => setConfirmPassword(e.target.value)}
                                                            className="bg-transparent outline-none w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="w-full h-px bg-gray-200 dark:bg-white/10"></div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button className={`px-6 py-3 rounded-xl font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                                            Hủy bỏ
                                        </button>
                                        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                                            <Save size={18} /> Lưu thay đổi
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
