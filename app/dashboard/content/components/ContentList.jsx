'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ContentList({ searchQuery, onEdit, onDelete, refreshTrigger }) {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        contentId: null,
        contentTitle: ''
    });

    const fetchContents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/content');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch contents');
            }

            setContents(data.data);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch contents');
        } finally {
            setLoading(false);
        }
    };

    // Fetch contents on mount and when refreshTrigger changes
    useEffect(() => {
        fetchContents();
    }, [refreshTrigger]);

    const filteredContents = contents.filter(content => {
        if (!searchQuery) return true;
        
        const searchLower = searchQuery.toLowerCase();
        return (
            content.title.toLowerCase().includes(searchLower) ||
            content.description.toLowerCase().includes(searchLower) ||
            content.contentType.toLowerCase().includes(searchLower) ||
            content.subscriptionTier.toLowerCase().includes(searchLower) ||
            content.categories.some(category => 
                category.toLowerCase().includes(searchLower)
            )
        );
    });

    const openDeleteModal = (id, title) => {
        setDeleteModal({
            isOpen: true,
            contentId: id,
            contentTitle: title
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            contentId: null,
            contentTitle: ''
        });
    };

    const handleDelete = async () => {
        const { contentId } = deleteModal;
        const deleteToast = toast.loading('Deleting content...');

        try {
            const response = await fetch(`/api/content/${contentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete content');
            }

            setContents(prev => prev.filter(content => content._id !== contentId));
            toast.success('Content deleted successfully', { id: deleteToast });
            closeDeleteModal();
            onDelete(); // Notify parent component about deletion
        } catch (err) {
            console.error('Error deleting content:', err);
            toast.error('Failed to delete content: ' + err.message, { id: deleteToast });
        }
    };

    if (loading) return (
        <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-900">Loading contents...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
        </div>
    );

    if (filteredContents.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-900 text-lg">
                    {searchQuery 
                        ? `No contents found matching "${searchQuery}"`
                        : 'No contents available'
                    }
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredContents.map((content) => (
                    <div 
                        key={content._id} 
                        className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                        {content.thumbnailURL && (
                            <img 
                                src={content.thumbnailURL} 
                                alt={content.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                        )}
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{content.title}</h3>
                        <p className="text-gray-700 text-sm mb-2 line-clamp-2">{content.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                content.contentType === 'video' ? 'bg-blue-100 text-blue-800' :
                                content.contentType === 'article' ? 'bg-green-100 text-green-800' :
                                content.contentType === 'course' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {content.contentType}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                content.subscriptionTier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                                content.subscriptionTier === 'basic' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {content.subscriptionTier}
                            </span>
                            {content.categories.slice(0, 2).map((category, index) => (
                                <span key={index} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                    {category}
                                </span>
                            ))}
                            {content.categories.length > 2 && (
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                    +{content.categories.length - 2}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-gray-700">
                                {new Date(content.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.open(content.contentURL, '_blank')}
                                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                    title="View Content"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => onEdit(content)}
                                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                    title="Edit Content"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(content._id, content.title)}
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                    title="Delete Content"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title={deleteModal.contentTitle}
            />
        </>
    );
} 