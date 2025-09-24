import React, { useRef } from 'react';
import { Section, TeacherFeedback } from '../../types';

// This helper function takes plain text and feedback, and returns a React element
// with the targeted text wrapped in styled spans for highlighting.
const generateHighlightedMarkup = (content: string, feedback: TeacherFeedback | null): React.ReactNode => {
    if (!feedback || (!feedback.errors.length && !feedback.suggestions.length)) {
        return <span className="highlight-text">{content}</span>;
    }

    const allFeedback = [
        ...feedback.errors.map(f => ({ ...f, className: 'highlight-error' })),
        ...feedback.suggestions.map(f => ({ ...f, className: 'highlight-suggestion' })),
    ];

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    
    // Create a sorted list of unique feedback items to process
    const sortedFeedback = allFeedback
        .map(item => ({...item, index: content.indexOf(item.targetText)}))
        .filter(item => item.targetText && item.index !== -1)
        .sort((a, b) => a.index - b.index);

    const processedIndices = new Set();

    sortedFeedback.forEach((item, i) => {
        if (item.index < lastIndex || processedIndices.has(item.index)) return; // Skip overlapping/duplicate matches

        // Add text before the highlight
        if (item.index > lastIndex) {
            parts.push(<span key={`text-${i}-pre`} className="highlight-text">{content.substring(lastIndex, item.index)}</span>);
        }
        
        // Add the highlighted text
        parts.push(
            <span key={`hl-${i}`} className={`highlight ${item.className}`}>
                <span className="highlight-text">{item.targetText}</span>
            </span>
        );
        
        lastIndex = item.index + item.targetText.length;
        processedIndices.add(item.index);
    });

    // Add any remaining text after the last highlight
    if (lastIndex < content.length) {
        parts.push(<span key="text-last" className="highlight-text">{content.substring(lastIndex)}</span>);
    }

    return parts;
};


interface DefaultSectionComponentProps {
    section: Section;
    content: string;
    onContentChange: (content: string) => void;
    feedback: TeacherFeedback | null;
}

export const DefaultSectionComponent: React.FC<DefaultSectionComponentProps> = ({ section, content, onContentChange, feedback }) => {
    const backdropRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Syncs the scroll position of the backdrop with the textarea
    const handleScroll = () => {
        if (backdropRef.current && textareaRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
            backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 text-center pb-2 border-b-2 border-[#E1D7F1]">
                {section.title}
            </h2>
            <div className="w-full flex-grow relative" style={{ minHeight: '50vh' }}>
                 <div ref={backdropRef} className="editor-backdrop" aria-hidden="true">
                    {generateHighlightedMarkup(content, feedback)}
                </div>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    onScroll={handleScroll}
                    placeholder={section.placeholder}
                    className="editor-textarea"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};