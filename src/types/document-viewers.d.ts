declare module "mammoth/mammoth.browser" {
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: unknown[] }>;
}

declare module "epubjs" {
  type Rendition = {
    display(): Promise<void>;
    destroy(): void;
  };

  type Book = {
    renderTo(element: HTMLElement, options: { width: string; height: string; spread: string }): Rendition;
    destroy(): void;
  };

  export default function ePub(input: ArrayBuffer): Book;
}