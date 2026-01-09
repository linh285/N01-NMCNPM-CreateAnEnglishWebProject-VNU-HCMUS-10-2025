import { Moon, Sun, Bell, Globe, Shield, Volume2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const TeacherSettingsPage = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    const sections = [
        {
            title: "Giao diện & Hiển thị",
            items: [
                {
                    icon: isDarkMode ? <Moon size={20} /> : <Sun size={20} />,
                    label: "Chế độ tối (Dark Mode)",
                    desc: "Chuyển đổi giữa giao diện sáng và tối",
                    action: (
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                        >
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </button>
                    )
                },
                {
                    icon: <Globe size={20} />,
                    label: "Ngôn ngữ",
                    desc: "Tiếng Việt (Mặc định)",
                    action: <span className="text-sm font-bold text-gray-500">Tiếng Việt</span>
                }
            ]
        },
        {
            title: "Thông báo",
            items: [
                {
                    icon: <Bell size={20} />,
                    label: "Thông báo đẩy",
                    desc: "Nhận thông báo khi có học viên nộp bài",
                    action: (
                        <div className="w-12 h-6 rounded-full bg-blue-600 p-1 flex justify-end cursor-pointer">
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                    )
                },
                {
                    icon: <Volume2 size={20} />,
                    label: "Âm thanh",
                    desc: "Phát âm thanh khi có tin nhắn mới",
                    action: (
                        <div className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 p-1 flex justify-start cursor-pointer">
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                    )
                }
            ]
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold flex items-center gap-3">
                <span className="bg-blue-600 w-1.5 h-8 rounded-full"></span>
                Cài đặt hệ thống
            </h1>

            <div className="space-y-6">
                {sections.map((section, idx) => (
                    <div key={idx} className={`rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'}`}>
                        <h3 className="font-bold text-lg mb-4 text-gray-400 uppercase text-xs tracking-wider">{section.title}</h3>
                        <div className="space-y-6">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm md:text-base">{item.label}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    {item.action}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherSettingsPage;