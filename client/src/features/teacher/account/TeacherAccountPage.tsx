import { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const TeacherAccountPage = () => {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    
    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '0987654321', // Mock phone if not in user object
    });

    // Password State
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        setLoading(true);
        setStatus({ type: null, message: '' });
        
        try {
            // Update Profile API Call
            await api.put('/users/profile', {
                name: formData.name,
                phone: formData.phone
            });
            setStatus({ type: 'success', message: 'Cập nhật thông tin thành công!' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Lỗi khi cập nhật thông tin.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setStatus({ type: 'error', message: 'Mật khẩu mới không khớp.' });
            return;
        }
        // Add password update logic here (requires backend endpoint)
        setStatus({ type: 'success', message: 'Tính năng đổi mật khẩu đang được phát triển.' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <span className="bg-blue-600 w-1.5 h-8 rounded-full"></span>
                    Quản lý tài khoản
                </h1>
                <p className="text-gray-500 mt-1 ml-4.5">Quản lý thông tin cá nhân và bảo mật</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar */}
                <div className="md:col-span-1">
                    <div className={`rounded-2xl p-6 text-center shadow-sm border ${isDarkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="relative inline-block mb-4 group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/20">
                                <img
                                    src={user?.avatar || "https://ui-avatars.com/api/?name=Teacher+User"}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" />
                            </div>
                        </div>
                        <h2 className="font-bold text-xl mb-1">{user?.name}</h2>
                        <p className="text-sm text-blue-500 font-medium">{user?.role?.toUpperCase()}</p>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="md:col-span-2 space-y-6">
                    {/* Status Notification */}
                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {status.message}
                        </div>
                    )}

                    <div className={`rounded-2xl p-8 shadow-sm border ${isDarkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'}`}>
                        {/* Personal Info Section */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-600">
                                <User size={20} /> Thông tin cá nhân
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium opacity-80">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium opacity-80">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium opacity-80">Email</label>
                                    <div className={`flex items-center px-4 py-3 rounded-xl border opacity-60 cursor-not-allowed ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                        <Mail size={18} className="text-gray-400 mr-3" />
                                        <input type="text" value={user?.email || ''} readOnly className="bg-transparent outline-none w-full cursor-not-allowed" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-8"></div>

                        {/* Security Section */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-600">
                                <Lock size={20} /> Bảo mật
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium opacity-80">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium opacity-80">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            value={passwords.new}
                                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium opacity-80">Nhập lại mật khẩu</label>
                                        <input
                                            type="password"
                                            value={passwords.confirm}
                                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button 
                                        onClick={handleChangePassword}
                                        className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAccountPage;