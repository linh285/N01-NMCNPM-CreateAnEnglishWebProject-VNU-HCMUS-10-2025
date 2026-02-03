import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../../services/course.service';
import { lessonService } from '../../../services/lesson.service';
import { Plus, BookOpen, Edit, Trash2, Video, FileText, Clock, ChevronLeft } from 'lucide-react';

// Helper to get image/video URL
const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const BASE_URL = 'https://n01nmcnpm-production.up.railway.app';
    return `${BASE_URL}/${path}`;
};

const TeacherCourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(id) fetchData(id);
    }, [id]);

    const fetchData = async (courseId: string) => {
        setLoading(true);
        try {
            // Run both requests in parallel
            const [courseRes, lessonsRes] = await Promise.all([
                courseService.getCourseById(courseId),
                lessonService.getLessonsByCourse(courseId)
            ]);
            
            // Backend returns: { data: { course: ... } }
            setCourse(courseRes.data.course);
            
            // Backend returns: { data: [ ... ] } based on your lessonController
            setLessons(lessonsRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if(!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
        try {
            await lessonService.deleteLesson(lessonId);
            // Remove from UI immediately
            setLessons(prev => prev.filter(l => l.idLESSON !== lessonId && l.id !== lessonId)); 
        } catch (error) {
            alert('Xóa thất bại');
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
    if (!course) return <div className="p-10 text-center">Không tìm thấy khóa học</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/courses')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-gray-500 text-sm">{lessons.length} bài học • {course.level}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate(`/teacher/courses/edit/${id}`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Edit size={18} /> Sửa khóa học
                    </button>
                    <button 
                        onClick={() => navigate(`/teacher/lessons/create?courseId=${id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={20} /> Thêm bài học
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} /> Nội dung khóa học
                </h2>
                
                {lessons.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-gray-500 mb-2">Chưa có bài học nào.</p>
                        <button 
                             onClick={() => navigate(`/teacher/lessons/create?courseId=${id}`)}
                             className="text-blue-600 font-medium hover:underline"
                        >
                            Tạo bài học đầu tiên ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lessons.map((lesson, index) => (
                            <div 
                                key={lesson.idLESSON || lesson.id} 
                                className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            {lesson.contentType === 'Video' ? <Video size={16} className="text-blue-500"/> : <FileText size={16} className="text-green-500"/>}
                                            {lesson.title}
                                            {lesson.isPreview && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Học thử</span>}
                                        </h4>
                                        <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {lesson.durationMinutes} phút</span>
                                            <span>• {lesson.learningType}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => navigate(`/teacher/lessons/edit/${lesson.idLESSON || lesson.id}`)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteLesson(lesson.idLESSON || lesson.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Xóa"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherCourseDetailPage;