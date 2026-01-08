import { useState, useEffect } from 'react';
import { Users, Search, BookOpen, Calendar, TrendingUp, Mail } from 'lucide-react';
import { courseService } from '../../../services/course.service';
import { enrollmentService } from '../../../services/enrollment.service';

const TeacherClassesPage = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // Fetch Teacher's Courses on Mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseService.getTeacherCourses();
                setCourses(res.data?.courses || []);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Handle viewing students for a specific course
    const handleViewStudents = async (course: any) => {
        setSelectedCourse(course);
        setLoadingStudents(true);
        try {
            const res = await enrollmentService.getStudentsByCourse(course.idCOURSE);
            setStudents(res.data || []);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="text-blue-600" /> Quản lý Lớp học & Học viên
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Course List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Khóa học của tôi</h2>
                    {loading ? (
                        <div>Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">Chưa có khóa học nào.</div>
                    ) : (
                        <div className="space-y-3">
                            {courses.map(course => (
                                <div 
                                    key={course.idCOURSE}
                                    onClick={() => handleViewStudents(course)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                                        selectedCourse?.idCOURSE === course.idCOURSE 
                                        ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20' 
                                        : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sm mb-1">{course.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {course.status}
                                            </span>
                                        </div>
                                        <BookOpen size={18} className="text-gray-400" />
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                                        <Users size={14} /> 
                                        {/* Note: Ideally backend sends student count in course object, for now we just show title */}
                                        Click để xem học viên
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Student List (Details) */}
                <div className="lg:col-span-2">
                    {selectedCourse ? (
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <div>
                                    <h2 className="font-bold text-lg">{selectedCourse.title}</h2>
                                    <p className="text-sm text-gray-500">Danh sách học viên</p>
                                </div>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Tìm học viên..." 
                                        className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Học viên</th>
                                            <th className="px-6 py-3">Ngày tham gia</th>
                                            <th className="px-6 py-3">Tiến độ</th>
                                            <th className="px-6 py-3">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {loadingStudents ? (
                                            <tr><td colSpan={4} className="p-6 text-center">Đang tải danh sách...</td></tr>
                                        ) : students.length === 0 ? (
                                            <tr><td colSpan={4} className="p-6 text-center text-gray-500">Chưa có học viên nào đăng ký khóa này.</td></tr>
                                        ) : (
                                            students.map((enrollment) => (
                                                <tr key={enrollment.idENROLLMENT} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-6 py-4 flex items-center gap-3">
                                                        <img 
                                                            src={enrollment.learner?.avatarUrl || "https://ui-avatars.com/api/?name=User"} 
                                                            alt="" 
                                                            className="w-8 h-8 rounded-full bg-gray-200"
                                                        />
                                                        <div>
                                                            <div className="font-medium">{enrollment.learner?.fullName || "Unknown"}</div>
                                                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                                                <Mail size={10} /> {enrollment.learner?.email || "No Email"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} />
                                                            {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-full max-w-[100px]">
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-blue-600 font-bold">{enrollment.progressPercent}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-blue-500 rounded-full" 
                                                                    style={{ width: `${enrollment.progressPercent}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                                                            enrollment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {enrollment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-gray-400">
                            <TrendingUp size={48} className="mb-4 opacity-50" />
                            <p>Chọn một khóa học bên trái để xem danh sách học viên</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherClassesPage;