import { useState } from 'react';
import { BookOpen, Eye, CheckCircle, XCircle, Search, Filter, MoreVertical, Edit2 } from 'lucide-react';

const AdminCoursesPage = () => {
    const [activeTab, setActiveTab] = useState('all');

    // Mock Data
    const courses = [
        { id: 1, title: 'English for Beginners', teacher: 'Andrew Salgado', category: 'Communication', price: 0, status: 'Published', students: 1205, rating: 4.8, type: 'Online' },
        { id: 2, title: 'Advanced Business English', teacher: 'Sarah Willis', category: 'Business', price: 49, status: 'Published', students: 850, rating: 4.9, type: 'Online' },
        { id: 3, title: 'IELTS Band 7.0 Masterclass', teacher: 'John Doe', category: 'IELTS', price: 99, status: 'Pending', students: 0, rating: 0, type: 'Online' },
        { id: 4, title: 'Offline Speaking Club (Weekly)', teacher: 'English Hub', category: 'Speaking', price: 200, status: 'Draft', students: 45, rating: 4.5, type: 'Offline' },
        { id: 5, title: 'TOEIC 900+ Intensive', teacher: 'Minh Nguyen', category: 'TOEIC', price: 79, status: 'Rejected', students: 0, rating: 0, type: 'Online' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
            case 'Pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
            case 'Draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400';
            case 'Rejected': return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="text-blue-500" /> Course Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Review, approve, and manage all platform content</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all text-sm">
                        + Create Course
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total Courses</div>
                    <div className="text-2xl font-bold">45</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase mb-1">Pending Review</div>
                    <div className="text-2xl font-bold">3</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="text-green-600 dark:text-green-400 text-xs font-bold uppercase mb-1">Published</div>
                    <div className="text-2xl font-bold">38</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">Total Enrollments</div>
                    <div className="text-2xl font-bold">2,341</div>
                </div>
            </div>

            {/* Filters & Tabs */}
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-black/20 rounded-lg">
                    {['All', 'Published', 'Pending', 'Draft'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === tab.toLowerCase()
                                    ? 'bg-white dark:bg-[#1e293b] text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search courses..." className="w-full md:w-64 pl-9 pr-4 py-2 bg-gray-50 dark:bg-black/20 rounded-lg text-sm border-none outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <button className="p-2 bg-gray-50 dark:bg-black/20 rounded-lg hover:bg-gray-100">
                        <Filter size={18} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Course List Table */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500">
                            <th className="p-4">Course Name</th>
                            <th className="p-4">Instructor</th>
                            <th className="p-4 text-center">Type</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Students</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                        {courses.map(course => (
                            <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-gray-900 dark:text-white">{course.title}</div>
                                    <div className="text-xs text-gray-500">{course.category}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {course.teacher.charAt(0)}
                                        </div>
                                        {course.teacher}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${course.type === 'Online' ? 'border-blue-200 text-blue-600' : 'border-purple-200 text-purple-600'
                                        }`}>
                                        {course.type}
                                    </span>
                                </td>
                                <td className="p-4 font-bold">
                                    {course.price === 0 ? <span className="text-green-500">Free</span> : `$${course.price}`}
                                </td>
                                <td className="p-4 opacity-70">{course.students}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(course.status)}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {course.status === 'Pending' && (
                                            <>
                                                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Approve">
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Reject">
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="View Details">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 sm:hidden group-hover:block" title="More">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminCoursesPage;
