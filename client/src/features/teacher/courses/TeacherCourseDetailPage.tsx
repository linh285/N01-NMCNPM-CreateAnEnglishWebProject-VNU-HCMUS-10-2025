import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../../services/course.service';
import { Plus, BookOpen } from 'lucide-react';

const TeacherCourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);

    useEffect(() => {
        if(id) fetchCourse(id);
    }, [id]);

    const fetchCourse = async (courseId: string) => {
        try {
            const res = await courseService.getCourseById(courseId);
            setCourse(res.data.course);
        } catch (error) {
            console.error(error);
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <button 
                    onClick={() => navigate(`/teacher/lessons/create?courseId=${id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} /> Thêm bài học
                </button>
            </div>
            
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} /> Danh sách bài học
                </h2>
                <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                    Chức năng quản lý danh sách bài học sẽ được cập nhật ở Phase 2.
                    <br />
                    (Hiện tại bạn có thể bấm "Thêm bài học" để dùng form cũ)
                </div>
            </div>
        </div>
    );
};

export default TeacherCourseDetailPage;