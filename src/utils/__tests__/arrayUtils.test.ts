import { joinNotEmptyNorWhitespace } from '../arrayUtils';

describe('arrayUtils', () => {

  describe('joinNotEmptyNorWhitespace', () => {

    it('Should ignore undefined, empty strings and whitespaces', () => {
      const items: Array<string | undefined> = [undefined, '', ' ', '  ', 'text1', undefined, '', ' ', '  ', 'text2', '  ', ' ', '', undefined, 'text3', '  ', ' ', '', undefined];
      expect(joinNotEmptyNorWhitespace(items, '.')).toBe('text1.text2.text3');
      expect(joinNotEmptyNorWhitespace(items, ', ')).toBe('text1, text2, text3');
    });
  });
});
