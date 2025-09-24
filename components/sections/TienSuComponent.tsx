import React, { useState } from 'react';
import { TienSuData, TeacherFeedback } from '../../types';

interface TienSuComponentProps {
    data: TienSuData;
    onDataChange: (data: TienSuData) => void;
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


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 text-sm font-bold rounded-t-lg transition-colors ${
            active ? 'bg-white text-[#4A4A4A]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

const TextareaField: React.FC<{label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; feedback: TeacherFeedback | null;}> =
({label, value, onChange, placeholder, feedback}) => {
    const feedbackClass = getFeedbackClass(value, feedback);
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={3}
                className={`w-full bg-white p-3 rounded-lg border-2 ${feedbackClass} focus:border-[#FADADD] focus:ring-0 transition-colors resize-none`}
            />
        </div>
    );
};

export const TienSuComponent: React.FC<TienSuComponentProps> = ({ data, onDataChange, feedback }) => {
    const [activeTab, setActiveTab] = useState<'banThan' | 'giaDinh'>('banThan');

    const handleBanThanChange = (field: keyof TienSuData['banThan'], value: string) => {
        onDataChange({
            ...data,
            banThan: { ...data.banThan, [field]: value }
        });
    };

    const handleGiaDinhChange = (value: string) => {
        onDataChange({ ...data, giaDinh: value });
    };

    return (
        <div>
            <div className="border-b-2 border-gray-200">
                <TabButton active={activeTab === 'banThan'} onClick={() => setActiveTab('banThan')}>Bản thân</TabButton>
                <TabButton active={activeTab === 'giaDinh'} onClick={() => setActiveTab('giaDinh')}>Gia đình</TabButton>
            </div>
            <div className="p-4 bg-white rounded-b-lg">
                {activeTab === 'banThan' && (
                    <div>
                        <TextareaField label="Nội khoa" value={data.banThan.noiKhoa} onChange={e => handleBanThanChange('noiKhoa', e.target.value)} placeholder="VD: Tăng huyết áp, Đái tháo đường type 2..." feedback={feedback} />
                        <TextareaField label="Ngoại khoa" value={data.banThan.ngoaiKhoa} onChange={e => handleBanThanChange('ngoaiKhoa', e.target.value)} placeholder="VD: Mổ ruột thừa năm 2010..." feedback={feedback} />
                        <TextareaField label="Dị ứng" value={data.banThan.diUng} onChange={e => handleBanThanChange('diUng', e.target.value)} placeholder="VD: Dị ứng Penicillin..." feedback={feedback} />
                        <TextareaField label="Khác" value={data.banThan.khac} onChange={e => handleBanThanChange('khac', e.target.value)} placeholder="Sản phụ khoa, thói quen (hút thuốc, rượu bia)..." feedback={feedback} />
                    </div>
                )}
                {activeTab === 'giaDinh' && (
                    <div>
                         <TextareaField label="Tiền sử gia đình" value={data.giaDinh} onChange={e => handleGiaDinhChange(e.target.value)} placeholder="Ghi nhận các bệnh lý liên quan trong gia đình..." feedback={feedback} />
                    </div>
                )}
            </div>
        </div>
    );
};