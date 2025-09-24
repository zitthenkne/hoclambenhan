
import React from 'react';
import { TeacherFeedback, FeedbackItem } from '../types';

interface TeacherPanelProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: TeacherFeedback | null;
    isLoading: boolean;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const FeedbackCard: React.FC<{ item: FeedbackItem; type: 'error' | 'suggestion' }> = ({ item, type }) => {
    const bgColor = type === 'error' ? 'bg-red-50' : 'bg-yellow-50';
    const borderColor = type === 'error' ? 'border-red-200' : 'border-yellow-200';

    return (
        <div className={`p-4 rounded-lg border ${bgColor} ${borderColor} mb-3`}>
            <h4 className="font-bold text-sm text-[#4A4A4A]">{item.message}</h4>
            {item.targetText && <p className="text-xs text-gray-500 mt-1 italic">"{item.targetText}"</p>}
            {item.details && item.details.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                    {item.details.map((detail, index) => <li key={index}>{detail}</li>)}
                </ul>
            )}
        </div>
    );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <svg className="animate-spin h-8 w-8 text-[#E1D7F1] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="font-semibold">Người Thầy đang suy nghĩ...</p>
        <p className="text-sm">Vui lòng chờ trong giây lát.</p>
    </div>
);

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ isOpen, onClose, feedback, isLoading }) => {
    return (
        <div
            className={`fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-20 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
            <div className="bg-white rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] h-[60vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-[#E1D7F1] rounded-t-2xl" onClick={onClose}>
                    <div className="w-8"></div>
                    <h3 className="text-lg font-bold text-[#4A4A4A]">Phân Tích Của Người Thầy 💡</h3>
                    <button className="p-2 rounded-full hover:bg-white/50">
                        <ChevronDownIcon className="h-5 w-5 text-[#4A4A4A]" />
                    </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : feedback ? (
                        <>
                            {feedback.errors.length > 0 && feedback.errors.map((item, index) => (
                                <FeedbackCard key={`err-${index}`} item={item} type="error" />
                            ))}
                            {feedback.suggestions.length > 0 && feedback.suggestions.map((item, index) => (
                                <FeedbackCard key={`sug-${index}`} item={item} type="suggestion" />
                            ))}
                            {feedback.errors.length === 0 && feedback.suggestions.length === 0 && (
                                <div className="text-center text-gray-500 pt-10">
                                    <p className="font-semibold">Làm tốt lắm!</p>
                                    <p>Người Thầy không có góp ý nào ở mục này.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-500 pt-10">
                            <p>Nhấn vào 💡 để nhận phân tích.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
