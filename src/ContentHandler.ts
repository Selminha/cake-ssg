export abstract class ContentHandler {

  abstract getFileContent(filename: string): unknown;
}
