import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BookOpen, Edit, Trash2, Users, MoreVertical } from 'lucide-react';
import { courseService } from '../../../services/course.service';
import { useAuth } from '../../../context/AuthContext';

interface Course {
    idCOURSE: number;
    title: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    level: string;
    status: string;
    teacher: {
        idTEACHER: number;
        account?: {
            email: string;
        };
    };
    createdAt: string;
}

const TeacherCoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchCourses();
    }, []);

   const fetchCourses = async () => {
        try {
            setLoading(true);
            
            const response = await courseService.getTeacherCourses();
            
            // The backend returns { data: { courses: [...] } }
            const myCourses = response.data?.courses || [];
            
            setCourses(myCourses);
        } catch (error) {
            console.error("Failed to fetch courses", error);
            // Optional: Add toast notification here
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
            try {
                await courseService.deleteCourse(id);
                // Refresh list
                setCourses(prev => prev.filter(c => c.idCOURSE !== id));
            } catch (error) {
                alert('Không thể xóa khóa học. Vui lòng thử lại.');
            }
        }
    };

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý các khóa học và bài giảng của bạn</p>
                </div>
                <button 
                    onClick={() => navigate('/teacher/courses/create')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    <span>Tạo khóa học mới</span>
                </button>
            </div>

            {/* Filter & Search */}
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm khóa học..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="text-center py-10">Đang tải...</div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Chưa có khóa học nào</h3>
                    <p className="text-gray-500 mt-1">Bắt đầu bằng cách tạo khóa học đầu tiên của bạn</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.idCOURSE} className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
                            {/* Thumbnail */}
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {course.thumbnailUrl ? (
                                    <img 
                                        src={course.thumbnailUrl.startsWith('http') ? course.thumbnailUrl : `http://localhost:3000/${course.thumbnailUrl}`} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                        <BookOpen size={40} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    {course.level}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h3>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                    {course.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <div className="flex items-center gap-1">
                                        <Users size={16} />
                                        <span>0 học viên</span> {/* Placeholder for enrollment count */}
                                    </div>
                                    <div className="font-semibold text-blue-600">
                                        {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} đ`}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4">
                                    <button 
                                        onClick={() => navigate(`/teacher/courses/${course.idCOURSE}`)}
                                        className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        Chi tiết
                                    </button>
                                    <button 
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(course.idCOURSE)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherCoursesPage;