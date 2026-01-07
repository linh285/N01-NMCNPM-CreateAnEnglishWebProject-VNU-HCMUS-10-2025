import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService } from '../../services/lesson.service';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Menu } from 'lucide-react';

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<any[]>([]);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            if (!courseId) return;
            try {
                const data = await lessonService.getLessonsByCourse(courseId);
                const lessonsList = data.data || [];
                setLessons(lessonsList);

                // Find current lesson or default to first
                if (lessonId) {
                    const found = lessonsList.find((l: any) => l.id === Number(lessonId));
                    setCurrentLesson(found || lessonsList[0]);
                } else if (lessonsList.length > 0) {
                    setCurrentLesson(lessonsList[0]);
                }
            } catch (error) {
                console.error("Failed to fetch lessons", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLessons();
    }, [courseId, lessonId]);

    const handleLessonSelect = (lesson: any) => {
        setCurrentLesson(lesson);
        // navigate(`/courses/${courseId}/lessons/${lesson.id}`); // Uncomment if using sub-routes
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!currentLesson) return <div className="min-h-screen flex items-center justify-center">No lessons found.</div>;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-800 dark:text-gray-100 overflow-hidden">
            {/* Sidebar List */}
            <div className={`w-80 bg-white dark:bg-[#151e32] border-r border-gray-200 dark:border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20'}`}>
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100">
                        <ArrowLeft size={16} /> Trang chủ
                    </button>
                    <span className="font-bold">Nội dung khóa học</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {lessons.map((lesson, idx) => (
                        <div
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`p-3 rounded-xl cursor-pointer flex gap-3 items-start transition-all ${currentLesson.id === lesson.id
                                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="text-xs font-bold mt-1 opacity-50">{idx + 1}.</span>
                            <div>
                                <h4 className="font-bold text-sm line-clamp-2">{lesson.title}</h4>
                                <div className="flex items-center gap-2 text-xs opacity-60 mt-1">
                                    {lesson.contentType === 'Video' ? <PlayCircle size={12} /> : <FileText size={12} />}
                                    <span>{lesson.durationMinutes} phút</span>
                                </div>
                            </div>
                            {/* Checkbox for done status */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Toggle Sidebar Button */}
                {!isSidebarOpen && (
                    <button onClick={() => setIsSidebarOpen(true)} className="absolute top-4 left-4 z-10 p-2 bg-white dark:bg-[#151e32] rounded-full shadow-md">
                        <Menu size={20} />
                    </button>
                )}

                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        {currentLesson.contentType === 'Video' ? (
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
                                {/* Replace with actual video player */}
                                <iframe
                                    className="w-full h-full"
                                    src={currentLesson.videoUrl ? currentLesson.videoUrl.replace('watch?v=', 'embed/') : ''}
                                    title={currentLesson.title}
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#151e32] p-8 rounded-2xl shadow-lg mb-6 min-h-[400px]">
                                <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                            {/* Next/Prev buttons could go here */}
                        </div>

                        {/* Transcript or Description */}
                        <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold mb-2">Mô tả / Transcript</h3>
                            <p className="opacity-80">{currentLesson.description || 'Chưa có mô tả.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;
