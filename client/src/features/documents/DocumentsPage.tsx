import { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import DocumentCard from './DocumentCard';
import { useTheme } from '../../context/ThemeContext';
// import { MOCK_DOCUMENTS } from '../../data/mockData'; // Removed
import { courseService } from '../../services/course.service';

interface DocumentsPageProps {
    type: 'free' | 'paid' | 'offline' | 'test';
}

const DocumentsPage = ({ type }: DocumentsPageProps) => {
    const { isDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data State
    const [documents, setDocuments] = useState<any[]>([]); // Use appropriate type if available
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'learning'
    const [selectedAuthor, setSelectedAuthor] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                // Determine API endpoint based on type
                // For now, fetch ALL and filter client side to ensure we see what's happening
                const response = await courseService.getAllCourses();
                console.log("RAW API DATA:", response); // DEBUG

                // Backend returns: { status: 'success', data: { courses: [...] } }
                // courseService.getAllCourses() returns response.data (the body)
                // So 'response' variable here IS the body.
                // Therefore we need response.data.courses
                const coursesList = response.data?.courses || [];
                console.log("Extracted coursesList:", coursesList); // DEBUG

                const mappedData = coursesList.map((doc: any) => {
                    let uiType = 'paid';
                    // Careful with case sensitivity and data types
                    const isOffline = doc.type === 'Offline' || doc.type === 'offline';
                    const isTest = doc.category === 'Test' || doc.category === 'test';
                    const price = parseFloat(doc.price) || 0;

                    if (isOffline) uiType = 'offline';
                    else if (isTest) uiType = 'test';
                    else if (price === 0) uiType = 'free';

                    // console.log(`Doc: ${doc.title}, RawType: ${doc.type}, Cat: ${doc.category}, Price: ${price} -> UI: ${uiType}`);

                    return {
                        ...doc,
                        type: uiType,
                        id: doc.idCOURSE || doc.id || doc._id,
                        // Handle multiple possible image fields
                        image: doc.thumbnailUrl || doc.thumbnail || doc.image || 'https://via.placeholder.com/300',
                        author: doc.teacher?.fullName || doc.author?.fullName || 'Unknown',
                        progress: 0,
                        isCompleted: false,
                        price: price
                    };
                });

                console.log("MAPPED DATA:", mappedData); // DEBUG
                setDocuments(mappedData);
            } catch (err) {
                console.error("Fetch error:", err);
                setError('Failed to load documents.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Derived Data for Dropdowns
    const uniqueAuthors = useMemo(() => {
        const authors = new Set(documents.map(doc => doc.author).filter(Boolean));
        return ['All', ...Array.from(authors)];
    }, [documents]);

    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            // 1. Type Filter (Route based) mapping
            // doc.type is already mapped to 'free' | 'paid' | 'offline' | 'test' in fetchCourses
            if (doc.type !== type) return false;

            // 2. Tab Filter (Quick Access)
            if (activeTab === 'learning') {
                if (!doc.progress || doc.progress === 0 || doc.isCompleted) return false;
            }

            // 3. Search Filter
            const searchLower = searchQuery.toLowerCase();
            if (searchQuery && !doc.title.toLowerCase().includes(searchLower) && !doc.description.toLowerCase().includes(searchLower)) {
                return false;
            }

            // 4. Author Filter / Source Filter
            if (selectedAuthor !== 'All') {
                if (selectedAuthor === 'Teacher') {
                    // Show all EXCEPT English Hub
                    if (doc.author === 'ENGLISH HUB') return false;
                } else {
                    // Specific author (or ENGLISH HUB explicitly selected)
                    if (doc.author !== selectedAuthor) return false;
                }
            }

            // 5. Status Filter
            if (selectedStatus !== 'All') {
                if (selectedStatus === 'Completed' && !doc.isCompleted) return false;
                if (selectedStatus === 'In Progress' && (!doc.progress || doc.progress === 0 || doc.isCompleted)) return false;
                if (selectedStatus === 'Not Started' && doc.progress && doc.progress > 0) return false;
            }

            return true;
        });
    }, [type, activeTab, searchQuery, selectedAuthor, selectedStatus, documents]);

    // Dynamic Banner Config
    const getBannerConfig = () => {
        switch (type) {
            case 'free': return {
                title: 'Tài liệu miễn phí',
                desc: 'Bộ tài liệu miễn phí chất lượng cao dành cho cộng đồng.',
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop"
            };
            case 'paid': return {
                title: 'Tài liệu trả phí',
                desc: 'Các khóa học và tài liệu chuyên sâu giúp bạn bứt phá.',
                image: "https://images.unsplash.com/photo-1550592704-6c76defa9985?q=80&w=2670&auto=format&fit=crop"
            };
            case 'offline': return {
                title: 'Khóa học Offline',
                desc: 'Học trực tiếp tại trung tâm với giáo viên bản ngữ.',
                image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2670&auto=format&fit=crop"
            };
            case 'test': return {
                title: 'Bài kiểm tra',
                desc: 'Đánh giá năng lực của bạn qua các bài test chuẩn hóa.',
                image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2670&auto=format&fit=crop"
            };
            default: return { title: '', desc: '', image: '' };
        }
    };

    const banner = getBannerConfig();

    return (
        <div className={`min-h-screen transition-all duration-500 font-sans ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-800'
            }`}>
            <div className="flex relative">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 md:ml-64 p-6 md:p-10 transition-all duration-300">

                    {/* Header/Banner Area */}
                    <div className="relative w-full h-64 md:h-80 rounded-[32px] overflow-hidden mb-10 shadow-2xl group">
                        <img
                            src={banner.image}
                            alt="Banner"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                        <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 max-w-lg">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-xl">
                                {banner.title}
                            </h1>
                            <p className="text-gray-200 text-lg drop-shadow-md">
                                {banner.desc}
                            </p>
                        </div>
                    </div>

                    {/* Filter & Tabs Bar */}
                    <div className="flex flex-col gap-6 mb-8">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            {/* Tabs */}
                            <div className="flex items-center gap-2 bg-gray-200/50 p-1 rounded-full backdrop-blur-sm dark:bg-white/5">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px - 6 py - 2.5 rounded - full text - sm font - bold transition - all ${activeTab === 'all'
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                        } `}
                                >
                                    Tất cả tài liệu
                                </button>
                                <button
                                    onClick={() => setActiveTab('learning')}
                                    className={`px - 6 py - 2.5 rounded - full text - sm font - bold transition - all ${activeTab === 'learning'
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                        } `}
                                >
                                    Đang học
                                </button>
                            </div>

                            {/* Search & Filter Toggle */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className={`flex items - center px - 4 py - 2.5 rounded - full flex - 1 md: w - 64 border transition - all ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200'
                                    } `}>
                                    <Search size={18} className="text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p - 2.5 rounded - full border transition - all ${isDarkMode
                                        ? `border-white/10 hover:bg-white/10 ${showFilters ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white/5 text-gray-300'}`
                                        : `border-gray-200 hover:bg-gray-50 ${showFilters ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-gray-600'}`
                                        } `}
                                >
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Extended Filters Panel */}
                        {showFilters && (
                            <div className={`p - 4 rounded - 2xl border grid grid - cols - 1 md: grid - cols - 3 gap - 4 animate -in fade -in slide -in -from - top - 2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'
                                } `}>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Giảng viên</label>
                                    <select
                                        value={selectedAuthor}
                                        onChange={(e) => setSelectedAuthor(e.target.value)}
                                        className={`w - full p - 2.5 rounded - lg border outline - none ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                                            } `}
                                    >
                                        {uniqueAuthors.map(author => (
                                            <option key={author} value={author}>{author}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Trạng thái</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className={`w - full p - 2.5 rounded - lg border outline - none ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                                            } `}
                                    >
                                        <option value="All">Tất cả</option>
                                        <option value="Not Started">Chưa học</option>
                                        <option value="In Progress">Đang học</option>
                                        <option value="Completed">Đã hoàn thành</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Nguồn tài liệu</label>
                                    <select
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Handle filtering logic in useMemo
                                            if (val === 'System') setSelectedAuthor('ENGLISH HUB');
                                            else if (val === 'Teacher') setSelectedAuthor('Teacher'); // Will need special handling
                                            else setSelectedAuthor('All');
                                        }}
                                        className={`w - full p - 2.5 rounded - lg border outline - none ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                                            } `}
                                    >
                                        <option value="All">Tất cả</option>
                                        <option value="System">Tài liệu hệ thống (English Hub)</option>
                                        <option value="Teacher">Giáo viên đóng góp</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedAuthor('All');
                                            setSelectedStatus('All');
                                            setActiveTab('all');
                                        }}
                                        className="w-full py-2.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-bold"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex justify-center p-20">Loading...</div>
                    ) : filteredDocs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDocs.map(doc => (
                                <DocumentCard key={doc.id} data={doc} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <Search size={48} className="mb-4" />
                            <h3 className="text-xl font-bold">Không tìm thấy tài liệu nào {error && `(${error})`}</h3>
                            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default DocumentsPage;
