import React, { useState } from "react";
import { CheckCircle, Lightbulb, Users, Send, Plus, Search, X } from "lucide-react";

// Letter interface for references
interface Letter {
  id: string;
  letterNo: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'draft' | 'sent' | 'received' | 'under_review' | 'resolved';
  assignee: string;
  attachments: string[];
  isOverdue?: boolean;
}

interface ScoreBarProps {
  label: string;
  score: number;
}

const CATEGORY_CONFIG = {
  Correctness: { colorBar: "bg-red-500", colorText: "text-red-500", icon: <CheckCircle size={16} className="text-red-500" /> },
  Clarity: { colorBar: "bg-blue-500", colorText: "text-blue-500", icon: <Lightbulb size={16} className="text-blue-500" /> },
  Engagement: { colorBar: "bg-green-500", colorText: "text-green-500", icon: <Users size={16} className="text-green-500" /> },
  Delivery: { colorBar: "bg-purple-500", colorText: "text-purple-500", icon: <Send size={16} className="text-purple-500" /> },
  Default: { colorBar: "bg-gray-500", colorText: "text-gray-500", icon: null },
};

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  const config = CATEGORY_CONFIG[label] || CATEGORY_CONFIG.Default;
  return (
    <div className="flex flex-col items-center w-24">
      {/* Label row: icon + text */}
      <span className={`mb-2 flex items-center gap-1 font-semibold text-sm ${config.colorText}`}>
        <span className="rounded-full bg-gray-100 p-1">{config.icon}</span>
        {label}
      </span>
      {/* Colored underline bar */}
      <div className="h-2 w-full rounded-full bg-gray-100 relative">
        <div
          className={`absolute left-0 top-0 h-2 rounded-full ${config.colorBar} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
      {/* Score number */}
      <span className={`mt-1 ${config.colorText} font-bold text-base`}>{score}</span>
    </div>
  );
};

interface EditorSidebarProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  legalScore: number;
  contractualScore: number;
  lexicalScore: number;
  grammaticalScore: number;
  citations: string[];
  availableLetters?: Letter[];
  referencedLetters?: Letter[];
  onAddReference?: (letter: Letter) => void;
  onRemoveReference?: (letterId: string) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  sidebarTab,
  setSidebarTab,
  legalScore,
  contractualScore,
  lexicalScore,
  grammaticalScore,
  citations,
  availableLetters = [],
  referencedLetters = [],
  onAddReference,
  onRemoveReference,
}) => {
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetterIds, setSelectedLetterIds] = useState<Set<string>>(new Set());

  // Filter available letters based on search query
  const filteredLetters = availableLetters.filter(letter =>
    letter.letterNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddReference = (letter: Letter) => {
    onAddReference?.(letter);
    setShowReferenceModal(false);
    setSearchQuery('');
    setSelectedLetterIds(new Set());
  };

  const handleCheckboxChange = (letterId: string, checked: boolean) => {
    const newSelected = new Set(selectedLetterIds);
    if (checked) {
      newSelected.add(letterId);
    } else {
      newSelected.delete(letterId);
    }
    setSelectedLetterIds(newSelected);
  };

  const handleSelectAll = () => {
    const availableIds = filteredLetters
      .filter(letter => !referencedLetters.some(ref => ref.id === letter.id))
      .map(letter => letter.id);
    
    if (selectedLetterIds.size === availableIds.length) {
      // Deselect all
      setSelectedLetterIds(new Set());
    } else {
      // Select all available
      setSelectedLetterIds(new Set(availableIds));
    }
  };

  const handleAddSelected = () => {
    const lettersToAdd = filteredLetters.filter(letter => selectedLetterIds.has(letter.id));
    lettersToAdd.forEach(letter => onAddReference?.(letter));
    setShowReferenceModal(false);
    setSearchQuery('');
    setSelectedLetterIds(new Set());
  };

  const closeModal = () => {
    setShowReferenceModal(false);
    setSearchQuery('');
    setSelectedLetterIds(new Set());
  };

  return (
    <div className="flex-1 bg-white border-l border-gray-200 overflow-y-auto" style={{ minWidth: "320px" }}>
      <div className="px-0 pt-0 pb-4">
        {/* Grammarly-style tab buttons */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSidebarTab("score")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              sidebarTab === "score"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            Score
          </button>
          <button
            onClick={() => setSidebarTab("citations")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              sidebarTab === "citations"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            Citations
          </button>
        </div>

        {/* Content */}
        {sidebarTab === "score" && (
          <div className="flex justify-between items-start gap-2 p-4">
            <ScoreBar label="Correctness" score={legalScore} />
            <ScoreBar label="Clarity" score={contractualScore} />
            <ScoreBar label="Engagement" score={lexicalScore} />
            <ScoreBar label="Delivery" score={grammaticalScore} />
          </div>
        )}

        {sidebarTab === "citations" && (
          <div className="p-4">
            {/* Letter References Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Letter References</h3>
                <button
                  onClick={() => setShowReferenceModal(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus size={14} />
                  Add Reference
                </button>
              </div>
              
              {referencedLetters.length > 0 ? (
                <div className="space-y-2">
                  {referencedLetters.map((letter) => (
                    <div key={letter.id} className="bg-gray-50 border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-blue-600">{letter.letterNo}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(letter.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 truncate" title={letter.subject}>
                            {letter.subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {letter.from} → {letter.to}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveReference?.(letter.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                          title="Remove reference"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No letter references added yet.
                </p>
              )}
            </div>

            {/* Legal Citations Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Legal Citations</h3>
              {citations.length > 0 ? (
                <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                  {citations.map((cite, idx) => (
                    <li key={idx}>{cite}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No legal citations found in the draft.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reference Selection Modal */}
      {showReferenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Add Letter Reference</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search letter to reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {filteredLetters.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {selectedLetterIds.size === filteredLetters.filter(letter => !referencedLetters.some(ref => ref.id === letter.id)).length 
                        ? 'Deselect All' 
                        : 'Select All'}
                    </button>
                    {selectedLetterIds.size > 0 && (
                      <span className="text-sm text-gray-600">
                        {selectedLetterIds.size} selected
                      </span>
                    )}
                  </div>
                  {selectedLetterIds.size > 0 && (
                    <button
                      onClick={handleAddSelected}
                      className="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Add Selected ({selectedLetterIds.size})
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Letters List */}
            <div className="max-h-96 overflow-y-auto p-4">
              {filteredLetters.length > 0 ? (
                <div className="space-y-2">
                  {filteredLetters.map((letter) => {
                    const isAlreadyReferenced = referencedLetters.some(ref => ref.id === letter.id);
                    const isSelected = selectedLetterIds.has(letter.id);
                    return (
                      <div
                        key={letter.id}
                        className={`border rounded-lg p-3 transition-colors ${
                          isAlreadyReferenced 
                            ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' 
                            : isSelected
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-blue-50 border-gray-200 hover:border-blue-300 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (!isAlreadyReferenced) {
                            handleCheckboxChange(letter.id, !isSelected);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          {!isAlreadyReferenced && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleCheckboxChange(letter.id, e.target.checked);
                              }}
                              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-blue-600">{letter.letterNo}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(letter.date).toLocaleDateString()}
                              </span>
                              {isAlreadyReferenced && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                  Already Referenced
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1" title={letter.subject}>
                              {letter.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {letter.from} → {letter.to}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {letter.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery ? 'No letters found matching your search.' : 'No letters available to reference.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;