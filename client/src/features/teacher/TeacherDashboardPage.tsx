import { 
    PlusCircle, 
    FileInput, 
    DownloadCloud, 
    Clock, 
    CheckCircle2, 
    MoreVertical, 
    Filter,
    ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
const TeacherDashboardPage = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    // Mock Data for Recent Activity 
    const activities = [
        { id: 1, title: '25 học viên đã nộp bài tập "Unit 1: Introduction"', time: '10 phút trước', type: 'submission' },
        { id: 2, title: 'Lớp "IELTS Foundation" có lịch học mới', time: '1 giờ trước', type: 'schedule' },
        { id: 3, title: 'Bạn đã đăng tải bài giảng "Speaking Tips"', time: '2 giờ trước', type: 'upload' },
        { id: 4, title: 'Hệ thống đã tự động chấm điểm bài kiểm tra #Test05', time: '5 giờ trước', type: 'system' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Trang chủ</h1>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Chào mừng trở lại! Đây là tổng quan hoạt động giảng dạy của bạn.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <Filter size={16} className="mr-2 text-gray-400"/>
                        <select className="bg-transparent outline-none text-sm cursor-pointer pr-2">
                            <option value="all">Tất cả</option>
                            <option value="draft">Bản nháp</option>
                            <option value="published">Đã đăng</option>
                        </select>
                    </div>
                        <button 
                            onClick={() => navigate('/teacher/lessons/create')} // <--- ADD THIS LINE
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <PlusCircle size={18} />
                            Thêm bài học mới
                        </button>
                </div>
            </div>

            {/* 2. CTA Cards Section  */}
            {/* Requirements: 3 cards: Create Assignment/Test, Create Test from Bank, Import Test */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Create Assignment/Test */}
                <div className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative overflow-hidden ${
                    isDarkMode ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-500/50'
                }`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <PlusCircle size={100} />
                    </div>
                    <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                        <PlusCircle size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Tạo bài tập / Đề thi</h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Tạo bài tập mới hoặc đề thi trắc nghiệm cho lớp học.
                    </p>
                    <div className="flex items-center text-blue-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Bắt đầu ngay <ArrowRight size={16} className="ml-1" />
                    </div>
                </div>

                {/* Card 2: Create Test from Bank */}
                <div className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative overflow-hidden ${
                    isDarkMode ? 'bg-white/5 border-white/10 hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-500/50'
                }`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileInput size={100} />
                    </div>
                    <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                        <FileInput size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Tạo đề từ ngân hàng</h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Chọn ngẫu nhiên câu hỏi từ ngân hàng câu hỏi có sẵn.
                    </p>
                    <div className="flex items-center text-purple-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Chọn câu hỏi <ArrowRight size={16} className="ml-1" />
                    </div>
                </div>

                {/* Card 3: Import Test from Repository */}
                <div className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer relative overflow-hidden ${
                    isDarkMode ? 'bg-white/5 border-white/10 hover:border-green-500/50' : 'bg-white border-gray-200 hover:border-green-500/50'
                }`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DownloadCloud size={100} />
                    </div>
                    <div className="bg-green-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                        <DownloadCloud size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Tải đề từ kho</h3>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Sử dụng các mẫu đề thi có sẵn từ kho tài liệu chung.
                    </p>
                    <div className="flex items-center text-green-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Duyệt kho <ArrowRight size={16} className="ml-1" />
                    </div>
                </div>
            </div>

            {/* 3. Recent Activity Block  */}
            <div className={`rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Clock size={20} className="text-blue-500"/>
                        Hoạt động gần đây
                    </h2>
                    <button className="text-sm text-blue-500 hover:underline">Xem tất cả</button>
                </div>
                <div className="p-6">
                    <div className="space-y-6 relative">
                        {/* Vertical line for timeline */}
                        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-white/10"></div>

                        {activities.map((activity) => (
                            <div key={activity.id} className="relative pl-14 group">
                                {/* Timeline Dot */}
                                <div className={`absolute left-4 top-1 w-4 h-4 rounded-full border-2 z-10 box-content ${
                                    isDarkMode ? 'bg-[#0f172a] border-blue-500' : 'bg-white border-blue-500'
                                }`}></div>
                                
                                <div className={`p-4 rounded-xl transition-colors ${
                                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                                }`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-sm md:text-base">{activity.title}</h4>
                                            <span className={`text-xs mt-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {activity.time}
                                            </span>
                                        </div>
                                        <button className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                                            isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                                        }`}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardPage;