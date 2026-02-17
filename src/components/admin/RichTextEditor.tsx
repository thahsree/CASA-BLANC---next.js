"use client";

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link',
    'table', 'code-block', 'align', 'direction', 'color', 'background', 'script', 'indent'
  ];

  return (
    <div className="bg-background text-foreground">
      <style jsx global>{`
        /* ================================
   FORCE QUILL TOOLBAR ICONS = WHITE
   ================================ */

/* Default icon color */
.ql-toolbar .ql-stroke {
  stroke: #ffffff !important;
}

.ql-toolbar .ql-fill {
  fill: #ffffff !important;
}

.ql-toolbar .ql-stroke-miter {
  stroke: #ffffff !important;
}

/* Picker (header, etc.) text */
.ql-toolbar .ql-picker {
  color: #ffffff !important;
}

/* Hover / Active = Gold */
.ql-toolbar button:hover .ql-stroke,
.ql-toolbar button.ql-active .ql-stroke {
  stroke: #C9B27B !important;
}

.ql-toolbar button:hover .ql-fill,
.ql-toolbar button.ql-active .ql-fill {
  fill: #C9B27B !important;
}

/* Dropdown items */
.ql-picker-options {
  background-color: #000 !important;
}

.ql-picker-item {
  color: #fff !important;
}

.ql-picker-item:hover,
.ql-picker-item.ql-selected {
  color: #C9B27B !important;
}

/* ================================
   FORCE GOLD ACTIVE STATE (NO BLUE)
   ================================ */

/* Active toolbar buttons */
.ql-toolbar button.ql-active {
  background-color: transparent !important;
}

.ql-toolbar button.ql-active .ql-stroke {
  stroke: #C9B27B !important;
}

.ql-toolbar button.ql-active .ql-fill {
  fill: #C9B27B !important;
}

/* Active picker label (Header, etc.) */
.ql-toolbar .ql-picker-label.ql-active {
  color: #C9B27B !important;
  border-color: #C9B27B !important;
}

/* Selected dropdown option */
.ql-toolbar .ql-picker-item.ql-selected {
  color: #C9B27B !important;
  background-color: transparent !important;
}

/* Hover dropdown option */
.ql-toolbar .ql-picker-item:hover {
  color: #C9B27B !important;
}

/* ================================
   RESTORE HEADER SIZES IN EDITOR
   ================================ */
.ql-editor h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}

.ql-editor h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}

.ql-editor h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
}

/* Restore list styles */
.ql-editor ul {
  list-style-type: disc;
  list-style-position: inside;
  padding-left: 0;
}

.ql-editor ol {
  list-style-type: decimal;
  list-style-position: inside;
  padding-left: 0;
}
`}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-[200px] mb-12" // Add margin bottom for toolbar spacing
      />
    </div>
  );
}
