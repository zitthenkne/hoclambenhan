
import { Section } from "./types";

export const SECTIONS: readonly Section[] = [
    { id: 'hanhChinh', title: 'I. HÀNH CHÍNH', placeholder: 'Nhập thông tin hành chính của bệnh nhân...', component: 'hanhChinh' },
    { id: 'lyDoVaoVien', title: 'II. LÝ DO VÀO VIỆN', placeholder: 'Ghi triệu chứng chính khiến bệnh nhân nhập viện (VD: Đau ngực trái ngày thứ 2)...', component: 'default' },
    { id: 'benhSu', title: 'III. BỆNH SỬ', placeholder: 'Kể lại quá trình bệnh lý từ lúc khởi phát đến khi nhập viện...', component: 'default' },
    { id: 'tienSu', title: 'IV. TIỀN SỬ', placeholder: 'Ghi nhận tiền sử bệnh tật bản thân và gia đình...', component: 'tienSu' },
    { id: 'khamBenh', title: 'V. KHÁM BỆNH', placeholder: 'Mô tả các dấu hiệu khám được theo từng cơ quan...', component: 'khamBenh' },
    { id: 'tomTatBenhAn', title: 'VI. TÓM TẮT BỆNH ÁN', placeholder: 'Tóm tắt lại các triệu chứng và hội chứng chính...', component: 'default' },
    { id: 'datVanDe', title: 'VII. ĐẶT VẤN ĐỀ', placeholder: 'Liệt kê các vấn đề của bệnh nhân dưới dạng danh sách...', component: 'datVanDe' },
    { id: 'chanDoan', title: 'VIII. CHẨN ĐOÁN & BIỆN LUẬN', placeholder: 'Ghi chẩn đoán sơ bộ, chẩn đoán phân biệt và biện luận...', component: 'default' },
    { id: 'deNghiCLS', title: 'IX. ĐỀ NGHỊ CẬN LÂM SÀNG', placeholder: 'Đề nghị các xét nghiệm cần thiết...', component: 'deNghiCLS' },
    { id: 'tienLuong', title: 'X. TIÊN LƯỢNG & HƯỚNG ĐIỀU TRỊ', placeholder: 'Dự đoán diễn tiến bệnh và đề ra hướng điều trị...', component: 'default' },
] as const;
