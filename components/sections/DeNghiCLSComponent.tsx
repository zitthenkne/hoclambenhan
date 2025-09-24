import React, { useState } from 'react';
import { DeNghiCLSData, TeacherFeedback } from '../../types';

type CLSCategory = keyof DeNghiCLSData;

interface DynamicListProps {
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder: string;
    feedback: TeacherFeedback | null;
}

const getFeedbackClassForItem = (item: string, feedback: TeacherFeedback | null): string => {
    if (!feedback || !item) return 'bg-white border-gray-200';
    
    const hasError = feedback.errors.some(e => e.targetText === item);
    if (hasError) return 'bg-red-50 border-red-200';

    const hasSuggestion = feedback.suggestions.some(s => s.targetText === item);
    if (hasSuggestion) return 'bg-yellow-50 border-yellow-200';

    return 'bg-white border-gray-200';
};

const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const DynamicList: React.FC<DynamicListProps> = ({ items, onItemsChange, placeholder, feedback }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onItemsChange([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (indexToRemove: number) => {
        onItemsChange(items.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div>
            <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={placeholder}
                    className="flex-grow bg-white p-3 rounded-lg border-2 border-gray-200 focus:border-[#FADADD] focus:ring-0 transition-colors"
                />
                <button type="submit" className="flex-shrink-0 bg-[#E1D7F1] text-[#4A4A4A] p-3 rounded-lg hover:bg-purple-300 transition-colors">
                     <PlusIcon className="w-6 h-6"/>
                </button>
            </form>
            <div className="space-y-2">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${getFeedbackClassForItem(item, feedback)}`}>
                           <span className="text-gray-700">{item}</span>
                           <button onClick={() => handleRemoveItem(index)} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                               <TrashIcon className="w-5 h-5"/>
                           </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 py-4">Chưa có đề nghị nào.</p>
                )}
            </div>
        </div>
    );
};

interface DeNghiCLSComponentProps {
    data: DeNghiCLSData;
    onDataChange: (data: DeNghiCLSData) => void;
    feedback: TeacherFeedback | null;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors flex-1 text-center ${
            active ? 'bg-white text-[#4A4A4A]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

export const DeNghiCLSComponent: React.FC<DeNghiCLSComponentProps> = ({ data, onDataChange, feedback }) => {
    const [activeTab, setActiveTab] = useState<CLSCategory>('chanDoan');

    const handleListChange = (category: CLSCategory, newItems: string[]) => {
        onDataChange({ ...data, [category]: newItems });
    };

    return (
        <div>
            <div className="border-b-2 border-gray-200 flex">
                <TabButton active={activeTab === 'chanDoan'} onClick={() => setActiveTab('chanDoan')}>Chẩn đoán</TabButton>
                <TabButton active={activeTab === 'theoDoi'} onClick={() => setActiveTab('theoDoi')}>Theo dõi</TabButton>
                <TabButton active={activeTab === 'thuongQuy'} onClick={() => setActiveTab('thuongQuy')}>Thường quy</TabButton>
            </div>
            <div className="p-4 bg-white rounded-b-lg">
                <DynamicList
                    items={data[activeTab]}
                    onItemsChange={(newItems) => handleListChange(activeTab, newItems)}
                    placeholder={`Thêm CLS cho ${activeTab}...`}
                    feedback={feedback}
                />
            </div>
        </div>
    );
};