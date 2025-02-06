'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Link, Wallet, AlertCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const CreateContentModal = ({ isOpen, onClose, onContentCreated, editingContent }) => {
  const initialFormState = {
    title: '',
    description: '',
    contentType: 'article',
    contentURL: '',
    thumbnailURL: '',
    creatorWallet: '',
    subscriptionTier: 'free',
    price: 0,
    categories: [],
    isPublished: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when editing content
  useEffect(() => {
    if (editingContent) {
      setFormData({
        title: editingContent.title || '',
        description: editingContent.description || '',
        contentType: editingContent.contentType || 'article',
        contentURL: editingContent.contentURL || '',
        thumbnailURL: editingContent.thumbnailURL || '',
        creatorWallet: editingContent.creatorWallet || '',
        subscriptionTier: editingContent.subscriptionTier || 'free',
        price: editingContent.price || 0,
        categories: editingContent.categories || [],
        isPublished: editingContent.isPublished || false
      });
      // Reset touched and errors state when editing
      setTouched({});
      setErrors({});
    } else {
      setFormData(initialFormState);
    }
  }, [editingContent]);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value?.trim()) return 'Title is required';
        if (value.length < 3) return 'Title must be at least 3 characters';
        if (value.length > 100) return 'Title must be less than 100 characters';
        return '';
      case 'description':
        if (!value?.trim()) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters';
        if (value.length > 500) return 'Description must be less than 500 characters';
        return '';
      case 'contentURL':
        if (!value?.trim()) return 'Content URL is required';
        try {
          new URL(value);
          return '';
        } catch {
          return 'Please enter a valid URL';
        }
      case 'thumbnailURL':
        if (!value) return '';
        try {
          new URL(value);
          return '';
        } catch {
          return 'Please enter a valid URL';
        }
      case 'creatorWallet':
        if (!value?.trim()) return 'Creator wallet is required';
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return 'Please enter a valid Ethereum address';
        }
        return '';
      case 'price':
        if (formData.subscriptionTier !== 'free') {
          if (!value && value !== 0) return 'Price is required for paid content';
          if (value < 0) return 'Price cannot be negative';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, newValue)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setError('');
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const touchedFields = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }), {}
    );
    setTouched(touchedFields);
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    const submitToast = toast.loading(editingContent ? 'Updating content...' : 'Creating content...');

    try {
      const url = editingContent 
        ? `/api/content/${editingContent._id}`
        : '/api/content';

      const method = editingContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save content');
      }

      toast.success(editingContent ? 'Content updated successfully!' : 'Content created successfully!', { id: submitToast });
      resetForm();
      onContentCreated(data.data);
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(error.message, { id: submitToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900">
                    {editingContent ? 'Edit Content' : 'Create New Content'}
                  </Dialog.Title>
                  <button
                  onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                      <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border text-gray-900 ${
                        errors.title && touched.title
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="Enter content title"
                    />
                    {errors.title && touched.title && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.title}
                    </p>
                  )}
                  </div>
                
                {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                      <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border text-gray-900 ${
                        errors.description && touched.description
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="Enter content description"
                    />
                    {errors.description && touched.description && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.description}
                    </p>
                  )}
                  </div>

                  {/* Content Type and Subscription Tier */}
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content Type
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    <select
                        name="contentType"
                      value={formData.contentType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="course">Course</option>
                        <option value="image">Image</option>
                    </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subscription Tier
                      </label>
                    <select
                        name="subscriptionTier"
                      value={formData.subscriptionTier}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                    </select>
                    </div>
                  </div>

                  {/* URLs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content URL
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                          type="url"
                          name="contentURL"
                          value={formData.contentURL}
                      onChange={handleChange}
                      onBlur={handleBlur}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-gray-900 ${
                            errors.contentURL && touched.contentURL
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="https://example.com/content"
                        />
                      </div>
                      {errors.contentURL && touched.contentURL && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                          {errors.contentURL}
                      </p>
                    )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail URL
                  </label>
                  <div className="relative">
                        <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="url"
                      name="thumbnailURL"
                      value={formData.thumbnailURL}
                      onChange={handleChange}
                      onBlur={handleBlur}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-gray-900 ${
                            errors.thumbnailURL && touched.thumbnailURL
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                      {errors.thumbnailURL && touched.thumbnailURL && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.thumbnailURL}
                    </p>
                  )}
                    </div>
                  </div>

                  {/* Creator Wallet and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Creator Wallet
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="creatorWallet"
                        value={formData.creatorWallet}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 rounded-lg border text-gray-900 ${
                          errors.creatorWallet && touched.creatorWallet
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 transition-colors`}
                        placeholder="0x..."
                      />
                      {errors.creatorWallet && touched.creatorWallet && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.creatorWallet}
                      </p>
                    )}
                  </div>

                   {formData.subscriptionTier !== 'free' && <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price {formData.subscriptionTier !== 'free' && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-2 rounded-lg border text-gray-900 ${
                          errors.price && touched.price
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 transition-colors`}
                        placeholder="0.00"
                      />
                      {errors.price && touched.price && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.price}
                        </p>
                      )}
                    </div>}
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['NFT', 'DeFi', 'Gaming', 'Metaverse', 'Web3', 'Blockchain', 'Crypto'].map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryChange(category)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                            formData.categories.includes(category)
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Tag size={14} className="mr-1" />
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Publish Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Publish immediately
                    </label>
              </div>

              {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                    type="button"
                    onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      disabled={loading}
                  >
                    Cancel
                    </button>
                    <button
                    type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {editingContent ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingContent ? 'Update Content' : 'Create Content'
                      )}
                    </button>
                </div>
            </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateContentModal; 