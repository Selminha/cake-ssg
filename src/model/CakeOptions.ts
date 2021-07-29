export interface CakeOptions {
  outputFolder: string;
  handlebars?: HandlebarsOptions;
}

export interface HandlebarsOptions {
  partialsFolder: string;
  helpers?: Record<string, Handlebars.HelperDelegate>;
}
