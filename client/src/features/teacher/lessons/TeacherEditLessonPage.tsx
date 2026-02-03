import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Video, FileText, AlignLeft } from 'lucide-react';
import { lessonService } from '../../../services/lesson.service';

const TeacherEditLessonPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [courseId, setCourseId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        contentType: '', // 'Video' or 'Reading'
        content: '',     // The Text Content
        durationMinutes: 0,
        isPreview: false
    });

    useEffect(() => {
        if(lessonId) fetchLesson();
    }, [lessonId]);

    const fetchLesson = async () => {
        try {
            const res = await lessonService.getLessonById(lessonId!);
            const lesson = res.data; 
            
            setFormData({
                title: lesson.title,
                contentType: lesson.contentType,
                content: lesson.textContent || '', // [FIX] Load existing text
                durationMinutes: lesson.durationMinutes,
                isPreview: lesson.isPreview
            });
            setCourseId(lesson.idCOURSE);
        } catch (error) {
            console.error(error);
            alert('Không thể tải thông tin bài học');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('durationMinutes', formData.durationMinutes.toString());
            payload.append('isPreview', formData.isPreview ? 'true' : 'false');
            
            // [FIX] Send content update
            if (formData.contentType === 'Reading') {
                payload.append('content', formData.content);
            }

            await lessonService.updateLesson(lessonId!, payload);
            alert('Cập nhật thành công!');
            
            if(courseId) navigate(`/teacher/courses/${courseId}`);
            else navigate(-1);
        } catch (error) {
            console.error(error);
            alert('Lỗi cập nhật');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-2" /> Quay lại
            </button>
            
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Chỉnh sửa bài học</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    formData.contentType === 'Video' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                    {formData.contentType === 'Video' ? <Video size={16} /> : <FileText size={16} />}
                    {formData.contentType}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tiêu đề bài học</label>
                    <input 
                        type="text" 
                        required
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* [FIX] Show Text Area if it is a Reading Lesson */}
                {formData.contentType === 'Reading' && (
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                            <AlignLeft size={16} /> Nội dung bài đọc
                        </label>
                        <textarea
                            rows={12}
                            className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                        ></textarea>
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
                        <input 
                            type="number" 
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            value={formData.durationMinutes}
                            onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                        />
                    </div>
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4"
                                checked={formData.isPreview}
                                onChange={e => setFormData({...formData, isPreview: e.target.checked})}
                            />
                            <span>Học thử (Preview)</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherEditLessonPage;