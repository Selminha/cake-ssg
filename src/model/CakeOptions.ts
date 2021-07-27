export interface CakeOptions {
  templateFolder: string;
  contentFolder: string;
  outputFolder: string;
  contentFileType: string;
  handlebars?: HandlebarsOptions;
}

export interface HandlebarsOptions {
  partialsFolder: string;
}
