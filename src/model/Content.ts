export interface Content {
  content?: unknown;
}

export interface SectionMeta {
  sections: string[];
  pages: string[];
}

export interface Section extends Content {
  meta: SectionMeta;
}

export interface Page extends Content {
}
