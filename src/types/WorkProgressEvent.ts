export interface WorkProgressEvent {
  id: string;
  workId: string;
  progress: number; // The new progress value
  tsISO: string;
}
