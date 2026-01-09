import { useState, useEffect } from 'react';
import { Database, Plus, Trash2, FileText, Filter, Image as ImageIcon, Volume2 } from 'lucide-react';
import { courseService } from '../../../services/course.service';
import { questionService } from '../../../services/question.service';
import QuestionFormModal from './QuestionFormModal'; // Import the new modal

const QuestionBankPage = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // [NEW] Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Fetch Teacher's Courses
    useEffect(() => {
        courseService.getTeacherCourses().then(res => {
            const courseList = res.data?.courses || [];
            setCourses(courseList);
            if (courseList.length > 0) setSelectedCourseId(courseList[0].idCOURSE);
        });
    }, []);

    // 2. Fetch Questions Function
    const fetchQuestions = () => {
        if (!selectedCourseId) return;
        setLoading(true);
        questionService.getQuestionsByCourse(selectedCourseId)
            .then(res => setQuestions(res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    // Trigger fetch on course change
    useEffect(() => {
        fetchQuestions();
    }, [selectedCourseId]);

    const handleDelete = async (id: number) => {
        if(!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
        try {
            await questionService.deleteQuestion(id);
            fetchQuestions(); // Refresh list
        } catch (error) {
            alert("Xóa thất bại");
        }
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Database className="text-blue-600" /> Ngân hàng câu hỏi
                </h1>
                
                {/* [UPDATED] Button triggers modal */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={18} /> Thêm câu hỏi mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4 items-center">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400"/>
                    <span className="text-sm font-medium">Chọn khóa học:</span>
                </div>
                <select 
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                    {courses.map(c => (
                        <option key={c.idCOURSE} value={c.idCOURSE}>{c.title}</option>
                    ))}
                </select>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                {loading ? (
                    <div className="text-center py-10">Đang tải câu hỏi...</div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        Chưa có câu hỏi nào trong ngân hàng của khóa học này.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <div key={q.idQUESTION} className="border border-gray-100 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3 w-full">
                                        <div className="flex flex-col gap-1 items-center">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded h-fit whitespace-nowrap">
                                                Câu {questions.length - index}
                                            </span>
                                            {/* Media Icons Indicator */}
                                            {q.mediaUrl && (
                                                q.mediaUrl.endsWith('.mp3') 
                                                ? <Volume2 size={16} className="text-purple-500"/>
                                                : <ImageIcon size={16} className="text-green-500"/>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{q.questionText}</p>
                                            
                                            {/* Media Preview (Optional) */}
                                            {q.mediaUrl && (
                                                <div className="mt-2 mb-2">
                                                    {q.mediaUrl.endsWith('.mp3') ? (
                                                        <audio controls className="h-8 w-60">
                                                            <source src={`http://localhost:3000/${q.mediaUrl}`} type="audio/mpeg" />
                                                        </audio>
                                                    ) : (
                                                        <img src={`http://localhost:3000/${q.mediaUrl}`} alt="Question Media" className="h-20 rounded-md object-cover border" />
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                {q.optionsJson && q.optionsJson.map((opt: string, idx: number) => (
                                                    <div key={idx} className={`flex items-center gap-2 ${q.correctAnswer === opt ? "text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded" : ""}`}>
                                                        <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] opacity-70">
                                                            {String.fromCharCode(65+idx)}
                                                        </span>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                            {q.lesson && (
                                                <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                                    <FileText size={12} /> Bài học: {q.lesson.title}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(q.idQUESTION)}
                                        className="text-gray-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Xóa câu hỏi"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* [NEW] Modal Integration */}
            <QuestionFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchQuestions}
                courseId={selectedCourseId}
            />
        </div>
    );
};

export default QuestionBankPage;