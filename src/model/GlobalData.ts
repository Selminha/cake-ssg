export interface GlobalData {
  rootSection : Section;
}

export interface Item {
  name: string;
  url: string;
  contentPath: string;
}

export interface Section extends Item {
  pages?: Item[];
  sections?: Section[];
}
