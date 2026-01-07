import {
    Users,
    BookOpen,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight
} from 'lucide-react';

const AdminDashboardPage = () => {

    // Mock Data based on images
    const stats = [
        { label: 'Total Users', value: '708', change: '+12%', icon: Users, color: 'bg-blue-500' },
        { label: 'Total Courses', value: '45', change: '+3 new', icon: BookOpen, color: 'bg-green-500' },
        { label: 'Revenue', value: '$12,450', change: '+8.5%', icon: TrendingUp, color: 'bg-purple-500' },
        { label: 'Pending Actions', value: '12', change: 'Urgent', icon: Clock, color: 'bg-orange-500' },
    ];

    const systemAlerts = [
        { level: 'Critical', count: 2, msg: 'Server response time > 3s', color: 'text-red-500' },
        { level: 'Warning', count: 5, msg: 'Low storage space (15% left)', color: 'text-yellow-500' },
        { level: 'Info', count: 8, msg: 'New feature requests', color: 'text-green-500' },
    ];

    const pendingActions = [
        'Approve 12 new teacher applications',
        'Review 8 flagged user reports',
        'Update 5 course content requests',
        'Process 23 refund requests',
        'Verify 45 pending user accounts'
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded mt-2 inline-block">
                                {stat.change}
                            </span>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section (Mocked) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Platform Overview */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Platform Overview</h3>
                    </div>
                    {/* Mock Chart Visual */}
                    <div className="h-64 flex items-end justify-between px-4 gap-2">
                        {[40, 60, 45, 70, 50, 65, 80, 55, 75, 60, 90, 85].map((h, i) => (
                            <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-1000"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Jan</span><span>Dec</span>
                    </div>
                </div>

                {/* Course Statistics */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Course Statistics</h3>
                    </div>
                    <div className="flex items-center justify-center h-64 relative">
                        {/* CSS Donut Chart Mock */}
                        <div className="w-48 h-48 rounded-full border-[20px] border-purple-500 border-r-green-500 border-b-yellow-500 border-l-red-500 rotate-45"></div>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold">2341</span>
                            <span className="text-xs text-gray-500">Total Enrollments</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Business English</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Beginner Course</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> IELTS Prep</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Academic Writing</div>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Alerts & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* System Alerts */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" />
                        System Alerts & Issues
                    </h3>
                    <div className="space-y-4">
                        {systemAlerts.map((alert, idx) => (
                            <div key={idx} className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm font-bold ${alert.color} flex items-center gap-1.5`}>
                                        <div className={`w-2 h-2 rounded-full bg-current`}></div>
                                        {alert.level} ({alert.count})
                                    </span>
                                    <ArrowRight size={14} className="opacity-50" />
                                </div>
                                <span className="text-sm opacity-80 pl-3.5 border-l-2 border-gray-200 dark:border-white/10 ml-1">
                                    {alert.msg}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-blue-500" />
                        Pending Admin Actions
                    </h3>
                    <ul className="space-y-3">
                        {pendingActions.map((action, idx) => (
                            <li key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-all">
                                <span className="text-sm opacity-80 group-hover:opacity-100">{action}</span>
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" />
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardPage;
