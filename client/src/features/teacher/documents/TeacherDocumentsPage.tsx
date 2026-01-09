import { useState, useEffect } from 'react';
import { 
    FileText, 
    Upload, 
    Trash2, 
    Search, 
    FileAudio, 
    FileImage, 
    MoreVertical,
    Download
} from 'lucide-react';
import { documentService } from '../../../services/document.service';
import { courseService } from '../../../services/course.service';

const TeacherDocumentsPage = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    // Upload Form State
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [docsRes, coursesRes] = await Promise.all([
                documentService.getAll(),
                courseService.getTeacherCourses()
            ]);
            setDocuments(docsRes.data || []);
            setCourses(coursesRes.data?.courses || []);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Vui lòng chọn file");
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || file.name);
        if (courseId) formData.append('courseId', courseId);

        try {
            await documentService.upload(formData);
            alert("Upload thành công!");
            setIsUploadModalOpen(false);
            setFile(null);
            setTitle('');
            fetchData(); // Refresh list
        } catch (error) {
            alert("Upload thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
        try {
            await documentService.delete(id);
            setDocuments(prev => prev.filter(d => d.idDOCUMENT !== id));
        } catch (error) {
            alert("Xóa thất bại");
        }
    };

    // Helper to get icon based on file type
    const getFileIcon = (mimeType: string) => {
        if (mimeType?.includes('audio')) return <FileAudio className="text-purple-500" size={32} />;
        if (mimeType?.includes('image')) return <FileImage className="text-green-500" size={32} />;
        if (mimeType?.includes('pdf')) return <FileText className="text-red-500" size={32} />;
        return <FileText className="text-blue-500" size={32} />;
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="text-blue-600" /> Thư viện tài liệu
                </h1>
                <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Upload size={18} /> Tải tài liệu lên
                </button>
            </div>

            {/* Document Grid */}
            <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[400px] p-6">
                {loading ? (
                    <div className="text-center text-gray-500">Đang tải...</div>
                ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
                        <Upload size={48} className="mb-4 opacity-20" />
                        <p>Chưa có tài liệu nào. Hãy tải lên ngay!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {documents.map((doc) => (
                            <div key={doc.idDOCUMENT} className="group relative border border-gray-100 dark:border-gray-700 p-4 rounded-xl hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                        {getFileIcon(doc.fileType)}
                                    </div>
                                    <div className="relative">
                                         <button onClick={() => handleDelete(doc.idDOCUMENT)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={doc.title}>
                                    {doc.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 flex justify-between">
                                    <span>{formatSize(doc.fileSize)}</span>
                                    <span>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                                </p>
                                {doc.course && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full truncate max-w-full">
                                        {doc.course.title}
                                    </span>
                                )}
                                {/* Download Link Hack for Demo */}
                                <a 
                                    href={`http://localhost:3000/${doc.fileUrl}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="absolute inset-0 z-0"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Tải tài liệu mới</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên tài liệu</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Nhập tên hiển thị (Tùy chọn)"
                                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Gán vào khóa học (Tùy chọn)</label>
                                <select 
                                    value={courseId}
                                    onChange={e => setCourseId(e.target.value)}
                                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                >
                                    <option value="">-- Tài liệu chung --</option>
                                    {courses.map(c => (
                                        <option key={c.idCOURSE} value={c.idCOURSE}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">File</label>
                                <input 
                                    type="file" 
                                    onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {uploading ? 'Đang tải...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDocumentsPage;