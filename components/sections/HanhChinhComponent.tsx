import React from 'react';
import { HanhChinhData, TeacherFeedback } from '../../types';

interface HanhChinhComponentProps {
    data: HanhChinhData;
    onDataChange: (data: HanhChinhData) => void;
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

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; feedback: TeacherFeedback | null;}> = 
({ label, value, onChange, type = 'text', placeholder, feedback }) => {
    const feedbackClass = getFeedbackClass(value, feedback);
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white p-3 rounded-lg border-2 ${feedbackClass} focus:border-[#FADADD] focus:ring-0 transition-colors`}
            />
        </div>
    );
}

export const HanhChinhComponent: React.FC<HanhChinhComponentProps> = ({ data, onDataChange, feedback }) => {
    
    const handleChange = (field: keyof HanhChinhData, value: string) => {
        onDataChange({ ...data, [field]: value });
    };

    const selectFeedbackClass = getFeedbackClass(data.gioiTinh, feedback);

    return (
        <div className="space-y-4 p-2">
            <InputField label="Họ và tên" value={data.hoTen} onChange={(e) => handleChange('hoTen', e.target.value)} feedback={feedback} />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Tuổi" value={data.tuoi} onChange={(e) => handleChange('tuoi', e.target.value)} type="number" feedback={feedback}/>
                 <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Giới</label>
                    <select
                        value={data.gioiTinh}
                        onChange={(e) => handleChange('gioiTinh', e.target.value)}
                        className={`w-full bg-white p-3 rounded-lg border-2 ${selectFeedbackClass} focus:border-[#FADADD] focus:ring-0 transition-colors`}
                    >
                        <option value="">Chọn giới</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
            </div>
            <InputField label="Nghề nghiệp" value={data.ngheNghiep} onChange={(e) => handleChange('ngheNghiep', e.target.value)} feedback={feedback}/>
            <InputField label="Địa chỉ" value={data.diaChi} onChange={(e) => handleChange('diaChi', e.target.value)} feedback={feedback} />
        </div>
    );
};