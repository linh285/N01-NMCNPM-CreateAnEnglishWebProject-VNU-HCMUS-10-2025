import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Video, FileText, Upload, Loader2, AlignLeft } from 'lucide-react';
import { courseService } from '../../services/course.service';
import { lessonService } from '../../services/lesson.service';

const TeacherCreateLessonPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const initialCourseId = searchParams.get('courseId') || '';
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
    const [courses, setCourses] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '', // This will store the Reading text
        type: 'Video', 
        duration: 0,
        isPreview: false
    });
    
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // Fetch courses
    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const response = await courseService.getTeacherCourses();
                const myCourses = response.data?.courses || [];
                setCourses(myCourses);
                if (!initialCourseId && myCourses.length > 0) {
                    setSelectedCourseId(myCourses[0].idCOURSE);
                }
            } catch (error) {
                console.error("Failed to load courses", error);
            }
        };
        fetchMyCourses();
    }, [initialCourseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId) return alert('Vui lòng chọn khóa học!');

        setIsLoading(true);
        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('contentType', formData.type);
            payload.append('durationMinutes', formData.duration.toString());
            payload.append('isPreview', formData.isPreview.toString());
            payload.append('learningType', formData.type === 'Video' ? 'Listening' : 'Reading');

            if (formData.type === 'Reading') {
                payload.append('content', formData.content);
            }

            if (formData.type === 'Video' && videoFile) {
                payload.append('video', videoFile);
            }

            await lessonService.createLesson(selectedCourseId, payload);
            
            alert('Tạo bài học thành công!');
            navigate(`/teacher/courses/${selectedCourseId}`);
        } catch (error) {
            console.error('Create lesson failed:', error);
            alert('Tạo bài học thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(selectedCourseId ? `/teacher/courses/${selectedCourseId}` : '/teacher/courses')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold">Thêm bài học mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                    
                    {/* Course Select */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Chọn khóa học <span className="text-red-500">*</span></label>
                        <select 
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                            required
                        >
                            <option value="" disabled>-- Chọn khóa học --</option>
                            {courses.map((course) => (
                                <option key={course.idCOURSE} value={course.idCOURSE}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tiêu đề bài học <span className="text-red-500">*</span></label>
                        <input 
                            required
                            type="text"
                            className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Ví dụ: Bài đọc về thì hiện tại đơn"
                        />
                    </div>

                    {/* Lesson Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                            onClick={() => setFormData({...formData, type: 'Video'})}
                            className={`cursor-pointer p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${formData.type === 'Video' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <Video size={24} />
                            <span className="font-medium">Video Bài Giảng</span>
                        </div>
                        <div 
                            onClick={() => setFormData({...formData, type: 'Reading'})}
                            className={`cursor-pointer p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${formData.type === 'Reading' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <FileText size={24} />
                            <span className="font-medium">Bài Đọc / Tài liệu</span>
                        </div>
                    </div>

                    {/* --- DYNAMIC CONTENT SECTION --- */}
                    
                    {/* Option A: Video Upload */}
                    {formData.type === 'Video' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="block text-sm font-medium mb-1">Upload Video</label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    className="hidden" 
                                    id="video-upload"
                                    onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                                />
                                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                                    <Upload size={32} />
                                    <span className="text-sm">
                                        {videoFile ? videoFile.name : 'Click để chọn file video (MP4, MKV...)'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Option B: Text Content (NEW) */}
                    {formData.type === 'Reading' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                <AlignLeft size={16} /> Nội dung bài đọc
                            </label>
                            <textarea
                                rows={10}
                                className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Nhập nội dung bài học, ngữ pháp, hoặc từ vựng vào đây..."
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">Hỗ trợ nhập văn bản thuần (Plain text).</p>
                        </div>
                    )}

                    {/* Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
                            <input 
                                type="number"
                                min="0"
                                className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                value={formData.duration}
                                onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-blue-600"
                                    checked={formData.isPreview}
                                    onChange={e => setFormData({...formData, isPreview: e.target.checked})}
                                />
                                <span className="text-sm font-medium">Cho phép học thử (Preview)</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Tạo bài học
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherCreateLessonPage;