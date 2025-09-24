import React from 'react';
import { Section, SectionId, CaseData, HanhChinhData, TienSuData, KhamBenhData, DatVanDeData, DeNghiCLSData, TeacherFeedback } from '../types';
import { DefaultSectionComponent } from './sections/DefaultSectionComponent';
import { HanhChinhComponent } from './sections/HanhChinhComponent';
import { TienSuComponent } from './sections/TienSuComponent';
import { KhamBenhComponent } from './sections/KhamBenhComponent';
import { DatVanDeComponent } from './sections/DatVanDeComponent';
import { DeNghiCLSComponent } from './sections/DeNghiCLSComponent';


interface SectionComponentProps {
    section: Section;
    data: CaseData[SectionId];
    onDataChange: (sectionId: SectionId, data: any) => void;
    feedback: TeacherFeedback | null;
}

export const SectionComponent: React.FC<SectionComponentProps> = ({ section, data, onDataChange, feedback }) => {
    
    const handleDataUpdate = (newData: any) => {
        onDataChange(section.id, newData);
    };

    const renderTitle = (title: string) => (
         <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4 text-center pb-2 border-b-2 border-[#E1D7F1]">
            {title}
        </h2>
    );

    switch (section.component) {
        case 'hanhChinh':
            return (
                <div>
                    {renderTitle(section.title)}
                    <HanhChinhComponent data={data as HanhChinhData} onDataChange={handleDataUpdate} feedback={feedback} />
                </div>
            );
        case 'tienSu':
             return (
                <div>
                    {renderTitle(section.title)}
                    <TienSuComponent data={data as TienSuData} onDataChange={handleDataUpdate} feedback={feedback} />
                </div>
            );
        case 'khamBenh':
            return (
                <div>
                    {renderTitle(section.title)}
                    <KhamBenhComponent data={data as KhamBenhData} onDataChange={handleDataUpdate} feedback={feedback} />
                </div>
            );
        case 'datVanDe':
             return (
                <div>
                    {renderTitle(section.title)}
                    <DatVanDeComponent data={data as DatVanDeData} onDataChange={handleDataUpdate} feedback={feedback} />
                </div>
            );
        case 'deNghiCLS':
            return (
                <div>
                    {renderTitle(section.title)}
                    <DeNghiCLSComponent data={data as DeNghiCLSData} onDataChange={handleDataUpdate} feedback={feedback} />
                </div>
            );
        default:
            return (
                <DefaultSectionComponent 
                    section={section} 
                    content={data as string} 
                    onContentChange={handleDataUpdate} 
                    feedback={feedback}
                />
            );
    }
};