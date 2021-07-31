export interface Content {
  content?: unknown;
}

export interface SectionMeta extends Meta {
  sections: SectionMeta[];
  pages: Meta[];
}

export interface Section extends Content {
  meta: SectionMeta;
}

export interface Meta {
  name: string;
  url: string;
}

export interface Page extends Content {
  meta: Meta;
}
