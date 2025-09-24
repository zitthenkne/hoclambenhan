import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SECTIONS } from './constants';
import { SectionId, CaseData, TeacherFeedback, HanhChinhData, TienSuData, KhamBenhData, KHAM_BENH_SYSTEMS } from './types';
import { analyzeCaseReport } from './services/geminiService';
import { SectionComponent } from './components/SectionComponent';
import { useDebounce } from './hooks/useDebounce';


const initialHanhChinhData: HanhChinhData = { hoTen: '', tuoi: '', gioiTinh: '', ngheNghiep: '', diaChi: '' };
const initialTienSuData: TienSuData = { banThan: { noiKhoa: '', ngoaiKhoa: '', diUng: '', khac: '' }, giaDinh: '' };
const initialKhamBenhData: KhamBenhData = Object.keys(KHAM_BENH_SYSTEMS).reduce((acc, key) => ({ ...acc, [key]: '' }), {} as KhamBenhData);

const initialCaseData: CaseData = {
    hanhChinh: initialHanhChinhData,
    lyDoVaoVien: '',
    benhSu: '',
    tienSu: initialTienSuData,
    khamBenh: initialKhamBenhData,
    tomTatBenhAn: '',
    datVanDe: [],
    chanDoan: '',
    deNghiCLS: { chanDoan: [], theoDoi: [], thuongQuy: [] },
    tienLuong: '',
};


const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SectionId>(SECTIONS[0].id);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isTeacherPanelOpen, setTeacherPanelOpen] = useState(false);
    const [caseData, setCaseData] = useState<CaseData>(initialCaseData);
    const [teacherFeedback, setTeacherFeedback] = useState<TeacherFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNewFeedback, setHasNewFeedback] = useState(false);

    const debouncedCaseData = useDebounce(caseData, 1500);

    const handleDataChange = useCallback((sectionId: SectionId, content: any) => {
        setCaseData(prev => ({ ...prev, [sectionId]: content }));
    }, []);

    const runAnalysis = useCallback(async (currentSection: SectionId, fullData: CaseData) => {
        setIsLoading(true);
        try {
            const feedback = await analyzeCaseReport(currentSection, fullData);
            if (feedback && (feedback.errors.length > 0 || feedback.suggestions.length > 0)) {
                setTeacherFeedback(feedback);
                setHasNewFeedback(true);
            } else if (feedback) { // Analysis ran but had no feedback
                 setTeacherFeedback(feedback); // sets { errors: [], suggestions: [] }
                 setHasNewFeedback(false);
            }
        } catch (error) {
            console.error("Error analyzing case report:", error);
            setTeacherFeedback({
                errors: [{ type: 'GENERAL_ERROR', message: 'Không thể phân tích. Vui lòng thử lại.', targetText: '' }],
                suggestions: []
            });
            setHasNewFeedback(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedCaseData) {
            runAnalysis(activeSection, debouncedCaseData);
        }
    }, [debouncedCaseData, activeSection, runAnalysis]);
    
    const handleSectionSelect = useCallback((sectionId: SectionId) => {
        setActiveSection(sectionId);
        setMenuOpen(false);
    }, []);
    
    const toggleTeacherPanel = () => {
        setTeacherPanelOpen(prev => !prev);
        if (!isTeacherPanelOpen) {
            setHasNewFeedback(false);
        }
    };

    return (
        <div className="bg-[#FFFDF9] text-[#4A4A4A] h-screen w-screen overflow-hidden font-sans">
            <Layout
                isMenuOpen={isMenuOpen}
                setMenuOpen={setMenuOpen}
                isTeacherPanelOpen={isTeacherPanelOpen}
                toggleTeacherPanel={toggleTeacherPanel}
                teacherFeedback={teacherFeedback}
                isLoading={isLoading}
                activeSectionId={activeSection}
                onSectionSelect={handleSectionSelect}
                hasNewFeedback={hasNewFeedback}
            >
                <SectionComponent
                    section={SECTIONS.find(s => s.id === activeSection)!}
                    data={caseData[activeSection]}
                    onDataChange={handleDataChange}
                    feedback={teacherFeedback}
                />
            </Layout>
        </div>
    );
};

export default App;