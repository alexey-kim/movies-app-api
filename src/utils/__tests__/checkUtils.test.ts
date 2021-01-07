import { assertInternalError } from '../../../tests/testUtils';
import { equalsAnyCase, isNullOrUndefined, nonExhaustiveSwitchCase } from '../checkUtils';

describe('checkUtils', () => {

  describe('nonExhaustiveSwitchCase', () => {

    it('Should throw internal error', async () => {
      // Confuse type checks of Typescript
      const value: string = 123 as any;
      if (typeof value !== 'string') { // tslint:disable-line: strict-type-predicates
        await assertInternalError(
          () => nonExhaustiveSwitchCase(value),
          `Switch statement hasn't defined all possible cases. [123] must be explicitly defined in switch statement.`
        );
      } else {
        throw new Error('Invalid test');
      }
    });
  });

  describe('isNullOrUndefined', () => {

    [null, undefined].forEach(value => {
      it(`Should return true for [${value}]`, () => {
        expect(isNullOrUndefined(value)).toBe(true);
      });
    });

    [
      true, false,
      -123, 0, 123,
      '', ' ', 'text',
      [], [1, 2, 3],
      {}, { a: 123 },
      new Date()
    ].forEach(value => {
      it(`Should return false for [${value}]`, () => {
        expect(isNullOrUndefined(value)).toBe(false);
      });
    });
  });

  describe('equalsAnyCase', () => {

    [
      [null, null],
      [undefined, undefined],
      ['', ''],
      [' ', ' '],
      ['text', 'text'],
      ['tExT', 'TeXt']
    ].forEach(([text1, text2]) => {
      it(`Should return true for [${text1}] and [${text2}]`, () => {
        expect(equalsAnyCase(text1, text2)).toBe(true);
      });
    });

    [
      [undefined, null],
      [undefined, ''],
      [undefined, ' '],
      [undefined, 'text'],
      [null, undefined],
      [null, ''],
      [null, ' '],
      [null, 'text'],
      ['', ' '], [' ', ''],
      ['text', ' text'], ['text', 'text '], ['text', ' text '],
      ['text', 'another text'],
      ['tExT', 'AnOtHeR TeXt']
    ].forEach(([text1, text2]) => {
      it(`Should return false for [${text1}] and [${text2}]`, () => {
        expect(equalsAnyCase(text1, text2)).toBe(false);
      });
    });
  });
});
