'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Link, Wallet, AlertCircle, Tag, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';

const CreateContentModal = ({ isOpen, onClose, onContentCreated, editingContent }) => {
  const initialFormState = {
    title: '',
    description: '',
    contentType: 'article',
    subscriptionTier: 'free',
    price: 0,
    categories: [],
    isPublished: false,
    creatorWallet: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [contentFile, setContentFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
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
        subscriptionTier: editingContent.subscriptionTier || 'free',
        price: editingContent.price || 0,
        categories: editingContent.categories || [],
        isPublished: editingContent.isPublished || false,
        creatorWallet: editingContent.creatorWallet || ''
      });
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
      case 'contentFile':
        if (!editingContent && !value) return 'Content file is required';
        return '';
      case 'price':
        if (formData.subscriptionTier !== 'free') {
          if (!value && value !== 0) return 'Price is required for paid content';
          if (value < 0) return 'Price cannot be negative';
        }
        return '';
      case 'creatorWallet':
        if (!value?.trim()) return 'Creator wallet is required';
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return 'Please enter a valid Ethereum address';
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (type === 'content') {
      if (formData.contentType === 'video' && !file.type.includes('video')) {
        toast.error('Please upload a valid video file');
        return;
      }
      if (formData.contentType === 'image' && !file.type.includes('image')) {
        toast.error('Please upload a valid image file');
        return;
      }
      setContentFile(file);
    } else {
      if (!file.type.includes('image')) {
        toast.error('Please upload a valid image file for thumbnail');
        return;
      }
      setThumbnailFile(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL,
        formData
      );
console.log(response)
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields
      const newErrors = {};
      Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      });

      if (!editingContent && !contentFile) {
        newErrors.contentFile = 'Content file is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      let contentURL = editingContent?.contentURL;
      let thumbnailURL = editingContent?.thumbnailURL;

      // Upload content file if provided
      if (contentFile) {
        contentURL = await uploadToCloudinary(contentFile);
      }

      // Upload thumbnail if provided
      if (thumbnailFile) {
        thumbnailURL = await uploadToCloudinary(thumbnailFile);
      }

      // Get user info from localStorage
      const userName = localStorage.getItem('userName') || 'Anonymous';

      // Prepare final data
      const finalData = {
        ...formData,
        contentURL,
        thumbnailURL,
        creator: {
          name: userName,
          creatorWallet: formData.creatorWallet,
          image: localStorage.getItem('userImage') || '',
          bio: localStorage.getItem('userBio') || '',
          socialLinks: {
            twitter: localStorage.getItem('userTwitter') || '',
            github: localStorage.getItem('userGithub') || '',
            website: localStorage.getItem('userWebsite') || ''
          }
        }
      };

      // Create or update content
      const url = editingContent ? `/api/content/${editingContent._id}` : '/api/content';
      const method = editingContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save content');
      }

      toast.success(editingContent ? 'Content updated successfully!' : 'Content created successfully!');
      resetForm();
      onContentCreated(data.data);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setContentFile(null);
    setThumbnailFile(null);
    setError('');
    setLoading(false);
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

                  {/* Content File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content File
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, 'content')}
                              accept={formData.contentType === 'video' ? 'video/*' : 'image/*'}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formData.contentType === 'video' ? 'MP4, WebM up to 100MB' : 'PNG, JPG, GIF up to 10MB'}
                        </p>
                        {contentFile && (
                          <p className="text-sm text-green-600">Selected: {contentFile.name}</p>
                        )}
                      </div>
                    </div>
                    {errors.contentFile && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.contentFile}
                      </p>
                    )}
                  </div>

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail Image (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a thumbnail</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, 'thumbnail')}
                              accept="image/*"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        {thumbnailFile && (
                          <p className="text-sm text-green-600">Selected: {thumbnailFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Creator Wallet and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Creator Wallet
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="creatorWallet"
                          value={formData.creatorWallet}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-gray-900 ${
                            errors.creatorWallet && touched.creatorWallet
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="0x..."
                        />
                      </div>
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
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          {editingContent ? 'Updating...' : 'Creating...'}
                        </>
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