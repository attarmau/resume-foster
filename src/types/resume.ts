export interface Resume {
    id: string;
    name: string; // e.g., "Software Engineer Resume"
    role: string; // e.g., "Frontend Developer"
    fileUrl: string; // Blob URL or storage key
    fileName: string;
    dateUploaded: string;
}
