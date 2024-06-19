export interface CanvasField {
  type: string;
  id: string;
  url: string | undefined;
  method: string | undefined;
  dataFields?: string[];
  x: number;
  y: number;
}
