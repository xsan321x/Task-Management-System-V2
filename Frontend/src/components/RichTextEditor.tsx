'use client';

import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Enter task description...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      // Only update if the content is different and we're not currently editing
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value && !isEditing) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
      handleInput();
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleInput();
  };

  const insertList = (ordered: boolean) => {
    if (ordered) {
      applyFormat('insertOrderedList');
    } else {
      applyFormat('insertUnorderedList');
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1.5 bg-gray-700 rounded-t-lg border border-gray-600 border-b-0">
        {/* Text Format */}
        <div className="flex gap-0.5 border-r border-gray-600 pr-1.5">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Bold (Ctrl+B)"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6V4zm0 8h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6v-8z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Italic (Ctrl+I)"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('underline')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Underline (Ctrl+U)"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3m-2 16h8" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('strikethrough')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Strikethrough"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 12h18M6 6h12M6 18h12" strokeWidth="2" stroke="currentColor" fill="none" />
            </svg>
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-0.5 border-r border-gray-600 pr-1.5">
          <button
            type="button"
            onClick={() => insertList(false)}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Bullet List"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="6" cy="18" r="1.5" />
              <line x1="10" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="18" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertList(true)}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Numbered List"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <text x="6" y="8" fontSize="10" fill="currentColor">1</text>
              <text x="6" y="14" fontSize="10" fill="currentColor">2</text>
              <text x="6" y="20" fontSize="10" fill="currentColor">3</text>
              <line x1="10" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="18" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-0.5 border-r border-gray-600 pr-1.5">
          <button
            type="button"
            onClick={() => applyFormat('justifyLeft')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Align Left"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('justifyCenter')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Align Center"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => applyFormat('justifyRight')}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Align Right"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Link */}
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Insert Link"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-b-lg text-white focus:outline-none transition-all min-h-20 max-h-40 overflow-y-auto text-sm ${
            isEditing ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-gray-600'
          }`}
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
          data-placeholder={!value && !isEditing ? placeholder : ''}
        />
      </div>

      {/* Character Count */}
      <div className="text-xs text-gray-400 text-right">
        {value.replace(/<[^>]*>/g, '').length} characters
      </div>
    </div>
  );
}
