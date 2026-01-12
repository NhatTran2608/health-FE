/**
 * ===================================
 * TRANG TÌM KIẾM
 * ===================================
 * Tìm kiếm nội dung tư vấn theo từ khóa
 */

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiSearch,
    FiMessageSquare,
    FiActivity,
    FiClock,
    FiX
} from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Pagination } from '@/components';
import { searchService } from '@/services';
import { formatDate } from '@/utils';

// Các loại tìm kiếm
const SEARCH_TYPES = [
    { value: 'all', label: 'Tất cả', icon: FiSearch },
    { value: 'chat', label: 'Lịch sử chat', icon: FiMessageSquare },
    { value: 'health', label: 'Hồ sơ sức khỏe', icon: FiActivity }
];

export default function SearchPage() {
    // State tìm kiếm
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // State kết quả
    const [results, setResults] = useState({
        chats: [],
        healthRecords: []
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    /**
     * Thực hiện tìm kiếm
     */
    const handleSearch = async (page = 1) => {
        if (!keyword.trim()) {
            toast.error('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }

        try {
            setLoading(true);
            setHasSearched(true);

            const response = await searchService.search(keyword.trim(), {
                type: searchType,
                page,
                limit: pagination.limit
            });

            // BE trả về: { success, message, data: { results: { chats, healthRecords }, pagination } }
            // => response.data là { results, pagination }
            if (response.data) {
                setResults({
                    chats: response.data.results?.chats || [],
                    healthRecords: response.data.results?.healthRecords || []
                });
                setPagination(prev => ({
                    ...prev,
                    page,
                    total: response.data.pagination?.total || 0,
                    totalPages: response.data.pagination?.totalPages || 0
                }));
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Xử lý nhấn Enter
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(1);
        }
    };

    /**
     * Xóa kết quả tìm kiếm
     */
    const handleClear = () => {
        setKeyword('');
        setResults({ chats: [], healthRecords: [] });
        setHasSearched(false);
    };

    /**
     * Highlight từ khóa trong text
     */
    const highlightKeyword = (text, keyword) => {
        if (!text || !keyword) return text;

        const regex = new RegExp(`(${keyword})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    // Tổng số kết quả
    const totalResults = results.chats.length + results.healthRecords.length;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tìm kiếm</h1>
                <p className="text-gray-500">Tìm kiếm nội dung tư vấn và hồ sơ sức khỏe</p>
            </div>

            {/* Search box */}
            <Card className="mb-6">
                <div className="space-y-4">
                    {/* Input tìm kiếm */}
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className="w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                        />
                        {keyword && (
                            <button
                                onClick={handleClear}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>

                    {/* Loại tìm kiếm */}
                    <div className="flex flex-wrap gap-2">
                        {SEARCH_TYPES.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() => setSearchType(type.value)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${searchType === type.value
                                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{type.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Nút tìm kiếm */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => handleSearch(1)}
                            loading={loading}
                            disabled={!keyword.trim()}
                        >
                            <FiSearch /> Tìm kiếm
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Kết quả tìm kiếm */}
            {loading ? (
                <Loading text="Đang tìm kiếm..." />
            ) : hasSearched ? (
                totalResults === 0 ? (
                    <EmptyState
                        icon={<FiSearch size={48} />}
                        title="Không tìm thấy kết quả"
                        description={`Không có kết quả nào cho từ khóa "${keyword}"`}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Thông báo số kết quả */}
                        <div className="text-gray-600">
                            Tìm thấy <span className="font-semibold">{totalResults}</span> kết quả
                            cho từ khóa "<span className="font-semibold">{keyword}</span>"
                        </div>

                        {/* Kết quả chat */}
                        {(searchType === 'all' || searchType === 'chat') && results.chats.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FiMessageSquare className="text-primary-500" />
                                    Lịch sử tư vấn ({results.chats.length})
                                </h2>
                                <div className="space-y-4">
                                    {results.chats.map((chat) => (
                                        <Card key={chat._id} className="hover:shadow-lg transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-primary-100 rounded-lg">
                                                    <FiMessageSquare className="text-primary-500" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                        <FiClock size={14} />
                                                        <span>{formatDate(chat.createdAt, 'datetime')}</span>
                                                    </div>
                                                    <p className="font-medium text-gray-800 mb-2">
                                                        <span className="text-primary-600">Câu hỏi:</span>{' '}
                                                        {highlightKeyword(chat.question, keyword)}
                                                    </p>
                                                    <p className="text-gray-600 line-clamp-3">
                                                        <span className="text-green-600">Trả lời:</span>{' '}
                                                        {highlightKeyword(chat.answer, keyword)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kết quả hồ sơ sức khỏe */}
                        {(searchType === 'all' || searchType === 'health') && results.healthRecords.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FiActivity className="text-green-500" />
                                    Hồ sơ sức khỏe ({results.healthRecords.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.healthRecords.map((record) => (
                                        <Card key={record._id} className="hover:shadow-lg transition-shadow">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <FiClock size={14} />
                                                <span>{formatDate(record.createdAt, 'datetime')}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {record.weight && (
                                                    <div className="bg-blue-50 p-2 rounded">
                                                        <span className="text-gray-500">Cân nặng:</span>{' '}
                                                        <span className="font-medium">{record.weight} kg</span>
                                                    </div>
                                                )}
                                                {record.height && (
                                                    <div className="bg-green-50 p-2 rounded">
                                                        <span className="text-gray-500">Chiều cao:</span>{' '}
                                                        <span className="font-medium">{record.height} cm</span>
                                                    </div>
                                                )}
                                                {record.bloodPressure?.systolic && (
                                                    <div className="bg-red-50 p-2 rounded">
                                                        <span className="text-gray-500">Huyết áp:</span>{' '}
                                                        <span className="font-medium">
                                                            {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                                                        </span>
                                                    </div>
                                                )}
                                                {record.heartRate && (
                                                    <div className="bg-pink-50 p-2 rounded">
                                                        <span className="text-gray-500">Nhịp tim:</span>{' '}
                                                        <span className="font-medium">{record.heartRate} bpm</span>
                                                    </div>
                                                )}
                                            </div>
                                            {record.note && (
                                                <p className="text-gray-600 mt-3 text-sm">
                                                    <span className="font-medium">Ghi chú:</span>{' '}
                                                    {highlightKeyword(record.note, keyword)}
                                                </p>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(page) => handleSearch(page)}
                                />
                            </div>
                        )}
                    </div>
                )
            ) : (
                // Gợi ý tìm kiếm
                <Card>
                    <div className="text-center py-8">
                        <FiSearch size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                            Nhập từ khóa để tìm kiếm
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Bạn có thể tìm kiếm trong lịch sử tư vấn hoặc hồ sơ sức khỏe
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['BMI', 'huyết áp', 'giảm cân', 'ngủ', 'tập thể dục'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setKeyword(term);
                                        handleSearch(1);
                                    }}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
