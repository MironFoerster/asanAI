export interface ChatElement {
    type: string, // "question", "info", "visual"
    message: string,
    options: string[],
    visualizationName: string // TODO?
}