export type Templates = Record<string, (data: unknown) => string>;

export abstract class TemplateBuilder {

  abstract exists(templateName: string): boolean;
  abstract render(template: string, data: unknown): string;
}
