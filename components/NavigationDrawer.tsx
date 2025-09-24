
import React from 'react';
import { SECTIONS } from '../constants';
import { SectionId } from '../types';

interface NavigationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeSectionId: SectionId;
    onSectionSelect: (sectionId: SectionId) => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, activeSectionId, onSectionSelect }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/30 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#E1D7F1]">
                    <h2 className="text-xl font-bold text-[#4A4A4A]">Các mục bệnh án</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50">
                        <CloseIcon className="h-6 w-6 text-[#4A4A4A]"/>
                    </button>
                </div>
                <nav className="py-2">
                    <ul>
                        {SECTIONS.map(section => (
                            <li key={section.id}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSectionSelect(section.id);
                                    }}
                                    className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                        activeSectionId === section.id
                                            ? 'bg-[#FADADD] text-[#4A4A4A] border-r-4 border-pink-400'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};
