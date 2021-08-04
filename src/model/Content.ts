export interface PageContext extends Content, GlobalData {
  meta: Meta;
}

export interface SectionContext extends Content, GlobalData {
  meta: SectionMeta;
}

export interface Content {
  content: unknown;
}

export interface Meta {
  name: string;
  url: string;
}

export interface PageMeta extends Meta {
  contentPath: string;
}

export interface SectionMeta extends Meta {
  sectionPath: string;
  contentPath?: string;
  sections?: SectionMeta[];
  pages?: PageMeta[];
}

export interface GlobalData {
  rootSection : SectionMeta;
}
