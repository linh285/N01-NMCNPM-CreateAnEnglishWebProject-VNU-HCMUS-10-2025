import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Users,
    Settings,
    MessageSquare,
    Shield,
    LogOut,
    Bell,
    Search,
    Menu,
    FolderOpen
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Ensure this path is correct
import { useAuth } from '../context/AuthContext';   // Ensure this path is correct
import logo from '../assets/logo.png';              // Ensure this path is correct

const TeacherLayout = () => {
    const { isDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Menu items specifically for Teacher 
    // Menu: Trang chủ, Bài học, Tài liệu, Lớp, Bài kiểm tra, Quản lý tài khoản, Chat, Cài đặt
    const menuItems = [
        { path: '/teacher', icon: LayoutDashboard, label: 'Trang chủ' },
        { path: '/teacher/courses', icon: BookOpen, label: 'Khóa học' },
        { path: '/teacher/documents', icon: FolderOpen, label: 'Tài liệu' },
        { path: '/teacher/classes', icon: Users, label: 'Lớp' },
        { path: '/teacher/tests', icon: FileText, label: 'Bài kiểm tra' },
        { path: '/teacher/account', icon: Shield, label: 'Quản lý tài khoản' },
        { path: '/teacher/chat', icon: MessageSquare, label: 'Chat' },
        { path: '/teacher/settings', icon: Settings, label: 'Cài đặt' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`min-h-screen flex font-sans ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-800'}`}>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0f172a] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 border-b border-gray-800">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    {isSidebarOpen && <span className="ml-3 font-bold text-lg tracking-wide">ENGLISH HUB</span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center p-3 rounded-xl transition-all ${isActive
                                        ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-white' : ''} />
                                {isSidebarOpen && <span className="ml-3 text-sm font-medium whitespace-nowrap">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="ml-3 text-sm font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main className={`flex-1 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                
                {/* Top Header */}
                <header className={`h-16 sticky top-0 z-40 px-6 flex items-center justify-between backdrop-blur-md shadow-sm ${isDarkMode ? 'bg-[#0B1120]/80 border-b border-white/10' : 'bg-white/80'}`}>
                    
                    {/* Left: Sidebar Toggle & Search */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                            <Menu size={20} />
                        </button>
                        {/* Global Search Input  */}
                        <div className={`hidden md:flex items-center px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-transparent'}`}>
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="bg-transparent outline-none text-sm w-64"
                            />
                        </div>
                    </div>

                    {/* Right: User Profile */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0B1120]"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold">{user?.name || "Giáo viên"}</div>
                                <div className="text-xs text-gray-500 uppercase">Teacher</div>
                            </div>
                            <img
                                src={user?.avatar || "https://ui-avatars.com/api/?name=Teacher+User"}
                                alt="User"
                                className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/10"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content Injection */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;