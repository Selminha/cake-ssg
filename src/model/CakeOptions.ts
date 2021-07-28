export interface CakeOptions {
  templateFolder: string;
  contentFolder: string;
  outputFolder: string;
  handlebars?: HandlebarsOptions;
}

export interface HandlebarsOptions {
  partialsFolder: string;
}
