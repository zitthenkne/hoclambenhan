
import React, { ReactNode } from 'react';
import { NavigationDrawer } from './NavigationDrawer';
import { TeacherPanel } from './TeacherPanel';
import { SectionId, TeacherFeedback } from '../types';

interface LayoutProps {
    children: ReactNode;
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
    isTeacherPanelOpen: boolean;
    toggleTeacherPanel: () => void;
    teacherFeedback: TeacherFeedback | null;
    isLoading: boolean;
    activeSectionId: SectionId;
    onSectionSelect: (sectionId: SectionId) => void;
    hasNewFeedback: boolean;
}

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const TeacherIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


export const Layout: React.FC<LayoutProps> = ({
    children,
    isMenuOpen,
    setMenuOpen,
    isTeacherPanelOpen,
    toggleTeacherPanel,
    teacherFeedback,
    isLoading,
    activeSectionId,
    onSectionSelect,
    hasNewFeedback,
}) => {
    return (
        <div className="relative h-full w-full max-w-md mx-auto flex flex-col bg-[#FFFDF9] shadow-2xl shadow-purple-100/50">
            {/* Header */}
            <header className="flex-shrink-0 w-full h-16 bg-[#FADADD] flex items-center justify-between px-4 shadow-md z-20">
                <button onClick={() => setMenuOpen(true)} className="text-[#4A4A4A] p-2 rounded-full hover:bg-white/30 transition-colors">
                    <MenuIcon className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold text-[#4A4A4A] tracking-wider">Bệnh Án Ảo</h1>
                <button onClick={toggleTeacherPanel} className="relative text-[#4A4A4A] p-2 rounded-full hover:bg-white/30 transition-colors">
                    <TeacherIcon className="h-6 w-6" />
                    {hasNewFeedback && <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-pink-500 border-2 border-white"></span>}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-4">
                {children}
            </main>

            {/* Navigation Drawer */}
            <NavigationDrawer
                isOpen={isMenuOpen}
                onClose={() => setMenuOpen(false)}
                activeSectionId={activeSectionId}
                onSectionSelect={onSectionSelect}
            />

            {/* Teacher Panel */}
            <TeacherPanel
                isOpen={isTeacherPanelOpen}
                onClose={toggleTeacherPanel}
                feedback={teacherFeedback}
                isLoading={isLoading}
            />
        </div>
    );
};
