/**
 * Event creation and editing form component
 */

import { Calendar, FileText, Upload, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { Event, EventCategory, Priority } from '../../types';
import { validateDate, validateLetterNumber, validateRequired } from '../../utils/validators';
import { Button } from '../UI/Button';

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: Omit<Event, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    from: event?.from || 'Contractor' as 'Contractor' | 'NHAI',
    to: event?.to || 'NHAI' as 'Contractor' | 'NHAI',
    date: event?.date || new Date().toISOString().split('T')[0],
    letterNo: event?.letterNo || '',
    subject: event?.subject || '',
    description: event?.description || '',
    assignee: event?.assignee || '',
    priority: event?.priority || 'medium' as Priority,
    category: event?.category || 'administrative' as EventCategory,
    contractDeadline: event?.contractDeadline || '',
    tags: event?.tags?.join(', ') || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.letterNo)) {
      newErrors.letterNo = 'Letter number is required';
    } else if (!validateLetterNumber(formData.letterNo)) {
      newErrors.letterNo = 'Invalid letter number format (e.g., ABC/LET/001)';
    }

    if (!validateRequired(formData.subject)) {
      newErrors.subject = 'Subject is required';
    }

    if (!validateRequired(formData.description)) {
      newErrors.description = 'Description is required';
    }

    if (!validateRequired(formData.assignee)) {
      newErrors.assignee = 'Assignee is required';
    }

    if (!validateDate(formData.date)) {
      newErrors.date = 'Invalid date';
    }

    if (formData.contractDeadline && !validateDate(formData.contractDeadline)) {
      newErrors.contractDeadline = 'Invalid deadline date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const eventData: Omit<Event, 'id'> = {
      ...formData,
      attachments: attachments.map(file => file.name),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isOverdue: formData.contractDeadline ? new Date(formData.contractDeadline) < new Date() : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await onSubmit(eventData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From/To Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <select
            value={formData.from}
            onChange={(e) => {
              const from = e.target.value as 'Contractor' | 'NHAI';
              handleInputChange('from', from);
              handleInputChange('to', from === 'Contractor' ? 'NHAI' : 'Contractor');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Contractor">Contractor</option>
            <option value="NHAI">NHAI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <input
            type="text"
            value={formData.to}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Letter Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Letter Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.letterNo}
            onChange={(e) => handleInputChange('letterNo', e.target.value)}
            placeholder="ABC/LET/001"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.letterNo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.letterNo && <p className="text-red-500 text-xs mt-1">{errors.letterNo}</p>}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="administrative">Administrative</option>
            <option value="technical">Technical</option>
            <option value="financial">Financial</option>
            <option value="contract">Contract</option>
            <option value="safety">Safety</option>
            <option value="environmental">Environmental</option>
            <option value="quality">Quality</option>
            <option value="legal">Legal</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Contract Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Deadline
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={formData.contractDeadline}
              onChange={(e) => handleInputChange('contractDeadline', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contractDeadline ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.contractDeadline && <p className="text-red-500 text-xs mt-1">{errors.contractDeadline}</p>}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignee <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              placeholder="Project Manager - John Doe"
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assignee ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.assignee && <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          placeholder="Enter the subject of the communication"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Provide detailed description of the communication"
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder="Enter tags separated by commas (e.g., urgent, contract, review)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-gray-500 text-xs mt-1">Separate multiple tags with commas</p>
      </div>

      {/* File Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload files or drag and drop
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB each
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Attachment List */}
        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;