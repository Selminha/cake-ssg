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
  contentPath: string;
}

export interface SectionMeta extends Meta {
  sections?: SectionMeta[];
  pages?: Meta[];
}

export interface GlobalData {
  rootSection : SectionMeta;
}
