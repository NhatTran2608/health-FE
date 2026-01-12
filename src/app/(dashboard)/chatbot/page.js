/**
 * ===================================
 * TRANG CHATBOT - TƯ VẤN SỨC KHỎE
 * ===================================
 * Giao diện chat với AI để tư vấn sức khỏe
 * Hiển thị lịch sử cuộc hội thoại
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    FiSend,
    FiTrash2,
    FiRefreshCw,
    FiMessageSquare,
    FiUser,
    FiCpu,
    FiClock,
    FiStar
} from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal } from '@/components';
import { chatbotService } from '@/services';
import { formatDate } from '@/utils';

export default function ChatbotPage() {
    // State quản lý tin nhắn
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    // State quản lý lịch sử
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // State modal xác nhận xóa
    const [showClearModal, setShowClearModal] = useState(false);

    // Ref để scroll xuống cuối chat
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll xuống cuối
    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }
    };

    // Scroll to bottom khi loading xong (initial load)
    useEffect(() => {
        if (!loading && messages.length > 0) {
            setTimeout(() => scrollToBottom(false), 100);
        }
    }, [loading]);

    // Lấy lịch sử chat khi load
    useEffect(() => {
        fetchHistory();
    }, []);

    /**
     * Lấy lịch sử chat
     */
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await chatbotService.getHistory({ limit: 50 });
            // BE trả về: { success, message, data: chats[], pagination }
            // => response.data là mảng chats
            if (response.data && response.data.length > 0) {
                // Backend trả về chats theo thứ tự mới nhất trước (createdAt: -1)
                // Cần reverse để có thứ tự cũ nhất trước, sau đó flatMap để có user -> bot
                const reversedData = [...response.data].reverse();
                const msgs = reversedData.flatMap(chat => [
                    { type: 'user', content: chat.question, time: chat.createdAt, id: chat._id },
                    { type: 'bot', content: chat.answer, time: chat.createdAt, rating: chat.rating, id: chat._id }
                ]);
                setMessages(msgs);
                setHistory(response.data);
            }
        } catch (error) {
            // Không hiện lỗi nếu chưa có lịch sử
        } finally {
            setLoading(false);
        }
    };

    /**
     * Gửi tin nhắn cho chatbot
     */
    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Thêm tin nhắn user vào danh sách
        setMessages(prev => [...prev, {
            type: 'user',
            content: userMessage,
            time: new Date().toISOString()
        }]);
        
        // Scroll to bottom khi user gửi tin nhắn
        setTimeout(() => scrollToBottom(true), 50);

        try {
            setSending(true);

            // Gọi API
            const response = await chatbotService.ask(userMessage);

            if (response.data) {
                // Thêm câu trả lời từ bot
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: response.data.answer,
                    time: new Date().toISOString(),
                    id: response.data._id
                }]);
                // Scroll to bottom sau khi bot trả lời
                setTimeout(() => scrollToBottom(true), 100);
            }
        } catch (error) {
            toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
            // Xóa tin nhắn user nếu lỗi
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    /**
     * Xử lý nhấn Enter để gửi
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /**
     * Đánh giá câu trả lời
     */
    const handleRate = async (chatId, rating) => {
        try {
            await chatbotService.rateResponse(chatId, rating);
            toast.success('Cảm ơn bạn đã đánh giá!');
            // Cập nhật rating trong messages
            setMessages(prev => prev.map(msg =>
                msg.id === chatId ? { ...msg, rating } : msg
            ));
        } catch (error) {
            toast.error('Không thể gửi đánh giá');
        }
    };

    /**
     * Xóa toàn bộ lịch sử
     */
    const handleClearHistory = async () => {
        try {
            await chatbotService.clearHistory();
            setMessages([]);
            setHistory([]);
            setShowClearModal(false);
            toast.success('Đã xóa lịch sử chat');
        } catch (error) {
            toast.error('Không thể xóa lịch sử');
        }
    };

    // Loading state
    if (loading) {
        return <Loading text="Đang tải cuộc trò chuyện..." />;
    }

    return (
        <div className="animate-fade-in h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tư vấn sức khỏe</h1>
                    <p className="text-gray-500">Hỏi đáp với trợ lý AI về sức khỏe</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        <FiClock /> Lịch sử
                    </Button>
                    {messages.length > 0 && (
                        <Button
                            variant="danger"
                            onClick={() => setShowClearModal(true)}
                        >
                            <FiTrash2 /> Xóa
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
                {/* Chat area */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden min-h-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <FiMessageSquare size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600">
                                    Bắt đầu cuộc trò chuyện
                                </h3>
                                <p className="text-gray-400 mt-2">
                                    Hãy hỏi bất kỳ điều gì về sức khỏe của bạn
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-2">
                                    {[
                                        'BMI của tôi có bình thường không?',
                                        'Làm sao để ngủ ngon hơn?',
                                        'Chế độ ăn giảm cân',
                                        'Cách tập thể dục hiệu quả'
                                    ].map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInputMessage(suggestion)}
                                            className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${msg.type === 'user'
                                            ? 'bg-primary-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                                            : 'bg-gray-100 text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl'
                                            } p-4`}
                                        >
                                            {/* Icon */}
                                            <div className="flex items-center gap-2 mb-2">
                                                {msg.type === 'user' ? (
                                                    <FiUser size={16} />
                                                ) : (
                                                    <FiCpu size={16} />
                                                )}
                                                <span className="text-xs opacity-75">
                                                    {msg.type === 'user' ? 'Bạn' : 'Trợ lý AI'}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <p className="whitespace-pre-wrap">{msg.content}</p>

                                            {/* Rating cho bot message */}
                                            {msg.type === 'bot' && msg.id && (
                                                <div className="mt-3 pt-2 border-t border-gray-200">
                                                    <span className="text-xs text-gray-500">Đánh giá:</span>
                                                    <div className="flex gap-1 mt-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => handleRate(msg.id, star)}
                                                                className={`p-1 ${msg.rating >= star
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-300 hover:text-yellow-400'
                                                                    }`}
                                                            >
                                                                <FiStar size={16} fill={msg.rating >= star ? 'currentColor' : 'none'} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {sending && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-xl p-4">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input area */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                rows="1"
                                disabled={sending}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!inputMessage.trim() || sending}
                                loading={sending}
                            >
                                <FiSend />
                            </Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Lưu ý: Đây chỉ là tư vấn tham khảo, không thay thế khám bác sĩ
                        </p>
                    </div>
                </div>

                {/* Sidebar lịch sử */}
                {showHistory && (
                    <Card className="w-80 overflow-hidden flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Lịch sử tư vấn</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {history.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">
                                    Chưa có lịch sử
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((chat) => (
                                        <div
                                            key={chat._id}
                                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        >
                                            <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                                {chat.question}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDate(chat.createdAt, 'datetime')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Modal xác nhận xóa */}
            <Modal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                title="Xác nhận xóa"
                size="sm"
            >
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setShowClearModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleClearHistory}>
                        Xóa tất cả
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
