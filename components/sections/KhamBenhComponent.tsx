import React, { useState } from 'react';
import { KhamBenhData, KhamBenhSystem, KHAM_BENH_SYSTEMS, TeacherFeedback } from '../../types';

interface KhamBenhComponentProps {
    data: KhamBenhData;
    onDataChange: (data: KhamBenhData) => void;
    feedback: TeacherFeedback | null;
}

const getFeedbackClass = (value: string, feedback: TeacherFeedback | null): string => {
    if (!feedback || !value || !value.trim()) return 'border-gray-200';
    
    const hasError = feedback.errors.some(e => e.targetText && value.includes(e.targetText));
    if (hasError) return 'border-red-400';

    const hasSuggestion = feedback.suggestions.some(s => s.targetText && value.includes(s.targetText));
    if (hasSuggestion) return 'border-yellow-400';

    return 'border-gray-200';
};

const AccordionItem: React.FC<{ title: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; }> = ({ title, isOpen, onClick, children }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
            >
                <span className="font-semibold text-[#4A4A4A]">{title}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 bg-white">
                    {children}
                </div>
            </div>
        </div>
    )
}

export const KhamBenhComponent: React.FC<KhamBenhComponentProps> = ({ data, onDataChange, feedback }) => {
    const [openSystem, setOpenSystem] = useState<KhamBenhSystem | null>('toanTrang');

    const handleToggle = (system: KhamBenhSystem) => {
        setOpenSystem(openSystem === system ? null : system);
    }
    
    const handleChange = (system: KhamBenhSystem, value: string) => {
        onDataChange({ ...data, [system]: value });
    }

    return (
        <div className="rounded-lg border border-gray-200">
            {(Object.keys(KHAM_BENH_SYSTEMS) as KhamBenhSystem[]).map((systemKey) => (
                <AccordionItem
                    key={systemKey}
                    title={KHAM_BENH_SYSTEMS[systemKey]}
                    isOpen={openSystem === systemKey}
                    onClick={() => handleToggle(systemKey)}
                >
                    <textarea
                        value={data[systemKey]}
                        onChange={(e) => handleChange(systemKey, e.target.value)}
                        placeholder={`Mô tả khám ${KHAM_BENH_SYSTEMS[systemKey].toLowerCase()}...`}
                        rows={4}
                        className={`w-full bg-white p-3 rounded-lg border-2 ${getFeedbackClass(data[systemKey], feedback)} focus:border-[#FADADD] focus:ring-0 transition-colors resize-none`}
                    />
                </AccordionItem>
            ))}
        </div>
    );
};