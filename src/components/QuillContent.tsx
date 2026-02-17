"use client";

import "react-quill-new/dist/quill.snow.css";

interface QuillContentProps {
  content: string;
  className?: string;
}

export default function QuillContent({ content, className = "" }: QuillContentProps) {
  // Sanitize content to handle non-breaking spaces if needed
  const sanitizedContent = content
    ? content.replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ")
    : "";

  return (
    <div className={`ql-snow ${className}`}>
      <style jsx global>{`
        /* ================================
           RESTORE EDITOR STYLES (MATCHING RICHTEXTEDITOR.TSX)
           ================================ */
        .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          line-height: 1.2;
        }

        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          line-height: 1.3;
        }

        .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
          line-height: 1.4;
        }

        .ql-editor h4 {
          font-size: 1em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }

        .ql-editor h5 {
          font-size: 0.83em;
          font-weight: bold;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
        }

        .ql-editor h6 {
          font-size: 0.67em;
          font-weight: bold;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
        }

        .ql-editor p {
          margin-bottom: 1em; /* Ensure paragraphs have spacing */
        }

        .ql-editor ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        .ql-editor ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        .ql-editor li {
          margin-bottom: 0.5em;
        }
        
        .ql-editor strong {
            font-weight: bold;
        }

        /* Table Handling */
        .ql-editor table {
           display: block;
           width: 100%;
           overflow-x: auto;
           border-collapse: collapse;
           margin: 1em 0;
        }
        .ql-editor th, .ql-editor td {
           border: 1px solid #e5e7eb; /* gray-200, adjust for dark mode if needed */
           padding: 0.5em;
           min-width: 100px;
        }
        
        /* Dark Mode Adjustments for Viewer */
        .ql-editor {
            color: rgba(255,255,255,0.9);
            font-family: 'Quicksand', sans-serif;
            line-height: 1.6;
            height: auto !important;
            padding: 0 !important;
            overflow-y: visible !important;
        }
        
        .ql-editor th, .ql-editor td {
            border-color: #4b5563; /* gray-600 */
        }
        
        /* Alignment Classes (Quill Standard) */
        .ql-align-center { text-align: center; }
        .ql-align-right { text-align: right; }
        .ql-align-justify { text-align: justify; }
      `}</style>
      <div
        className="ql-editor w-full overflow-hidden break-words whitespace-normal"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}
