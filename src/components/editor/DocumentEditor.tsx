import  { useState } from 'react';

const DocumentEditor = () => {
  const [content, setContent] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Document Editor</h3>
      </div>
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your document..."
          className="w-full h-96 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default DocumentEditor;