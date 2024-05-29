export interface LabVersion {
    tag: string, // "question", "info", "visual"
    commit_message: string,
    labId: string[],
    timestamp: string // TODO?
}