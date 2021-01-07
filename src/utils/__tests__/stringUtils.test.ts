import { toInt } from '../stringUtils';

describe('stringUtils', () => {

  describe('toInt', () => {

    const scenarios: Array<[number | string, number]> = [
      ['-123', -123], [' -123 ', -123], [-123, -123],
      ['0', 0], [' 0 ', 0], [0, 0],
      ['+123', 123], [' +123 ', 123], [123, 123],
      ['123', 123], [' 123 ', 123]
    ];
    scenarios.forEach(([value, expectedInt]) => {
      it(`Should return correct integer number for valid [${value}]`, () => {
        expect(toInt(value)).toBe(expectedInt);
      });
    });

    [
      null, undefined,
      '', ' ',
      '-', ' - ',
      '- 123', ' - 123 ',
      '+', ' + ',
      '+ 123', ' + 123 ',
      '123a', ' 123a ',
      'a123', ' a123 ',
      '1.23', ' 1.23 ',
      '1.23a', ' 1.23a ',
      'a1.23', ' a1.23 ',
      '.123', ' .123 ',
      '123.', ' 123. ',
      'text', ' text ',
      true, false,
      -123.45, 123.45,
      [], [123],
      {}, { a: 123 }
    ].forEach(value => {
      it(`Should return undefined for invalid [${value}]`, () => {
        expect(toInt(value)).toBeUndefined();
      });
    });
  });
});
