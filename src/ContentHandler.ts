export abstract class ContentHandler {

  /** Reads the file from given path and returns a JSON with its contents */
  abstract getContent(filePath: string): unknown;
}
