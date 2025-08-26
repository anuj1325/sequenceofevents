import React from 'react';
import { 
  ChevronDown, Link, List, ListOrdered, AlignLeft, AlignCenter, 
  AlignRight, Undo, Redo, Save 
} from 'lucide-react';
import { EditorToolbarProps } from '../../types'

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  currentFont, 
  currentSize, 
  currentLineSpacing, 
  fonts, 
  textSizes, 
  lineSpacings,
  formatText,
  undo,
  redo,
  undoStack,
  redoStack,
  onSave
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Font Selection */}
        <div className="relative">
          <select
            value={currentFont}
            onChange={(e) => formatText('fontName', e.target.value)}
            className="px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer min-w-[140px] text-gray-600"
          >
            <option value="">Select font</option>
            {fonts.map(font => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Size Selection */}
        <div className="relative">
          <select
            value={currentSize}
            onChange={(e) => formatText('fontSize', e.target.value)}
            className="px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer min-w-[80px] text-gray-600"
          >
            <option value="">Size</option>
            {textSizes.map(size => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Line Spacing */}
        <div className="relative">
          <select
            value={currentLineSpacing}
            onChange={(e) => formatText('lineHeight', e.target.value)}
            className="px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer min-w-[120px] text-gray-600"
          >
            <option value="">Line Spacing</option>
            {lineSpacings.map(spacing => (
              <option key={spacing.value} value={spacing.value}>
                {spacing.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText('bold')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 font-bold transition-colors"
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => formatText('italic')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 italic transition-colors"
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => formatText('underline')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Underline"
          >
            <span className="underline">U</span>
          </button>
          <button
            onClick={() => formatText('strikeThrough')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </button>
          <button
            onClick={() => formatText('removeFormat')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Clear formatting"
          >
            Tx
          </button>
          <button
            onClick={() => formatText('createLink')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Insert link"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>

        {/* Heading Styles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText('heading', 'h1')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-sm font-medium transition-colors"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => formatText('heading', 'h2')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-sm font-medium transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => formatText('heading', 'h3')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-sm font-medium transition-colors"
            title="Heading 3"
          >
            H3
          </button>
          <button
            onClick={() => formatText('heading', 'h4')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-sm font-medium transition-colors"
            title="Heading 4"
          >
            H4
          </button>
        </div>

        {/* Lists and Formatting */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText('insertUnorderedList')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Bullet list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('insertOrderedList')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('superscript')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-xs transition-colors"
            title="Superscript"
          >
            X²
          </button>
          <button
            onClick={() => formatText('subscript')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 text-xs transition-colors"
            title="Subscript"
          >
            X₂
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText('justifyLeft')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Align left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('justifyCenter')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Align center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('justifyRight')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Align right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('justifyFull')}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors"
            title="Justify"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="w-9 h-9 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Save Button */}
        <div className="ml-auto">
          <button 
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;