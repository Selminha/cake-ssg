import * as fs from 'fs';
import { ContentHandler } from './ContentHandler';

export class JsonContentHandler extends ContentHandler {

  getFileContent(filename: string): unknown {
    try {
      const content = fs.readFileSync(filename, { encoding: 'utf-8' });
      if (content.length === 0)
        return {};

      return (JSON.parse(content));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      console.log('file ' + filename + ' not found');
      return {};
    }
  }
}
