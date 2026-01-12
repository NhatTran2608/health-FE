/**
 * ===================================
 * TRANG QUẢN LÝ NGƯỜI DÙNG - ADMIN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiUsers,
    FiSearch,
    FiTrash2,
    FiEdit2,
    FiShield,
    FiUser
} from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal, Pagination } from '@/components';
import { userService } from '@/services';
import { formatDate } from '@/utils';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers({
                page: pagination.page,
                limit: pagination.limit
            });

            if (response.data) {
                setUsers(response.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination?.totalItems || 0,
                    totalPages: response.pagination?.totalPages || 0
                }));
            }
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await userService.deleteUser(selectedUser._id);
            toast.success('Xóa người dùng thành công!');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            toast.error('Không thể xóa người dùng');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && users.length === 0) {
        return <Loading text="Đang tải danh sách người dùng..." />;
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FiUsers />
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-500">Tổng số: {pagination.total} người dùng</p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm theo tên, email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Users Table */}
            <Card>
                {filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.phone || 'Chưa có SĐT'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                                                ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                                }
                                            `}>
                                                {user.role === 'admin' ? (
                                                    <><FiShield size={12} /> Admin</>
                                                ) : (
                                                    <><FiUser size={12} /> User</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    disabled={user.role === 'admin'}
                                                    className={`p-2 rounded-lg transition-colors ${user.role === 'admin'
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : 'text-red-600 hover:bg-red-50'
                                                        }`}
                                                    title={user.role === 'admin' ? 'Không thể xóa admin' : 'Xóa người dùng'}
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={FiUsers}
                        title="Không tìm thấy người dùng"
                        description={searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có người dùng nào'}
                    />
                )}

                {/* Pagination */}
                {filteredUsers.length > 0 && !searchTerm && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                        />
                    </div>
                )}
            </Card>

            {/* Delete Modal */}
            {showDeleteModal && (
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Xác nhận xóa"
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.name}</strong>?
                        </p>
                        <p className="text-sm text-red-600">
                            ⚠️ Hành động này không thể hoàn tác!
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="danger"
                                onClick={confirmDelete}
                            >
                                Xóa
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
