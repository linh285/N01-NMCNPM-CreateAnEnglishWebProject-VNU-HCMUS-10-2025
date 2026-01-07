// import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const AdminUsersPage = () => {

    // Mock Users Data
    const users = [
        { id: 14201, name: 'Konstantin K.', type: 'Students', status: 'Active', subscription: 'Free Trial', phone: '+84 987 654 321', active: 'Active now', avatar: 'https://ui-avatars.com/api/?name=Konstantin' },
        { id: 21345, name: 'Andrew Salgado', type: 'Teachers', status: 'Active', subscription: 'Premium', phone: '+84 987 654 111', active: '2h ago', avatar: 'https://ui-avatars.com/api/?name=Andrew' },
        { id: 16114, name: 'Magdalena Ed', type: 'Students', status: 'Active', subscription: 'Free Trial', phone: '+84 987 654 222', active: 'Active now', avatar: 'https://ui-avatars.com/api/?name=Magdalena' },
        { id: 135962, name: 'Mark Travis', type: 'Students', status: 'Active', subscription: 'Free Trial', phone: '+84 987 654 333', active: 'Active now', avatar: 'https://ui-avatars.com/api/?name=Mark' },
        { id: 10973, name: 'Daniel Wellington', type: 'Students', status: 'Suspended', subscription: 'Free Trial', phone: '+84 987 654 444', active: '2h ago', avatar: 'https://ui-avatars.com/api/?name=Daniel' },
        { id: 6224, name: 'Lucia Moresmi', type: 'Students', status: 'Active', subscription: 'Premium', phone: '+84 987 654 555', active: 'Active now', avatar: 'https://ui-avatars.com/api/?name=Lucia' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6">

            {/* Filter Sidebar (Desktop) */}
            <div className="hidden lg:block w-72 shrink-0">
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 sticky top-24">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Filter</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Type */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Type</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked className="rounded text-blue-500" />
                                    <span>Students (2,145)</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" className="rounded text-blue-500" />
                                    <span>Teachers (40)</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" className="rounded text-blue-500" />
                                    <span>Admin (8)</span>
                                </label>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Status</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked className="rounded text-green-500" />
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Active</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked className="rounded text-orange-500" />
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Inactive</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked className="rounded text-red-500" />
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Suspended</span>
                                </label>
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-xl border border-gray-300 dark:border-white/10 text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Search Header */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold">List of active people</h2>
                            <p className="text-sm opacity-60">Manage your user base efficiently</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all">
                                Export to Excel
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats Row */}
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-white/5 text-center text-xs md:text-sm font-medium opacity-80">
                        <div>
                            <div className="font-bold text-lg mb-1">233</div>
                            <div className="text-gray-500 text-[10px]">Active</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg mb-1">11</div>
                            <div className="text-gray-500 text-[10px]">New</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg mb-1">8</div>
                            <div className="text-gray-500 text-[10px]">Admin</div>
                        </div>
                        {/* More mocked stats */}
                        <div>
                            <div className="font-bold text-lg mb-1">15</div>
                            <div className="text-gray-500 text-[10px]">Teachers</div>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <span className="font-bold">Found: {users.length}</span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            Pages: 1 / 5
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500">
                                    <th className="p-4">Full Name</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Subscription</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Last Active</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatar} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
                                                <span className="font-bold">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 opacity-80">{user.type}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                {user.status}
                                            </div>
                                        </td>
                                        <td className="p-4 opacity-80">{user.subscription}</td>
                                        <td className="p-4 opacity-80 font-mono text-xs">{user.phone}</td>
                                        <td className="p-4 opacity-80">{user.active}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded"><Edit size={16} /></button>
                                                <button className="p-1.5 hover:bg-red-500/10 text-red-500 rounded"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminUsersPage;
