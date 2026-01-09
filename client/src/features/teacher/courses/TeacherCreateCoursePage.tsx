import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronLeft, Save } from 'lucide-react';
import { courseService } from '../../../services/course.service';

const TeacherCreateCoursePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        level: 'A1',
        type: 'Online',
        category: '',
        syllabus: ''
    });
    
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('description', formData.description);
            payload.append('price', formData.price.toString());
            payload.append('level', formData.level);
            payload.append('type', formData.type);
            payload.append('category', formData.category);
            payload.append('syllabus', formData.syllabus);
            
            if (thumbnail) {
                payload.append('thumbnail', thumbnail);
            }

            await courseService.createCourse(payload);
            alert('Tạo khóa học thành công!');
            navigate('/teacher/courses');
        } catch (error) {
            console.error('Create course error:', error);
            alert('Có lỗi xảy ra khi tạo khóa học.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/teacher/courses')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold">Tạo khóa học mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                            <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên khóa học <span className="text-red-500">*</span></label>
                                <input 
                                    required
                                    type="text"
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="VD: Tiếng Anh giao tiếp cơ bản"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea 
                                    rows={4}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Giới thiệu về khóa học..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Đề cương (Syllabus)</label>
                                <textarea 
                                    rows={4}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.syllabus}
                                    onChange={e => setFormData({...formData, syllabus: e.target.value})}
                                    placeholder="Nội dung chi tiết từng buổi học..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Settings & Media */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                            <h3 className="font-semibold text-lg">Cài đặt</h3>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                                <input 
                                    type="number"
                                    min="0"
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Trình độ</label>
                                <select 
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.level}
                                    onChange={e => setFormData({...formData, level: e.target.value})}
                                >
                                    <option value="A1">A1 (Beginner)</option>
                                    <option value="A2">A2 (Elementary)</option>
                                    <option value="B1">B1 (Intermediate)</option>
                                    <option value="B2">B2 (Upper Intermediate)</option>
                                    <option value="C1">C1 (Advanced)</option>
                                    <option value="C2">C2 (Proficiency)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Danh mục</label>
                                <input 
                                    type="text"
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                    placeholder="VD: TOEIC, IELTS, Giao tiếp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Loại hình</label>
                                <select 
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                            <h3 className="font-semibold text-lg">Hình ảnh</h3>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                                ) : (
                                    <div className="h-40 flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                                <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 inline-flex items-center gap-2">
                                    <Upload size={16} />
                                    Tải ảnh lên
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={() => navigate('/teacher/courses')}
                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        {isLoading ? 'Đang xử lý...' : <><Save size={20} /> Tạo khóa học</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherCreateCoursePage;