'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ContentList({ onEdit }) {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        contentId: null,
        contentTitle: ''
    });

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
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
        } catch (err) {
            console.error('Error deleting content:', err);
            toast.error('Failed to delete content: ' + err.message, { id: deleteToast });
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contents.map((content) => (
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
                        <p className="text-gray-600 text-sm mb-2">{content.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
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
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-gray-500">
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