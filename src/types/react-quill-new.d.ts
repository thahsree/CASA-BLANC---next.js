declare module 'react-quill-new' {
    import React from 'react';

    export interface ReactQuillProps {
        theme?: string;
        modules?: any;
        formats?: string[];
        value?: string;
        onChange?: (value: string, delta: any, source: string, editor: any) => void;
        className?: string;
        placeholder?: string;
        readOnly?: boolean;
    }

    const ReactQuill: React.FC<ReactQuillProps>;

    export default ReactQuill;
}
