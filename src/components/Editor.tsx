import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import EditorToolbar from './editor/EditorToolbar';
import EditorSidebar from "./editor/EditorSidebar";



// ScoreBar component with dynamic color
interface ScoreBarProps {
  label: string;
  score: number;
}


const getColor = (score: number) => {
  if (score > 90) return 'bg-green-500';
  if (score > 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => (
  <div className="flex flex-col items-center w-24">
    <span className="text-xs font-medium mb-1">{label}</span>
    <div className="w-full h-3 rounded-full bg-gray-200">
      <div className={`${getColor(score)} h-3 rounded-full transition-all duration-300`} style={{ width: `${score}%` }} />
    </div>
    <span className="text-xs mt-1">{score}</span>
  </div>
);

// Letter interface for reference context
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

// Draft interface for existing draft editing
interface Draft {
  id: string;
  draftName: string;
  description: string;
  subject: string;
  draftNumber: string;
  letterInReference: string;
  to: string;
  copyTo: string[];
  status: 'In Draft' | 'Published' | 'Sent for Review' | 'Approved' | 'Sent to Authority';
  createdDate: string;
  lastModified: string;
  content: string;
  createdBy: string;
}

export interface EditorProps {
  onNavigate?: (view: string) => void;
  onClose?: () => void;
  referenceLetter?: Letter | null;
  availableLetters?: Letter[];
  selectedDraft?: Draft | null;
}

const Editor: React.FC<EditorProps> = ({ onNavigate, onClose, referenceLetter, availableLetters = [], selectedDraft }) => {
  const [draft, setDraft] = useState<string>("");
  const [sidebarTab, setSidebarTab] = useState<string>("score");
  const [editorWidth, setEditorWidth] = useState<number>(window.innerWidth * 0.6);
  const isResizing = useRef(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentFont, setCurrentFont] = useState<string>('Times New Roman');
  const [currentSize, setCurrentSize] = useState<string>('14px');
  const [currentLineSpacing, setCurrentLineSpacing] = useState<string>('1.5');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courtFilter, setCourtFilter] = useState<string>('Court');
  const [notes, setNotes] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackLineIdx, setFeedbackLineIdx] = useState<number | null>(null);
  const [showPlus, setShowPlus] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(true);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [showOptionsBar, setShowOptionsBar] = useState<boolean>(true);
  const [bottomHover, setBottomHover] = useState<boolean>(false);

  // Summary modal state
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

    // Citations state
  const [citations, setCitations] = useState<string[]>([]);

  // Letter References state
  const [referencedLetters, setReferencedLetters] = useState<Letter[]>([]);

  // Regex patterns for citations
  const citationPatterns: RegExp[] = [
    /\b[A-Z][a-zA-Z]+ v\. [A-Z][a-zA-Z]+, \d+ [A-Z]+\.* \d+ \(\d{4}\)/g, // e.g., Brown v. Board, 347 U.S. 483 (1954)
    /\b\d+\s+U\.S\.C\. §\s*\d+[a-zA-Z0-9\-]*/g, // e.g., 42 U.S.C. § 1983
    /\bSection\s+\d+[A-Za-z]*\s+of\s+[A-Z][a-zA-Z ]+\,?\s*\d{4}/g, // e.g., Section 12 of Companies Act, 1956
  ];

  // Extract citations automatically when draft changes
  useEffect(() => {
    let found: string[] = [];
    citationPatterns.forEach((pattern) => {
      const matches = draft.match(pattern);
      if (matches) found = [...found, ...matches];
    });
    setCitations(found);
  }, [draft]);

  // New states for dynamic scores and suggestions
  const [legalScore, setLegalScore] = useState<number>(85);
  const [contractualScore, setContractualScore] = useState<number>(78);
  const [lexicalScore, setLexicalScore] = useState<number>(92);
  const [grammaticalScore, setGrammaticalScore] = useState<number>(95);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [grammarMatches, setGrammarMatches] = useState<any[]>([]);

  const fonts = [
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Courier New', label: 'Courier New' }
  ];

  const textSizes = [
    { value: '8px', label: '8' },
    { value: '9px', label: '9' },
    { value: '10px', label: '10' },
    { value: '11px', label: '11' },
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '28px', label: '28' },
    { value: '32px', label: '32' },
    { value: '36px', label: '36' },
    { value: '48px', label: '48' }
  ];

  const lineSpacings = [
    { value: '1', label: '1.0' },
    { value: '1.15', label: '1.15' },
    { value: '1.5', label: '1.5' },
    { value: '2', label: '2.0' },
    { value: '2.5', label: '2.5' },
    { value: '3', label: '3.0' }
  ];

  // Initialize editor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = '<div style="font-family: Times New Roman; font-size: 14px; line-height: 1.5;"><br></div>';
    }
  }, []);

  const saveState = () => {
    if (editorRef.current) {
      const currentState = editorRef.current.innerHTML;
      setUndoStack((prev: string[]) => [...prev.slice(-19), currentState]);
      setRedoStack([]);
    }
  };

  const formatText = (command: string, value?: string | null) => {
    if (!editorRef.current) return;
    saveState();
    editorRef.current.focus();
    try {
      switch (command) {
        case 'fontSize':
          if (value) setCurrentSize(value);
          document.execCommand('fontSize', false, '7');
          const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
          fontElements.forEach((font) => {
            const span = document.createElement('span');
            if (value) span.style.fontSize = value;
            span.innerHTML = (font as HTMLElement).innerHTML;
            const parent = (font as HTMLElement).parentNode;
            if (parent) parent.replaceChild(span, font);
          });
          break;
        case 'fontName':
          if (value) setCurrentFont(value);
          document.execCommand(command, false, value ?? undefined);
          break;
        case 'lineHeight':
          if (value) setCurrentLineSpacing(value);
          const selection = window.getSelection();
          if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const parentElement = (range.commonAncestorContainer.nodeType === Node.TEXT_NODE
              ? (range.commonAncestorContainer.parentNode as HTMLElement | null)
              : (range.commonAncestorContainer as HTMLElement));
            let targetElement = parentElement && parentElement.closest ? parentElement.closest('div, p') : parentElement;
            if (targetElement === editorRef.current) {
              targetElement = document.createElement('div');
              range.surroundContents(targetElement);
            }
            if (targetElement && value) (targetElement as HTMLElement).style.lineHeight = value;
          }
          break;
        case 'heading':
          document.execCommand('formatBlock', false, value ?? undefined);
          break;
        case 'superscript':
          document.execCommand('superscript', false);
          break;
        case 'subscript':
          document.execCommand('subscript', false);
          break;
        case 'removeFormat':
          document.execCommand('removeFormat', false);
          document.execCommand('unlink', false);
          break;
        case 'createLink':
          const url = prompt('Enter URL:');
          if (url) {
            document.execCommand('createLink', false, url);
          }
          break;
        default:
          document.execCommand(command, false, value ?? undefined);
      }
    } catch (error) {
      console.error('Format command failed:', error);
    }
    updateContent();
  };

  const undo = () => {
    if (undoStack.length > 0 && editorRef.current) {
      const currentState = editorRef.current.innerHTML;
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev: string[]) => [currentState, ...prev.slice(0, 19)]);
      setUndoStack((prev: string[]) => prev.slice(0, -1));
      editorRef.current.innerHTML = previousState;
      updateContent();
    }
  };

  const redo = () => {
    if (redoStack.length > 0 && editorRef.current) {
      const currentState = editorRef.current.innerHTML;
      const nextState = redoStack[0];
      setUndoStack((prev: string[]) => [...prev.slice(-19), currentState]);
      setRedoStack((prev: string[]) => prev.slice(1));
      editorRef.current.innerHTML = nextState;
      updateContent();
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
      const plainText = tempDiv.textContent || '';
    }
  };

  const updateLines = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
      const text = tempDiv.textContent || '';
      const splitLines = text.split(/\n+/).filter(l => l.trim() !== '');
      setLines(splitLines);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');
    if (htmlData) {
      const cleanHTML = htmlData
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '');
      const selection = window.getSelection();
      if (selection && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const fragment = range.createContextualFragment(cleanHTML);
        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if (textData) {
      const paragraphs = textData.split(/\n\n+/);
      const cleanHTML = paragraphs
        .map(paragraph => {
          const lines = paragraph.split('\n');
          const paragraphHTML = lines
            .map(line => line.trim())
            .filter(line => line)
            .join('<br>');
          if (paragraphHTML) {
            return `<div style="font-family: ${currentFont}; font-size: ${currentSize}; line-height: ${currentLineSpacing};">${paragraphHTML}</div>`;
          }
          return '';
        })
        .filter(html => html)
        .join('<div><br></div>');
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      selection.deleteFromDocument();
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(cleanHTML);
      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    updateContent();
    updateLines();
  };

  const handleSave = () => {
    console.log('Document saved');
    // Implement save functionality
  };

  // Resizer logic
  useEffect(() => {
    const container = document.querySelector('.flex.relative');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !container) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const sidebarWidth = 320; // Fixed sidebar width
      const resizerWidth = 32;
      const minWidth = Math.max(containerWidth * 0.3, 300); // 30% of container or 300px
      const maxWidth = containerWidth - sidebarWidth - resizerWidth;
      
      // Calculate new width relative to container
      const relativeX = e.clientX - containerRect.left;
      const newWidth = Math.max(minWidth, Math.min(relativeX, maxWidth));
      
      // Update width with smooth animation disabled during drag
      setEditorWidth(newWidth);
      
      // Prevent text selection during resize
      e.preventDefault();
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // New: Analyze the last line using LanguageTool API
  const analyzeLine = async (line: string) => {
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          text: line,
          language: 'en-US', // Adjust as needed
        }),
      });
      const data = await response.json();
      setGrammarMatches(data.matches);
      const errors = data.matches.length;
      const words = line.split(/\s+/).filter(w => w).length;
      const gramScore = Math.max(0, Math.min(100, 100 - (errors * 10))); // Arbitrary formula
      setGrammaticalScore(gramScore);

      // Suggestions from API
      const apiSuggestions = data.matches.map((m: any) => 
        `${m.context.text.substring(m.context.offset, m.context.offset + m.context.length)} → ${m.replacements[0]?.value || 'no suggestion'}: ${m.message}`
      );
      setSuggestions(apiSuggestions);

      // Lexical score: average word length
      const avgLength = words > 0 ? line.split(/\s+/).reduce((a, w) => a + w.length, 0) / words : 0;
      setLexicalScore(Math.max(0, Math.min(100, avgLength * 10)));

      // Mock contractual score: count common terms
      const contractualTerms = ['party', 'agreement', 'contract', 'shall', 'hereby'];
      const contractualCount = line.toLowerCase().split(/\s+/).filter(w => contractualTerms.includes(w)).length;
      setContractualScore(Math.max(0, Math.min(100, 50 + contractualCount * 10)));

      // Mock legal score: count common terms
      const legalTerms = ['court', 'law', 'statute', 'plaintiff', 'defendant'];
      const legalCount = line.toLowerCase().split(/\s+/).filter(w => legalTerms.includes(w)).length;
      setLegalScore(Math.max(0, Math.min(100, 50 + legalCount * 10)));

      setShowFeedback(true);
    } catch (error) {
      console.error('API error:', error);
      setSuggestions(['Error fetching suggestions. Try again.']);
      setShowFeedback(true);
    }
  };

  // New: Apply corrections to the line
  const applyCorrections = () => {
    if (!editorRef.current || feedbackLineIdx === null || grammarMatches.length === 0) {
      setShowFeedback(false);
      return;
    }

    // Get non-empty line elements
    const allChildren = Array.from(editorRef.current.children);
    const nonEmptyElements = allChildren.filter(child => (child.textContent || '').trim() !== '');
    if (feedbackLineIdx >= nonEmptyElements.length) {
      setShowFeedback(false);
      return;
    }

    const lineElement = nonEmptyElements[feedbackLineIdx] as HTMLElement;
    let lineText = lineElement.textContent || '';

    // Sort matches descending by offset to apply without shifting
    const sortedMatches = [...grammarMatches].sort((a, b) => b.offset - a.offset);

    for (const match of sortedMatches) {
      const start = match.offset;
      const end = start + match.length;
      const replacement = match.replacements[0]?.value || lineText.substring(start, end);
      lineText = lineText.substring(0, start) + replacement + lineText.substring(end);
    }

    // Set textContent (Note: this may lose inline formatting within the line)
    lineElement.textContent = lineText;

    setGrammarMatches([]);
    setShowFeedback(false);
    updateLines();
  };

  // Letter Reference handlers
  const handleAddReference = (letter: Letter) => {
    if (!referencedLetters.some(ref => ref.id === letter.id)) {
      setReferencedLetters(prev => [...prev, letter]);
    }
  };

  const handleRemoveReference = (letterId: string) => {
    setReferencedLetters(prev => prev.filter(ref => ref.id !== letterId));
  };

  // Generate mock summary for all selected letters
  const generateMockSummary = () => {
    // Combine reference letter (from table view) with referenced letters (from sidebar)
    const allLetters = [];
    if (referenceLetter) {
      allLetters.push(referenceLetter);
    }
    // Add referenced letters, but avoid duplicates
    referencedLetters.forEach(letter => {
      if (!referenceLetter || letter.id !== referenceLetter.id) {
        allLetters.push(letter);
      }
    });

    if (allLetters.length === 0) {
      return {
        totalLetters: 0,
        summaryText: "No letters selected for summary.",
        keyPoints: [],
        participants: [],
        timeline: [],
        letters: []
      };
    }

    const participants = Array.from(new Set([
      ...allLetters.map(letter => letter.from),
      ...allLetters.map(letter => letter.to)
    ]));

    const keyPoints = allLetters.length === 1 ? [
      "Single letter correspondence analysis",
      "Key participants and their roles identified", 
      "Subject matter and priority level assessed",
      "Status and timeline information reviewed",
      "Attachments and supporting documentation noted"
    ] : [
      "Multiple correspondence regarding contractual obligations and dispute resolution",
      "Escalation pattern observed from initial inquiry to formal legal notice",
      "Key issues include breach of contract terms and compensation disputes",
      "Timeline spans over several months with increasing urgency",
      "Multiple parties involved requiring coordinated response"
    ];

    const timeline = allLetters
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(letter => ({
        date: letter.date,
        event: `${letter.letterNo}: ${letter.subject}`,
        from: letter.from
      }));

    const summaryText = allLetters.length === 1 
      ? `This summary covers a single letter (${allLetters[0].letterNo}) from ${allLetters[0].from} to ${allLetters[0].to}. The correspondence relates to ${allLetters[0].subject.toLowerCase()} with ${allLetters[0].priority.toLowerCase()} priority and current status of ${allLetters[0].status.replace('_', ' ')}.`
      : `This correspondence sequence involves ${allLetters.length} letters exchanged between ${participants.length} parties. The communication flow demonstrates a structured legal process with clear escalation patterns and documented evidence of negotiations and dispute resolution attempts.`;

    return {
      totalLetters: allLetters.length,
      summaryText,
      keyPoints,
      participants,
      timeline,
      letters: allLetters
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex relative" style={{height: '100vh', overflow: 'hidden'}}>
        <div 
          className="flex-shrink-0 p-6 relative" 
          style={{
            width: editorWidth,
            minWidth: '30%',
            maxWidth: 'calc(100% - 350px)',
            transition: isResizing.current ? 'none' : 'width 0.1s ease',
            overflow: 'auto'
          }}>
          {/* Back to Timeline Navigation */}
          {(selectedDraft || referenceLetter) && onNavigate && (
            <div className="mb-3">
              <button
                onClick={() => onNavigate('timeline')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>Back to Timeline</span>
              </button>
            </div>
          )}

          {/* Draft/Reference Information - Collapsible */}
          {selectedDraft ? (
            <div className="bg-white border border-gray-200 rounded-lg mb-3 shadow-sm">
              {/* Header - Always Visible */}
              <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                <div className="flex items-center gap-3">
                  {/* Status Symbol */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg" title={`Status: ${selectedDraft.status}`}>
                      {selectedDraft.status === 'In Draft' ? '📝' :
                       selectedDraft.status === 'Published' ? '✅' :
                       selectedDraft.status === 'Sent for Review' ? '👁️' :
                       selectedDraft.status === 'Approved' ? '✔️' :
                       selectedDraft.status === 'Sent to Authority' ? '📤' : '📄'}
                    </span>
                    <span className="text-sm font-medium text-green-700">Draft</span>
                  </div>
                  
                  {/* Key Info in Header */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{selectedDraft.subject}</span>
                    <span>•</span>
                    <span>{new Date(selectedDraft.createdDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{selectedDraft.draftNumber}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Summary Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSummaryModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-50 font-medium"
                    title="View Summary of Referenced Letters"
                  >
                    Summary
                  </button>
                  {/* Close Button */}
                  {onClose && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded hover:bg-gray-100"
                      title="Back to Draft Management"
                    >
                      ✕
                    </button>
                  )}
                  {/* Expand/Collapse Icon */}
                  <span className="text-gray-400">
                    {isInfoExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isInfoExpanded && (
                <div className="border-t border-gray-100 p-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Draft Name:</label>
                      <input
                        type="text"
                        value={selectedDraft.draftName}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Draft No:</label>
                      <input
                        type="text"
                        value={selectedDraft.draftNumber}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">To:</label>
                      <input
                        type="text"
                        value={selectedDraft.to}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Reference:</label>
                      <input
                        type="text"
                        value={selectedDraft.letterInReference}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Status:</label>
                      <input
                        type="text"
                        value={selectedDraft.status}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Created By:</label>
                      <input
                        type="text"
                        value={selectedDraft.createdBy}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                      <textarea
                        value={selectedDraft.subject}
                        readOnly
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea
                        value={selectedDraft.description}
                        readOnly
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : referenceLetter && (
            <div className="bg-white border border-gray-200 rounded-lg mb-3 shadow-sm">
              {/* Header - Always Visible */}
              <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                <div className="flex items-center gap-3">
                  {/* Status Symbol */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="text-lg" title={`Status: ${referenceLetter.status}`}>
                        {referenceLetter.status === 'draft' ? '📝' :
                         referenceLetter.status === 'sent' ? '📤' :
                         referenceLetter.status === 'received' ? '📥' :
                         referenceLetter.status === 'under_review' ? '👁️' :
                         referenceLetter.status === 'resolved' ? '✅' : '📄'}
                      </span>
                      {referenceLetter.isOverdue && (
                        <span className="absolute -top-1 -right-1 text-red-500 text-xs">⚠️</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-blue-700">Reference</span>
                  </div>
                  
                  {/* Key Info in Header */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{referenceLetter.subject}</span>
                    <span>•</span>
                    <span>{new Date(referenceLetter.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{referenceLetter.letterNo}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Summary Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSummaryModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-50 font-medium"
                    title="View Summary of Referenced Letters"
                  >
                    Summary
                  </button>
                  {/* Close Button */}
                  {onClose && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded hover:bg-gray-100"
                      title="Back to Timeline"
                    >
                      ✕
                    </button>
                  )}
                  {/* Expand/Collapse Icon */}
                  <span className="text-gray-400">
                    {isInfoExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isInfoExpanded && (
                <div className="border-t border-gray-100 p-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Letter No:</label>
                      <input
                        type="text"
                        value={referenceLetter.letterNo}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Date:</label>
                      <input
                        type="text"
                        value={new Date(referenceLetter.date).toLocaleDateString()}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">From:</label>
                      <input
                        type="text"
                        value={referenceLetter.from}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">To:</label>
                      <input
                        type="text"
                        value={referenceLetter.to}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Priority:</label>
                      <input
                        type="text"
                        value={referenceLetter.priority}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Assignee:</label>
                      <input
                        type="text"
                        value={referenceLetter.assignee}
                        readOnly
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                      <textarea
                        value={referenceLetter.subject}
                        readOnly
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea
                        value={referenceLetter.description}
                        readOnly
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white resize-none"
                      />
                    </div>
                    {referenceLetter.attachments.length > 0 && (
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-gray-500 w-20 flex-shrink-0">Attachments:</label>
                        <input
                          type="text"
                          value={referenceLetter.attachments.join(', ')}
                          readOnly
                          className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <EditorToolbar
            currentFont={currentFont}
            currentSize={currentSize}
            currentLineSpacing={currentLineSpacing}
            fonts={fonts}
            textSizes={textSizes}
            lineSpacings={lineSpacings}
            formatText={formatText}
            undo={undo}
            redo={redo}
            undoStack={undoStack}
            redoStack={redoStack}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onSave={handleSave}
          />

          <div className="bg-white rounded-lg shadow-sm border relative">
            <style dangerouslySetInnerHTML={{ __html: `
              [contenteditable] {
                outline: none;
              }
              [contenteditable]:empty:before {
                content: "Start typing your legal document...";
                color: #9ca3af;
                font-style: italic;
              }
            `}} />
            {/* Editable area with feedback prompt after Enter */}
            <div
              className="w-full min-h-screen p-8 focus:outline-none relative"
              style={{ fontFamily: currentFont, fontSize: currentSize, lineHeight: currentLineSpacing }}
              onMouseEnter={() => setShowPlus(true)}
              onMouseLeave={() => setShowPlus(false)}
            >
              {/* Plus icon on left edge */}
              {showPlus && !showPrompt && (
                <button
                  className="absolute left-0 top-8 bg-white border border-gray-300 rounded-full shadow-lg w-10 h-10 flex items-center justify-center z-50 hover:bg-blue-50 transition"
                  style={{ transform: 'translateX(-50%)' }}
                  onClick={() => setShowPrompt(true)}
                  title="Show writing options"
                >
                  <span className="text-2xl text-blue-600 font-bold">+</span>
                </button>
              )}
              {/* Editor contentEditable */}
              <div
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={e => {
                  updateLines();
                  setIsWriting(true);
                  setShowOptionsBar(false);
                }}
                onKeyDown={e => {
                  setIsWriting(true);
                  setShowOptionsBar(false);
                  
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const lastLineIdx = lines.length - 1;
                    setFeedbackLineIdx(lastLineIdx);
                    const lastLine = lines[lastLineIdx] || '';
                    if (lastLine.trim()) {
                      analyzeLine(lastLine);
                    } else {
                      setShowFeedback(false);
                    }
                    document.execCommand('insertHTML', false, '<div><br></div>');
                    updateLines();
                  }
                }}
                onFocus={() => {
                  setIsWriting(true);
                  setShowOptionsBar(false);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsWriting(false);
                  }, 2000); // Delay before showing options bar again
                }}
                className="w-full min-h-screen"
                spellCheck="true"
              />
              {/* Writing options prompt */}
              {showPrompt && (
                <div
                  className="absolute left-0 top-8 bg-white rounded-xl shadow-2xl z-50 w-[420px] border"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                >
                  {/* Top bar with input and icon */}
                  <div className="flex items-center px-6 pt-6 pb-2">
                    <input
                      type="text"
                      placeholder="what you want to do ..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                      style={{ fontWeight: 500 }}
                    />
                    <button className="ml-3 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:bg-blue-50 transition">
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M4 12v-2a4 4 0 014-4h6a4 4 0 014 4v2"/><path d="M12 16v-4"/><path d="M8 16v-4"/><path d="M16 16v-4"/></svg>
                    </button>
                  </div>
                  {/* Scrollable options card */}
                  <div className="max-h-[320px] overflow-y-auto px-2 pb-2">
                    <div className="pt-2 pb-1 px-4 text-gray-700 font-semibold text-[15px]">Get started</div>
                    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 mr-2"><path d="M12 20h9"/><path d="M19 20V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                      <span className="font-medium">Draft an outline</span>
                      <span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Updated</span>
                    </div>
                    <div className="pt-2 pb-1 px-4 text-gray-700 font-semibold text-[15px]">Write</div>
                    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 mr-2"><path d="M12 20h9"/><path d="M19 20V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                      <span className="font-medium">Write a paragraph on</span>
                    </div>
                    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 mr-2"><path d="M12 20h9"/><path d="M19 20V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                      <span className="font-medium">Extract key takeaways</span>
                    </div>
                    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 mr-2"><path d="M12 20h9"/><path d="M19 20V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                      <span className="font-medium">Use notes and develop a structure</span>
                    </div>
                    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 mr-2"><path d="M12 20h9"/><path d="M19 20V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                      <span className="font-medium">More ideas</span>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                  <div className="p-2 flex justify-end">
                    <button className="px-4 py-2 bg-gray-200 rounded text-gray-700 font-medium" onClick={() => setShowPrompt(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
            {/* Feedback prompt, shown only after Enter - updated look */}
            {showFeedback && feedbackLineIdx !== null && lines[feedbackLineIdx] && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 top-24 w-[420px] bg-white border rounded-2xl shadow-xl z-50 p-6 transition-all duration-300 ease-in-out"
                style={{ pointerEvents: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                onClick={(e) => e.stopPropagation()} // Prevent close on card click
              >
                <button 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowFeedback(false)}
                >
                  ×
                </button>
                <div className="flex gap-4 mb-4 justify-center">
                  <ScoreBar label="Legal" score={legalScore} />
                  <ScoreBar label="Contractual" score={contractualScore} />
                  <ScoreBar label="Lexical" score={lexicalScore} />
                  <ScoreBar label="Grammatical" score={grammaticalScore} />
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-800">Suggestions:</span>
                  <ul className="list-disc ml-6 mt-2 text-sm text-gray-700 space-y-1">
                    {suggestions.length > 0 ? (
                      suggestions.map((sugg, idx) => (
                        <li key={idx}>{sugg}</li>
                      ))
                    ) : (
                      <li>No suggestions available.</li>
                    )}
                  </ul>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition" onClick={applyCorrections}>Accept</button>
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition" onClick={() => setShowFeedback(false)}>Dismiss</button>
                </div>
              </div>
            )}
            {/* Bottom hover area */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-24 z-10"
              onMouseEnter={() => setBottomHover(true)}
              onMouseLeave={() => setBottomHover(false)}
            />
            
            {/* Perpetual options bar */}
            <div
              className={`sticky bottom-12 flex justify-center gap-4 p-4 bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
                (isWriting && !bottomHover) ? 'opacity-0 translate-y-full pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'
              }`}
              style={{ 
                transform: (isWriting && !bottomHover) ? 'translateY(100%)' : 'translateY(0)',
              }}
              onMouseEnter={() => {
                setShowOptionsBar(true);
                setBottomHover(true);
              }}
              onMouseLeave={() => {
                if (isWriting) {
                  setShowOptionsBar(false);
                }
                setBottomHover(false);
              }}
            >
              <button className="bg-blue-50 text-blue-900 px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 text-base font-medium hover:bg-blue-100 transition">
                <span role="img" aria-label="AI">🪄</span> Write Draft with AI
              </button>
              <button className="bg-blue-50 text-blue-900 px-6 py-3 rounded-xl shadow-sm text-base font-medium hover:bg-blue-100 transition">
                Create Arguments
              </button>
              <button className="bg-blue-50 text-blue-900 px-6 py-3 rounded-xl shadow-sm text-base font-medium hover:bg-blue-100 transition">
                Create an Draft Outline
              </button>
              <button className="bg-blue-50 text-blue-900 px-6 py-3 rounded-xl shadow-sm text-base font-medium hover:bg-blue-100 transition">
                Ask a 'Research' Question
              </button>
              <button className="bg-blue-50 text-blue-900 px-6 py-3 rounded-xl shadow-sm text-base font-medium hover:bg-blue-100 transition">
                <span role="img" aria-label="PDF">↗</span> Chat with PDF
              </button>
            </div>
          </div>
        </div>

        {/* Industry standard resizer handle */}
        <div
          className="group flex items-center justify-center"
          style={{ width: 32, cursor: 'col-resize', zIndex: 10, position: 'relative', background: 'transparent' }}
          onMouseDown={() => { 
            isResizing.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        >
          <div
            className="transition-all duration-150 bg-gray-200 group-hover:bg-blue-200 rounded-full flex items-center justify-center shadow-sm"
            style={{ width: 20, height: 48 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="10" x2="16" y2="10" />
              <polyline points="8 6 4 10 8 14" />
              <polyline points="12 6 16 10 12 14" />
            </svg>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-1 bg-white border-l border-gray-200 overflow-y-auto" style={{ minWidth: '320px' }}>
        
        <EditorSidebar
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            legalScore={legalScore}
            contractualScore={contractualScore}
            lexicalScore={lexicalScore}
            grammaticalScore={grammaticalScore}
            citations={citations}
            availableLetters={availableLetters}
            referencedLetters={referencedLetters}
            onAddReference={handleAddReference}
            onRemoveReference={handleRemoveReference}
        />
        </div>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Letters Summary</h2>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {(() => {
                const summary = generateMockSummary();
                return (
                  <div className="space-y-6">
                    {/* Overview */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Overview</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-blue-600">{summary.totalLetters}</div>
                          <div className="text-sm text-gray-600">Total Letters</div>
                        </div>
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-green-600">{summary.participants.length}</div>
                          <div className="text-sm text-gray-600">Participants</div>
                        </div>
                      </div>
                      <p className="text-gray-700">{summary.summaryText}</p>
                    </div>

                    {/* Participants */}
                    {summary.participants.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Participants</h3>
                        <div className="flex flex-wrap gap-2">
                          {summary.participants.map((participant, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {participant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Points */}
                    {summary.keyPoints.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Points</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {summary.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Timeline */}
                    {summary.timeline.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h3>
                        <div className="space-y-3">
                          {summary.timeline.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded min-w-[80px] text-center">
                                {new Date(item.date).toLocaleDateString()}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.event}</div>
                                <div className="text-sm text-gray-600">From: {item.from}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Referenced Letters Details */}
                    {summary.letters.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {summary.letters.length === 1 ? 'Letter Details' : 'Referenced Letters'}
                        </h3>
                        <div className="space-y-3">
                          {summary.letters.map((letter) => (
                            <div key={letter.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-blue-600">{letter.letterNo}</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(letter.date).toLocaleDateString()}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    letter.priority === 'High' ? 'bg-red-100 text-red-800' :
                                    letter.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {letter.priority}
                                  </span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  letter.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  letter.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {letter.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">{letter.subject}</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                From: {letter.from} → To: {letter.to}
                              </p>
                              <p className="text-sm text-gray-700">{letter.description}</p>
                              {letter.attachments.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-gray-500">Attachments: </span>
                                  <span className="text-xs text-gray-600">{letter.attachments.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Editor;