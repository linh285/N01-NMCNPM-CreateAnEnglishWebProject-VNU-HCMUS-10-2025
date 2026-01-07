import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useTheme } from '../../context/ThemeContext';
// import { MOCK_DOCUMENTS } from '../../data/mockData';
import { ArrowLeft, Clock, Share2, User, PlayCircle, BookOpen, FileText, CheckCircle, Download } from 'lucide-react';
import { courseService } from '../../services/course.service';

const DocumentDetailPage = () => {
    const { id } = useParams();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [doc, setDoc] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Fetch real course
                const data = await courseService.getCourseById(id);
                // Map fields if needed
                setDoc({
                    ...data,
                    // Ensure fields exist for UI
                    image: data.thumbnail || data.image || 'https://via.placeholder.com/800x600',
                    author: data.author?.fullName || data.author || 'Unknown',
                    type: data.type || 'Online', // Default
                });
            } catch (err) {
                console.error("Failed to load course", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // Offline Tabs State
    const [activeOfflineTab, setActiveOfflineTab] = useState('info'); // info, schedule, curriculum, commitment

    if (isLoading) return <div className="p-10 flex justify-center">Loading...</div>;
    if (!doc) return <div className="p-10">Document not found</div>;

    // Determine Layout Type
    const isOffline = doc.type === 'offline';
    const isVideoLayout = doc.type === 'paid';

    // Render Calendar for Schedule (Mock)
    const renderCalendar = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Mocking May 2026
        const dates = Array.from({ length: 31 }, (_, i) => i + 1);
        const startDayOffset = 5; // Friday

        const scheduleDays = doc.offlineDetails?.schedule?.days || [];

        return (
            <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Lịch học: {doc.offlineDetails?.schedule?.time}</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-gray-400 text-sm">
                    {days.map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                    {dates.map(date => {
                        // Simple check if this date matches a schedule day (Mock logic: matches specific cols)
                        const dayIndex = (date + startDayOffset - 1) % 7;
                        const dayName = days[dayIndex];
                        const isClassDay = scheduleDays.some((d: string) => dayName.startsWith(d));

                        return (
                            <div key={date} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                                ${isClassDay
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                    : 'bg-gray-50 dark:bg-white/5 text-gray-500'
                                }`}>
                                {date}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen transition-all duration-500 font-sans ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-800'
            }`}>
            <div className="flex relative">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 md:ml-64 p-6 md:p-10 transition-all duration-300">

                    {/* Breadcrumb / Back */}
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-6 transition-opacity">
                        <ArrowLeft size={16} /> Quay lại
                    </button>

                    {isOffline ? (
                        // OFFLINE COURSE LAYOUT
                        <div className="max-w-6xl mx-auto">
                            {/* Tabs Navigation */}
                            <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-[#151e32] p-2 rounded-2xl shadow-sm w-fit">
                                {['info', 'schedule', 'curriculum', 'commitment'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveOfflineTab(tab)}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeOfflineTab === tab
                                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                            : 'hover:bg-gray-100 dark:hover:bg-white/5 opacity-70'
                                            }`}
                                    >
                                        {tab === 'info' && 'Thông tin khóa học'}
                                        {tab === 'schedule' && 'Lịch học'}
                                        {tab === 'curriculum' && 'Lộ trình học tập'}
                                        {tab === 'commitment' && 'Cam kết sau khóa học'}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                                {/* Left Side: Image & Hero */}
                                <div className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl relative group order-last lg:order-first">
                                    <img src={doc.image} alt={doc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                                        <div className="text-white">
                                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">OFFLINE CLASS</span>
                                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{doc.title}</h1>
                                            <p className="opacity-90 leading-relaxed text-sm md:text-base">{doc.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Dynamic Content based on Tab */}
                                <div className="space-y-6">

                                    {activeOfflineTab === 'info' && (
                                        <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 animate-fade-in-up">
                                            <h2 className="text-2xl font-bold mb-6">Thông tin chi tiết</h2>
                                            <div className="space-y-4 text-sm md:text-base opacity-80">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0"><User size={20} /></div>
                                                    <div><div className="font-bold">Giảng viên / Trung tâm</div><div>{doc.author}</div></div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0"><Clock size={20} /></div>
                                                    <div><div className="font-bold">Lịch học</div><div>{doc.offlineDetails?.schedule?.time || 'TBA'}</div></div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0"><Share2 size={20} /></div>
                                                    <div><div className="font-bold">Địa điểm</div><div>{doc.offlineDetails?.schedule?.location || 'Hà Nội'}</div></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeOfflineTab === 'schedule' && (
                                        <div className="animate-fade-in-up">
                                            {renderCalendar()}
                                        </div>
                                    )}

                                    {activeOfflineTab === 'curriculum' && (
                                        <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 animate-fade-in-up">
                                            <h3 className="text-xl font-bold mb-6">Lộ trình học tập</h3>
                                            <div className="relative border-l-2 border-cyan-500/30 ml-3 space-y-8 pl-8 py-2">
                                                {doc.offlineDetails?.curriculum?.map((item: any, idx: number) => (
                                                    <div key={idx} className="relative">
                                                        <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-cyan-500 border-4 border-white dark:border-[#151e32]"></span>
                                                        <h4 className="font-bold text-lg text-cyan-500">{item.title}</h4>
                                                        <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded opacity-70 mb-2 inline-block">{item.duration}</span>
                                                        <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
                                                            {item.items.map((sub: string, sIdx: number) => (
                                                                <li key={sIdx}>{sub}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeOfflineTab === 'commitment' && (
                                        <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 animate-fade-in-up">
                                            <h3 className="text-xl font-bold mb-6">Cam kết đầu ra</h3>
                                            <ul className="space-y-4">
                                                {doc.offlineDetails?.commitment?.map((item: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                                        <span className="opacity-90">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 rounded-3xl shadow-lg text-white text-center">
                                        <h3 className="text-xl font-bold mb-2">Đăng ký tư vấn ngay</h3>
                                        <p className="text-sm opacity-90 mb-6">Để lại thông tin, chúng tôi sẽ liên hệ xếp lớp trong 24h.</p>
                                        <button className="w-full bg-white text-cyan-600 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                                            Đăng ký tư vấn
                                        </button>
                                        <p className="mt-4 text-xs opacity-70">Hotline: 1900 1234</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : isVideoLayout ? (
                        // VIDEO LAYOUT (Image 4 similar)
                        <div className="max-w-5xl mx-auto">
                            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 group cursor-pointer">
                                <img src={doc.image} alt={doc.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle size={80} className="text-white drop-shadow-lg scale-100 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-white">
                                    <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
                                    <p className="opacity-80 line-clamp-1">{doc.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                                        Nội dung bài học
                                    </h2>
                                    <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-sm prose dark:prose-invert max-w-none">
                                        <p>
                                            Chào mừng các bạn đến với bài học <strong>{doc.title}</strong>. Trong video này, chúng ta sẽ cùng tìm hiểu sâu về:
                                        </p>
                                        <ul>
                                            <li>Các mẫu câu giao tiếp thông dụng.</li>
                                            <li>Cách phát âm chuẩn giọng bản xứ.</li>
                                            <li>Luyện tập phản xạ nghe nói.</li>
                                        </ul>
                                        <p>
                                            Hãy nhớ ghi chép đầy đủ và luyện tập theo hướng dẫn của giảng viên <strong>{doc.author}</strong> nhé!
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl shadow-sm">
                                        <h3 className="font-bold mb-4">Thông tin khóa học</h3>
                                        <div className="space-y-4 text-sm opacity-80">
                                            <div className="flex justify-between">
                                                <span className="flex items-center gap-2"><Clock size={16} /> Thời lượng</span>
                                                <span>45 phút</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="flex items-center gap-2"><User size={16} /> Giảng viên</span>
                                                <span>{doc.author}</span>
                                            </div>
                                        </div>
                                        <button className="w-full mt-6 bg-cyan-500/10 text-cyan-500 py-3 rounded-xl font-bold hover:bg-cyan-500 hover:text-white transition-all border border-cyan-500/20">
                                            Làm bài tập ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // DOCUMENT/TEXT LAYOUT (Image 3 similar)
                        <div className="max-w-4xl mx-auto">

                            <div className="mb-10 text-center">
                                <span className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                                    Grammar
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6">{doc.title}</h1>
                                <div className="flex items-center justify-center gap-6 text-sm opacity-60">
                                    <span className="flex items-center gap-2"><User size={16} /> {doc.author}</span>
                                    <span className="flex items-center gap-2"><Clock size={16} /> 15 phút đọc</span>
                                </div>
                            </div>

                            <div className="relative mb-12">
                                <img src={doc.image} alt="Cover" className="w-full h-80 object-cover rounded-[2rem] shadow-2xl" />
                                {/* Floating Menu */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e293b] px-6 py-3 rounded-full shadow-xl flex items-center gap-6 border border-gray-100 dark:border-white/10">
                                    <button className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-cyan-500 transition-all">
                                        <Download size={18} /> Tải PDF
                                    </button>
                                    <div className="w-px h-4 bg-gray-300"></div>
                                    <button className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-cyan-500 transition-all">
                                        <Share2 size={18} /> Chia sẻ
                                    </button>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="prose dark:prose-invert prose-lg max-w-none">
                                <h3>Phần 1: Giới thiệu</h3>
                                <p>
                                    Trong bài học này, chúng ta sẽ khám phá các khía cạnh quan trọng của <strong>Past Continuous</strong> (Quá khứ tiếp diễn). Đây là thì rất quan trọng để diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.
                                </p>

                                <h3>Phần 2: Cấu trúc</h3>
                                <div className="bg-cyan-500/5 border-l-4 border-cyan-500 p-6 my-6 rounded-r-xl">
                                    <p className="font-mono text-lg font-bold text-cyan-700 dark:text-cyan-400 m-0">
                                        S + was/were + V-ing
                                    </p>
                                </div>

                                <p>Ví dụ minh họa:</p>
                                <ul>
                                    <li>I was studying English at 8 PM yesterday.</li>
                                    <li>They were playing football when it started to rain.</li>
                                </ul>

                                <h3>Phần 3: Hình ảnh minh họa</h3>
                                <div className="grid grid-cols-2 gap-4 not-prose">
                                    <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2670&auto=format&fit=crop" className="rounded-xl shadow-md h-48 object-cover w-full" alt="Ex 1" />
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop" className="rounded-xl shadow-md h-48 object-cover w-full" alt="Ex 2" />
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <button className="bg-cyan-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform">
                                        Làm bài kiểm tra ngay
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DocumentDetailPage;
