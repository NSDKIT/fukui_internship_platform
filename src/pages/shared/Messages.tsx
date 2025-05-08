import React, { useState, useEffect } from 'react';
import { Search, Send, User } from 'lucide-react';
import { Message } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Messages: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const contacts = [
    { id: 'u1', name: 'テックコープ株式会社', lastMessage: '応募ありがとうございます...', time: '2時間前' },
    { id: 'u2', name: 'データフロー・アナリティクス', lastMessage: '面接の日程を調整させていただきたく...', time: '1日前' },
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Simulate API call
        const mockMessages: Message[] = [
          {
            id: 'm1',
            senderId: 'u1',
            receiverId: 'current_user',
            content: '当社のフロントエンド開発インターンシップへのご応募ありがとうございます。',
            isRead: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
        ];

        // Simulate loading delay
        setTimeout(() => {
          setMessages(mockMessages);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('メッセージの取得に失敗:', error);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    // In a real app, this would be an API call
    const newMessageObj: Message = {
      id: `m${Date.now()}`,
      senderId: 'current_user',
      receiverId: selectedContact,
      content: newMessage,
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 24) {
      return hours === 0 ? 'たった今' : `${hours}時間前`;
    } else {
      return `${days}日前`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 divide-x h-[calc(100vh-12rem)]">
            {/* Contacts List */}
            <div className="col-span-4 flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="メッセージを検索"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      selectedContact === contact.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {contact.name}
                          </h3>
                          <span className="text-xs text-gray-500">{contact.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}

                {filteredContacts.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    会話が見つかりません
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="col-span-8 flex flex-col">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {contacts.find(c => c.id === selectedContact)?.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages
                      .filter(m => 
                        (m.senderId === selectedContact && m.receiverId === 'current_user') ||
                        (m.senderId === 'current_user' && m.receiverId === selectedContact)
                      )
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.senderId === 'current_user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'current_user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      会話を選択してください
                    </h3>
                    <p className="mt-1 text-gray-500">
                      メッセージを開始するには連絡先を選択してください
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;