// Fix: Manually define SectionId to break the circular dependency between types.ts and constants.ts.
// This resolves the "circularly references itself" and related errors.
export type SectionId = 'hanhChinh' | 'lyDoVaoVien' | 'benhSu' | 'tienSu' | 'khamBenh' | 'tomTatBenhAn' | 'datVanDe' | 'chanDoan' | 'deNghiCLS' | 'tienLuong';

export interface Section {
    id: SectionId;
    title: string;
    placeholder: string;
    component: 'default' | 'hanhChinh' | 'tienSu' | 'khamBenh' | 'datVanDe' | 'deNghiCLS';
}

// Structured data types for specific sections
export interface HanhChinhData {
    hoTen: string;
    tuoi: string;
    gioiTinh: 'Nam' | 'Nữ' | '';
    ngheNghiep: string;
    diaChi: string;
}

export interface TienSuData {
    banThan: {
        noiKhoa: string;
        ngoaiKhoa: string;
        diUng: string;
        khac: string;
    };
    giaDinh: string;
}

export type KhamBenhSystem = 'toanTrang' | 'tuanHoan' | 'hoHap' | 'tieuHoa' | 'thanTietNieu' | 'coXuongKhop' | 'thanKinh' | 'khac';
export const KHAM_BENH_SYSTEMS: Record<KhamBenhSystem, string> = {
    toanTrang: 'Toàn trạng',
    tuanHoan: 'Tuần hoàn',
    hoHap: 'Hô hấp',
    tieuHoa: 'Tiêu hóa',
    thanTietNieu: 'Thận - Tiết niệu',
    coXuongKhop: 'Cơ xương khớp',
    thanKinh: 'Thần kinh',
    khac: 'Các cơ quan khác'
};
export type KhamBenhData = {
    [key in KhamBenhSystem]: string;
};

export type DatVanDeData = string[];

export interface DeNghiCLSData {
    chanDoan: string[];
    theoDoi: string[];
    thuongQuy: string[];
}

// Main case data structure
export interface CaseData {
    hanhChinh: HanhChinhData;
    lyDoVaoVien: string;
    benhSu: string;
    tienSu: TienSuData;
    khamBenh: KhamBenhData;
    tomTatBenhAn: string;
    datVanDe: DatVanDeData;
    chanDoan: string;
    deNghiCLS: DeNghiCLSData;
    tienLuong: string;
}

// Feedback types
export interface FeedbackItem {
    type: string;
    message: string;
    targetText: string;
    details?: string[];
}

export interface TeacherFeedback {
    errors: FeedbackItem[];
    suggestions: FeedbackItem[];
}
