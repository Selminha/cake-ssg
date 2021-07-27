export interface SectionMeta {
  sections: string[];
  pages: string[];
}

export interface Section {
  meta: SectionMeta;
  content?: unknown;
}
