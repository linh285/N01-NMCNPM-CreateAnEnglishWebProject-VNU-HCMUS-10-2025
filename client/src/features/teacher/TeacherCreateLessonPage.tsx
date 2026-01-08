import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Save, 
    X, 
    UploadCloud, 
    Video, 
    BookOpen,
    Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { lessonService } from '../../services/lesson.service';
import { courseService } from '../../services/course.service'; 

const TeacherCreateLessonPage = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // Initialize as an empty array to prevent crashes before data loads
    const [courses, setCourses] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        contentType: 'Video', 
        learningType: 'Listening', 
        durationMinutes: 10,
        orderIndex: 1,
        textContent: '',
        transcript: '',
        mediaUrl: '' 
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // 1. Fetch Courses on Mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAllCourses(); 
                
                // Check the structure of your API response and set the array correctly
                if (response && response.data && Array.isArray(response.data.courses)) {
                    setCourses(response.data.courses);
                } else if (response && Array.isArray(response.data)) {
                     // Fallback in case structure is different
                    setCourses(response.data);
                } else {
                    console.error("Unexpected course data structure:", response);
                    setCourses([]); 
                }
                // -------------------

            } catch (error) {
                console.error("Failed to load courses", error);
                setCourses([]);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.courseId) {
            alert("Vui lòng chọn khóa học!");
            return;
        }

        setIsLoading(true);

        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('contentType', formData.contentType);
            payload.append('learningType', formData.learningType);
            payload.append('durationMinutes', formData.durationMinutes.toString());
            payload.append('orderIndex', formData.orderIndex.toString());
            payload.append('content', formData.textContent);
            payload.append('TRANSCRIPT', formData.transcript);
            
            if (selectedFile) {
                payload.append('video', selectedFile); 
            } else if (formData.mediaUrl) {
                payload.append('videoUrl', formData.mediaUrl);
            }

            // Note: lessonService.createLesson takes (courseId, formData)
            await lessonService.createLesson(formData.courseId, payload);
            
            alert("Tạo bài học thành công!");
            navigate('/teacher'); 
        } catch (error) {
            console.error("Error creating lesson:", error);
            alert("Có lỗi xảy ra khi tạo bài học.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = `w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
        isDarkMode ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
    }`;

    const labelClass = `block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Thêm bài học mới</h1>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Tạo nội dung học tập mới cho học viên của bạn.
                    </p>
                </div>
                <button onClick={() => navigate('/teacher')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Basic Info */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-500" />
                        Thông tin cơ bản
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Selection */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>Chọn khóa học <span className="text-red-500">*</span></label>
                            <select 
                                name="courseId" 
                                value={formData.courseId} 
                                onChange={handleChange} 
                                className={inputClass}
                                required
                            >
                                <option value="">-- Chọn khóa học --</option>
                                {/* We map carefully here to avoid crashes if keys are different */}
                                {courses.map(course => (
                                    <option key={course.id || course.idCOURSE || course.courseCode} value={course.id || course.idCOURSE}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            {courses.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                    Không tìm thấy khóa học nào. Hãy đảm bảo bạn đã tạo khóa học trước.
                                </p>
                            )}
                        </div>

                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>Tiêu đề bài học <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange}
                                placeholder="Ví dụ: Unit 1 - Introduction to IELTS" 
                                className={inputClass} 
                                required 
                            />
                        </div>

                        {/* Content Type */}
                        <div>
                            <label className={labelClass}>Loại nội dung</label>
                            <select name="contentType" value={formData.contentType} onChange={handleChange} className={inputClass}>
                                <option value="Video">Video</option>
                                <option value="Reading">Reading (Đọc)</option>
                                <option value="Audio">Audio (Nghe)</option>
                                <option value="Quiz">Quiz (Bài tập)</option>
                            </select>
                        </div>

                        {/* Learning Type */}
                        <div>
                            <label className={labelClass}>Kỹ năng chính</label>
                            <select name="learningType" value={formData.learningType} onChange={handleChange} className={inputClass}>
                                <option value="Listening">Listening</option>
                                <option value="Reading">Reading</option>
                                <option value="Speaking">Speaking</option>
                                <option value="Vocabulary">Vocabulary</option>
                                <option value="Grammar">Grammar</option>
                            </select>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className={labelClass}>Thời lượng (phút)</label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input 
                                    type="number" 
                                    name="durationMinutes" 
                                    value={formData.durationMinutes} 
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`} 
                                />
                            </div>
                        </div>

                        {/* Order Index */}
                        <div>
                            <label className={labelClass}>Thứ tự bài học</label>
                            <input 
                                type="number" 
                                name="orderIndex" 
                                value={formData.orderIndex} 
                                onChange={handleChange}
                                className={inputClass} 
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Media Upload */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Video size={20} className="text-purple-500" />
                        Nội dung bài học
                    </h2>

                    <div className="space-y-6">
                        {formData.contentType === 'Video' || formData.contentType === 'Audio' ? (
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                isDarkMode ? 'border-gray-700 hover:border-blue-500 hover:bg-white/5' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                            }`}>
                                <input 
                                    type="file" 
                                    id="file-upload" 
                                    className="hidden" 
                                    accept="video/*,audio/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UploadCloud size={32} />
                                    </div>
                                    <span className="text-blue-500 font-medium">Tải lên Video/Audio</span>
                                    <p className="text-sm text-gray-500 mt-2">MP4, MP3 up to 100MB</p>
                                    {selectedFile && (
                                        <div className="mt-4 p-2 bg-green-500/10 text-green-500 rounded text-sm inline-block">
                                            Đã chọn: {selectedFile.name}
                                        </div>
                                    )}
                                </label>
                            </div>
                        ) : null}

                        {/* Text Content / Description */}
                        <div>
                            <label className={labelClass}>Nội dung văn bản / Ghi chú</label>
                            <textarea 
                                name="textContent" 
                                rows={4} 
                                value={formData.textContent} 
                                onChange={handleChange}
                                placeholder="Nhập nội dung bài đọc hoặc ghi chú cho bài học..."
                                className={inputClass}
                            ></textarea>
                        </div>

                         {/* Transcript */}
                         <div>
                            <label className={labelClass}>Transcript (Lời thoại)</label>
                            <textarea 
                                name="transcript" 
                                rows={4} 
                                value={formData.transcript} 
                                onChange={handleChange}
                                placeholder="Nhập lời thoại (nếu có) để hỗ trợ học viên..."
                                className={inputClass}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button 
                        type="button"
                        onClick={() => navigate('/teacher')}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                            isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang lưu...' : (
                            <>
                                <Save size={20} />
                                Lưu bài học
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherCreateLessonPage;