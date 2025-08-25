/**
 * Enhanced letter drafting tool with timeline integration
 */

import { Copy, Eye, FileText, RefreshCw, Save, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDrafts } from '../../hooks';
import { Event, LetterDraft } from '../../types';
import { TimelineView } from '../TimelineView';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

interface DraftingToolProps {
  onNavigate: (page: string) => void;
}

export const DraftingTool: React.FC<DraftingToolProps> = ({ onNavigate }) => {
  const { drafts, createDraft } = useDrafts();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<Partial<LetterDraft>>({
    subject: '',
    content: '',
    recipientType: 'NHAI',
    priority: 'medium',
    category: 'administrative',
    tags: [],
    status: 'draft'
  });

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentDraft.content && currentDraft.content.length > 10) {
        handleSaveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentDraft]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsTimelineModalOpen(false);
    
    // Pre-fill subject with reference to the event
    setCurrentDraft(prev => ({
      ...prev,
      referenceEventId: event.id,
      subject: `Re: ${event.subject}`,
      content: `\nReference: ${event.letterNo} dated ${new Date(event.date).toLocaleDateString()}\n\n${prev.content}`
    }));
  };

  const handleSaveDraft = async () => {
    try {
      const draftData: Omit<LetterDraft, 'id'> = {
        ...currentDraft,
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Omit<LetterDraft, 'id'>;

      await createDraft(draftData);
      // Show success notification
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handleSendLetter = async () => {
    try {
      // Implement sending logic here
      console.log('Sending letter:', currentDraft);
      // Show success notification
    } catch (error) {
      console.error('Failed to send letter:', error);
    }
  };

  const insertTemplate = (template: string) => {
    const templates = {
      greeting: 'Dear Sir/Madam,\n\n',
      closing: '\n\nThank you for your attention to this matter.\n\nBest regards,\n[Your Name]\n[Your Designation]',
      urgent: 'This is an urgent matter that requires immediate attention.',
      follow_up: 'We would like to follow up on our previous communication regarding this matter.'
    };
    
    setCurrentDraft(prev => ({
      ...prev,
      content: prev.content + templates[template as keyof typeof templates]
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Letter Drafting Tool</h1>
        <p className="text-gray-600">Create new communications with timeline reference</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Drafting Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Draft Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select
                  value={currentDraft.recipientType}
                  onChange={(e) => setCurrentDraft(prev => ({ 
                    ...prev, 
                    recipientType: e.target.value as 'Contractor' | 'NHAI' 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NHAI">NHAI</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={currentDraft.priority}
                  onChange={(e) => setCurrentDraft(prev => ({ 
                    ...prev, 
                    priority: e.target.value as any 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={currentDraft.subject}
                  onChange={(e) => setCurrentDraft(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter letter subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Letter Content</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimelineModalOpen(true)}
                  icon={RefreshCw}
                >
                  Reference Timeline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewModalOpen(true)}
                  icon={Eye}
                >
                  Preview
                </Button>
              </div>
            </div>

            {/* Template Shortcuts */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertTemplate('greeting')}
              >
                + Greeting
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertTemplate('urgent')}
              >
                + Urgent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertTemplate('follow_up')}
              >
                + Follow-up
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertTemplate('closing')}
              >
                + Closing
              </Button>
            </div>

            {/* Content Textarea */}
            <textarea
              value={currentDraft.content}
              onChange={(e) => setCurrentDraft(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Start drafting your letter here..."
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {currentDraft.content?.length || 0} characters
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  icon={Save}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendLetter}
                  icon={Send}
                >
                  Send Letter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reference Event */}
          {selectedEvent && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Referenced Event</h3>
              <div className="p-3 bg-blue-50 rounded border">
                <h4 className="font-medium text-blue-800 text-sm">{selectedEvent.subject}</h4>
                <p className="text-blue-600 text-xs mt-1">{selectedEvent.letterNo}</p>
                <p className="text-blue-600 text-xs">
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Recent Drafts */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Drafts</h3>
            <div className="space-y-2">
              {drafts.slice(0, 5).map((draft) => (
                <div key={draft.id} className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm truncate">{draft.subject}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => onNavigate('timeline')}
                icon={FileText}
              >
                View Full Timeline
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon={Copy}
              >
                Copy from Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Reference Modal */}
      <Modal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        title="Select Event to Reference"
        size="xl"
      >
        <div className="h-96 overflow-y-auto">
          <TimelineView 
            embedded={true}
            onEventClick={handleEventClick}
            showTitle={false}
          />
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Letter Preview"
        size="lg"
      >
        <div className="bg-gray-50 p-6 rounded border">
          <div className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <h3 className="font-bold text-lg">To: {currentDraft.recipientType}</h3>
              <h4 className="font-semibold text-md mt-2">Subject: {currentDraft.subject}</h4>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {currentDraft.content}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DraftingTool;