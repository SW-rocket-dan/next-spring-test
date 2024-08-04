// interfaces/template.ts
export interface Template {
    id: number;
    userId: number;
    title: string;
    description: string;
    likes: number;
    purchaseCount: number;
    editor: string;
    fileUrl: string;
    templateTags: Tag[];
    prompt: Prompt;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Tag {
    english: string;
    korean: string;
  }
  
  export interface Prompt {
    phraseDto: PhraseDto;
    purpose: string;
    color: string;
    model: string;
  }
  
  export interface PhraseDto {
    phrases: string[];
    firstEmphasis: string;
    secondEmphasis: string;
  }