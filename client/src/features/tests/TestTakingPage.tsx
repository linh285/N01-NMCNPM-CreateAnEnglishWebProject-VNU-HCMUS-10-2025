import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_DOCUMENTS } from '../../data/mockData';
import { Clock, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const TestTakingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const test = MOCK_DOCUMENTS.find(d => d.id === Number(id));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> optionIndex
    const [timeLeft, setTimeLeft] = useState((test?.duration || 45) * 60); // seconds
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Timer Logic
    useEffect(() => {
        if (isSubmitted) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSubmitted]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswer = (optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        // Calculate Score (Mock)
        // In real app, send to API
    };

    if (!test || !test.questions) return <div>Test not found or invalid.</div>;

    const currentQuestion = test.questions[currentQuestionIndex];

    // --- RESULT VIEW (Shown after Submit) ---
    if (isSubmitted) {
        const correctCount = test.questions.reduce((acc, q) => {
            return acc + (answers[test.questions!.indexOf(q)] === q.correctAnswer ? 1 : 0);
        }, 0);
        const score = Math.round((correctCount / test.questions.length) * 100);

        return (
            <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Kết quả bài kiểm tra</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Score Card */}
                        <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-lg text-center flex flex-col items-center justify-center">
                            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                <div className="absolute inset-0 rounded-full border-[15px] border-gray-100 dark:border-white/5"></div>
                                <div
                                    className="absolute inset-0 rounded-full border-[15px] border-cyan-500 border-t-transparent border-l-transparent rotate-45"
                                    style={{ transform: `rotate(${45 + (score * 3.6)}deg)` }} // Mock progress
                                ></div>
                                <div className="text-5xl font-bold text-cyan-500">{score}%</div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Total Score</h2>
                            <p className="opacity-70">Bạn đã trả lời đúng {correctCount}/{test.questions.length} câu hỏi.</p>
                        </div>

                        {/* Analysis Card */}
                        <div className="bg-white dark:bg-[#151e32] p-8 rounded-3xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Chi tiết kỹ năng</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1 text-sm font-bold"><span>Listening</span><span>85%</span></div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[85%]"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-sm font-bold"><span>Reading</span><span>70%</span></div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[70%]"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-sm font-bold"><span>Grammar</span><span>60%</span></div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[60%]"></div></div>
                                </div>
                            </div>
                            <button onClick={() => navigate('/home')} className="mt-8 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold transition-all">
                                Quay về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- TAKING TEST VIEW ---
    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>

            {/* Header */}
            <div className="h-20 bg-white dark:bg-[#151e32] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 shadow-sm z-20">
                <h1 className="font-bold text-xl">{test.title}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 px-4 py-2 rounded-lg font-mono font-bold">
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg"
                    >
                        Nộp bài
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Question) */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <span className="text-cyan-500 font-bold uppercase tracking-wider text-sm">Question {currentQuestionIndex + 1} of {test.questions.length}</span>
                            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 mt-4 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-300"
                                    style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-medium mb-10 leading-relaxed">
                            {currentQuestion.text}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((opt, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${answers[currentQuestionIndex] === idx
                                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestionIndex] === idx
                                            ? 'border-cyan-500 bg-cyan-500 text-white'
                                            : 'border-gray-300 dark:border-gray-600 group-hover:border-cyan-400'
                                        }`}>
                                        {answers[currentQuestionIndex] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="text-lg">{opt}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-12">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="px-6 py-3 rounded-lg font-bold text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentQuestionIndex === test.questions!.length - 1}
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="px-8 py-3 rounded-lg font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-all flex items-center gap-2"
                            >
                                Next Question <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Navigator) */}
                <div className="w-80 bg-white dark:bg-[#151e32] border-l border-gray-200 dark:border-white/5 p-6 hidden lg:block overflow-y-auto">
                    <h3 className="font-bold text-lg mb-6">Question Navigator</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {test.questions.map((q, idx) => {
                            const isAnswered = answers[idx] !== undefined;
                            const isCurrent = currentQuestionIndex === idx;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`aspect-square rounded-lg font-bold flex items-center justify-center transition-all ${isCurrent
                                            ? 'bg-cyan-600 text-white ring-2 ring-cyan-300 ring-offset-2 dark:ring-offset-[#151e32]'
                                            : isAnswered
                                                ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-cyan-600 rounded-full"></div> Current
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-cyan-100 rounded-full"></div> Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-100 rounded-full"></div> Not Answered
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestTakingPage;
