import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash, Save, Loader } from 'lucide-react';
import { questionService } from '../../../services/question.service';

interface QuestionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseId: string;
}

const QuestionFormModal = ({ isOpen, onClose, onSuccess, courseId }: QuestionFormModalProps) => {
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '']); // Default 4 options
    const [correctAnswer, setCorrectAnswer] = useState<number>(0); // Index of correct option
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            setQuestionText('');
            setOptions(['', '', '', '']);
            setCorrectAnswer(0);
            setMediaFile(null);
        }
    }, [isOpen]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index: number) => {
        if (options.length <= 2) return; // Minimum 2 options
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        if (correctAnswer >= index && correctAnswer > 0) {
            setCorrectAnswer(correctAnswer - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation
        if (!questionText.trim()) return alert("Vui lòng nhập nội dung câu hỏi");
        if (options.some(opt => !opt.trim())) return alert("Vui lòng điền đầy đủ các lựa chọn");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('courseId', courseId);
            formData.append('questionText', questionText);
            
            // Format options array to JSON string
            formData.append('optionsJson', JSON.stringify(options));
            
            // Send the TEXT of the correct answer, not the index
            formData.append('correctAnswer', options[correctAnswer]);

            if (mediaFile) {
                formData.append('media', mediaFile);
            }

            await questionService.createQuestion(formData);
            
            onSuccess(); // Trigger refresh in parent
            onClose();
        } catch (error) {
            console.error("Failed to create question", error);
            alert("Có lỗi xảy ra khi tạo câu hỏi.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">Thêm Câu Hỏi Mới</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Nội dung câu hỏi</label>
                        <textarea 
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            placeholder="Nhập câu hỏi của bạn..."
                        />
                    </div>

                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Hình ảnh/Âm thanh đính kèm (Tùy chọn)</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                            <input 
                                type="file" 
                                onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*,audio/*"
                            />
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                {mediaFile ? (
                                    <span className="text-blue-600 font-medium">{mediaFile.name}</span>
                                ) : (
                                    <>
                                        <Upload size={24} />
                                        <span className="text-sm">Click để tải lên hình ảnh hoặc audio</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Các lựa chọn (Tick chọn đáp án đúng)</label>
                        <div className="space-y-3">
                            {options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="correctAnswer"
                                        checked={correctAnswer === idx}
                                        onChange={() => setCorrectAnswer(idx)}
                                        className="w-5 h-5 text-blue-600 cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                                        className={`flex-1 p-2 rounded-lg border ${correctAnswer === idx ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'}`}
                                    />
                                    {options.length > 2 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeOption(idx)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button 
                            type="button"
                            onClick={addOption}
                            className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
                        >
                            <Plus size={16} /> Thêm lựa chọn
                        </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                            Lưu câu hỏi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionFormModal;