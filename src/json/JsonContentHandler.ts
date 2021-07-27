import * as fs from 'fs';
import { ContentHandler } from '../ContentHandler';

export class JsonContentHandler extends ContentHandler {

  getContent(filePath: string): unknown {
    try {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
      if (content.length === 0)
        return {};

      return (JSON.parse(content));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      console.log('file ' + filePath + ' not found');
      return {};
    }
  }
}
