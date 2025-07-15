
import { GoogleGenAI, Type } from "@google/genai";
import { OCR_TEXT } from '../constants';
import { Participant, ParticipantType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    students: {
      type: Type.ARRAY,
      description: "A list of all students (Mahasiswa).",
      items: {
        type: Type.OBJECT,
        properties: {
          nim: {
            type: Type.STRING,
            description: "Student's identification number (NIM).",
          },
          name: {
            type: Type.STRING,
            description: "Student's full name. Correct any typos.",
          },
          program: {
            type: Type.STRING,
            description: "Student's study program and semester, e.g., 'S1 MANAJEMEN (IV)'.",
          },
        },
        required: ["nim", "name", "program"],
      },
    },
    lecturers: {
      type: Type.ARRAY,
      description: "A list of all accompanying lecturers (Dosen Pendamping).",
      items: {
        type: Type.OBJECT,
        properties: {
          nuptk: {
            type: Type.STRING,
            description: "Lecturer's national educator identification number (NUPTK).",
          },
          name: {
            type: Type.STRING,
            description: "Lecturer's full name, including titles.",
          },
          homebase: {
            type: Type.STRING,
            description: "Lecturer's homebase program, e.g., 'S1 MANAJEMEN'.",
          },
        },
        required: ["nuptk", "name", "homebase"],
      },
    },
    technicalAssistants: {
      type: Type.ARRAY,
      description: "A list of all technical assistants (Asisten Teknis).",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Assistant's full name.",
          },
          role: {
            type: Type.STRING,
            description: "Assistant's role or section (Bagian), e.g., 'DOKUMENTASI'.",
          },
        },
        required: ["name", "role"],
      },
    },
  },
  required: ["students", "lecturers", "technicalAssistants"],
};

export const extractParticipantData = async (): Promise<Participant[]> => {
  try {
    const prompt = `You are an expert data extraction assistant. From the following text, which is an OCR result of a participant list, extract all students (Mahasiswa), all lecturers (Dosen Pendamping), and all technical assistants (Asisten Teknis) into a structured JSON format. Pay close attention to the column headers. Clean up any OCR errors and inconsistencies.

    ${OCR_TEXT}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr) as { 
        students: { nim: string, name: string, program: string }[], 
        lecturers: { nuptk: string, name: string, homebase: string }[],
        technicalAssistants: { name: string, role: string }[]
    };

    const participants: Participant[] = [];

    data.students.forEach((s) => {
        participants.push({
            id: s.nim,
            nim: s.nim,
            name: s.name,
            program: s.program,
            type: ParticipantType.STUDENT,
            photoUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(s.name)}`
        });
    });

    data.lecturers.forEach((l) => {
        const id = l.nuptk || l.name;
        participants.push({
            id: id,
            nuptk: l.nuptk,
            name: l.name,
            homebase: l.homebase,
            type: ParticipantType.LECTURER,
            photoUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(l.name)}`
        });
    });
    
    data.technicalAssistants.forEach((a) => {
        participants.push({
            id: a.name,
            name: a.name,
            role: a.role,
            type: ParticipantType.ASSISTANT,
            photoUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(a.name)}`
        });
    });

    return participants;

  } catch (error) {
    console.error("Error processing data with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to extract data: ${error.message}`);
    }
    throw new Error("An unknown error occurred while extracting data.");
  }
};