import { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const TeacherChatPage = () => {
    const { isDarkMode } = useTheme();
    const [selectedStudent, setSelectedStudent] = useState<number | null>(1);

    // Mock Data
    const students = [
        { id: 1, name: 'Nguyễn Văn A', lastMsg: 'Thầy ơi cho em hỏi bài tập về nhà...', time: '5m', online: true },
        { id: 2, name: 'Trần Thị B', lastMsg: 'Em đã nộp bài rồi ạ.', time: '1h', online: false },
        { id: 3, name: 'Lê Hoàng C', lastMsg: 'Cảm ơn thầy!', time: '2h', online: true },
        { id: 4, name: 'Phạm Minh D', lastMsg: 'Dạ vâng ạ.', time: '1d', online: false },
    ];

    const messages = [
        { id: 1, sender: 'student', text: 'Thầy ơi, em chưa hiểu phần ngữ pháp thì quá khứ đơn ạ.', time: '10:00 AM' },
        { id: 2, sender: 'me', text: 'Chào em, em chưa hiểu cấu trúc hay cách dùng?', time: '10:05 AM' },
        { id: 3, sender: 'student', text: 'Dạ phần cách dùng khi nào thêm ed ấy ạ.', time: '10:06 AM' },
        { id: 4, sender: 'me', text: 'À, đối với động từ có quy tắc, ta thêm ed. Tuy nhiên có vài quy tắc chính tả...', time: '10:10 AM' },
    ];

    return (
        <div className={`h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-sm border flex ${isDarkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'}`}>
            
            {/* Sidebar List */}
            <div className={`w-80 border-r flex flex-col ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
                    <div className={`flex items-center px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-black/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <Search size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm học viên..."
                            className="bg-transparent outline-none text-sm w-full"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            onClick={() => setSelectedStudent(student.id)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${selectedStudent === student.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                {student.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1E293B]"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm truncate">{student.name}</h4>
                                    <span className="text-xs text-gray-400">{student.time}</span>
                                </div>
                                <p className={`text-xs truncate ${selectedStudent === student.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                                    {student.lastMsg}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedStudent ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {students.find(s => s.id === selectedStudent)?.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold">{students.find(s => s.id === selectedStudent)?.name}</h3>
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"><Video size={20} /></button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"><Info size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                                        msg.sender === 'me' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm'
                                    }`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    className={`flex-1 px-4 py-3 rounded-xl border outline-none focus:border-blue-500 ${isDarkMode ? 'bg-black/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                                />
                                <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Search size={40} />
                        </div>
                        <p>Chọn một cuộc hội thoại để bắt đầu</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherChatPage;