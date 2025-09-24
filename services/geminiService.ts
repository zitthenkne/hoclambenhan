
import { GoogleGenAI, Type } from "@google/genai";
import { CaseData, SectionId, TeacherFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function buildPrompt(sectionId: SectionId, caseData: CaseData): string {
    const fullCaseReport = JSON.stringify(caseData, null, 2);
    const currentContentData = caseData[sectionId];
    const currentContent = typeof currentContentData === 'string' 
        ? currentContentData 
        : JSON.stringify(currentContentData, null, 2);

    const baseInstruction = `
        You are an expert, friendly, and encouraging Vietnamese medical professor reviewing a 3rd-year medical student's case report. Your feedback must be in Vietnamese.
        Your goal is to help the student think logically and structure their report correctly, not just to find mistakes.
        Analyze the current section in the context of the entire report provided.
        Provide feedback in a structured JSON format as specified. Do not output markdown or any other text outside the JSON structure.

        Here is the student's entire case report so far:
        ${fullCaseReport}

        The student is currently working on the section: "${sectionId}".
        The content of this section is: "${currentContent}"
    `;

    let specificInstruction = '';

    switch (sectionId) {
        case 'lyDoVaoVien':
            specificInstruction = `
            Task: Check if the "Reason for Admission" contains a medical diagnosis (e.g., "Suy tim", "Viêm phổi") instead of a patient's symptom.
            A reason for admission should be what the patient complains about (e.g., "Khó thở", "Đau ngực").
            If you find a diagnosis, create an error of type "MEDICAL_TERM_USED".
            `;
            break;
        case 'benhSu':
            specificInstruction = `
            Tasks:
            1. Identify major symptoms (e.g., "đau ngực", "khó thở", "sốt"). For each, check if it has been properly characterized. If not, create a suggestion of type "CLARIFY_SYMPTOM" with a checklist of questions to ask (Vị trí, tính chất, cường độ, hướng lan, yếu tố tăng/giảm, triệu chứng đi kèm).
            2. Identify any text describing physical exam findings (e.g., "khám thấy", "ran ẩm", "tim đều", "bụng mềm"). These are misplaced. Create an error of type "WRONG_SECTION" and suggest moving it to the "KhamBenh" section.
            `;
            break;
        case 'tienSu':
            specificInstruction = `
            Task: Identify any chronic diseases mentioned (e.g., "Đái tháo đường", "Tăng huyết áp"). If found, check if key details are present. If not, create a suggestion of type "INCOMPLETE_HISTORY" asking for clarification (e.g., Type? Duration? Treatment? Compliance? Complications?).
            `;
            break;
        case 'tomTatBenhAn':
            specificInstruction = `
            Task: This is a critical logic check. Compare the summary with all previous sections (HanhChinh, LyDoVaoVien, BenhSu, TienSu, KhamBenh).
            If you find any significant clinical detail in the summary (like "sốt 38.5 độ", "vàng da") that was NOT mentioned in the previous sections, create an error of type "LOGIC_CONFLICT" indicating the new information is not documented earlier.
            `;
            break;
        case 'datVanDe':
             specificInstruction = `
            Task: Based on the "TomTatBenhAn", identify groups of symptoms and signs that can be clustered into a medical syndrome (e.g., "Hội chứng nhiễm trùng", "Hội chứng vàng da tắc mật", "Hội chứng suy tim"). Create a suggestion of type "SUGGEST_SYNDROME" to help the student group their findings.
            `;
            break;
        default:
            specificInstruction = `
            Task: Provide general feedback on the clarity, structure, and completeness of this section.
            `;
            break;
    }

    return `${baseInstruction}\n${specificInstruction}`;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        errors: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "A machine-readable error type (e.g., 'WRONG_SECTION', 'LOGIC_CONFLICT')." },
                    message: { type: Type.STRING, description: "A short, impactful title for the feedback (e.g., '🔴 SAI VỊ TRÍ!')." },
                    targetText: { type: Type.STRING, description: "The exact text from the student's input that this feedback refers to." },
                    details: { type: Type.ARRAY, items: {type: Type.STRING}, description: "A more detailed explanation or suggestion." },
                }
            }
        },
        suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "A machine-readable suggestion type (e.g., 'CLARIFY_SYMPTOM', 'SUGGEST_SYNDROME')." },
                    message: { type: Type.STRING, description: "A short, impactful title for the suggestion (e.g., '🟡 LÀM RÕ TRIỆU CHỨNG...')." },
                    targetText: { type: Type.STRING, description: "The exact text from the student's input that this suggestion refers to." },
                    details: { type: Type.ARRAY, items: {type: Type.STRING}, description: "A checklist or detailed points for the student to consider." },
                }
            }
        }
    }
};

const isContentEmpty = (content: any): boolean => {
    if (!content) return true;
    if (typeof content === 'string') {
        return !content.trim();
    }
    if (Array.isArray(content)) {
        return content.length === 0;
    }
    if (typeof content === 'object' && content !== null) {
        const checkEmpty = (obj: any): boolean => {
            return Object.values(obj).every(value => {
                if (typeof value === 'string') return !value.trim();
                if (typeof value === 'object' && value !== null) return checkEmpty(value);
                return true;
            })
        }
        return checkEmpty(content);
    }
    return false;
};

export const analyzeCaseReport = async (sectionId: SectionId, caseData: CaseData): Promise<TeacherFeedback | null> => {
    if (!process.env.API_KEY) {
        console.error("API key is not set.");
        return {
            errors: [{ type: 'API_KEY_MISSING', message: 'Lỗi Cấu Hình', targetText: '', details: ['API key chưa được thiết lập.'] }],
            suggestions: []
        };
    }
    
    if (isContentEmpty(caseData[sectionId])) {
        return null;
    }

    const prompt = buildPrompt(sectionId, caseData);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        const feedback: TeacherFeedback = {
            errors: parsedResponse.errors || [],
            suggestions: parsedResponse.suggestions || []
        };

        return feedback;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            errors: [{ type: 'API_ERROR', message: 'Lỗi API', targetText: '', details: ['Đã có lỗi xảy ra khi kết nối với Người Thầy AI.'] }],
            suggestions: []
        };
    }
};
