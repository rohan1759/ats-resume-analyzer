import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractText(buffer, mimeType) {
    try {
        if (mimeType === 'application/pdf') {
            const data = await pdfParse(buffer);
            return data.text;
        }
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }
        throw new Error(
            `Unsupported file type: ${mimeType}. Only PDF and DOCX are allowed.`
        )
    } catch (error) {
        console.log("error", error.message)
        return ""
    }
}