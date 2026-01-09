import { useEffect, useState } from 'react';
import { 
    BookOpen, 
    Users, 
    FileText, 
    HelpCircle, 
    TrendingUp,
    Clock,
    Calendar
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalQuestions: 0,
        totalDocuments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await dashboardService.getTeacherStats();
                if (res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { 
            label: 'Khóa học đang dạy', 
            value: stats.totalCourses, 
            icon: <BookOpen size={24} className="text-blue-600" />,
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        { 
            label: 'Học viên', 
            value: stats.totalStudents, 
            icon: <Users size={24} className="text-green-600" />,
            bg: 'bg-green-100 dark:bg-green-900/30'
        },
        { 
            label: 'Ngân hàng câu hỏi', 
            value: stats.totalQuestions, 
            icon: <HelpCircle size={24} className="text-purple-600" />,
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        { 
            label: 'Tài liệu đã tải', 
            value: stats.totalDocuments, 
            icon: <FileText size={24} className="text-orange-600" />,
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">
                    Xin chào, {user?.name || 'Giảng viên'}! 👋
                </h1>
                <p className="opacity-90">
                    Chào mừng trở lại. Dưới đây là tổng quan tình hình giảng dạy của bạn hôm nay.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div 
                        key={index} 
                        className="bg-white dark:bg-[#1E293B] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                {stat.icon}
                            </div>
                            {loading && <div className="animate-pulse w-8 h-4 bg-gray-200 rounded"></div>}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                {stat.label}
                            </h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                {loading ? '-' : stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section (Placeholder for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Hoạt động gần đây
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                <Clock size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Hệ thống Dashboard đã được cập nhật</p>
                                <p className="text-xs text-gray-500">Dữ liệu hiển thị hiện tại là dữ liệu thực từ hệ thống.</p>
                            </div>
                            <span className="text-xs text-gray-400">Vừa xong</span>
                        </div>
                        {/* More mock activities could go here */}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                        <Calendar size={20} className="text-orange-500" />
                        Lịch dạy sắp tới
                    </h2>
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">Chưa có lịch offline.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardPage;