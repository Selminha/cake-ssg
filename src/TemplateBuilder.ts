export type Templates = Record<string, (data: unknown) => string>;

export abstract class TemplateBuilder {

  abstract build(): Templates;
}
