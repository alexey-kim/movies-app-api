import { SinonStub, stub } from 'sinon';
import { getAbsolutePath } from '../fileUtils';

describe('fileUtils', () => {

  let processStub: SinonStub<any>;
  beforeEach(() => processStub = stub(process, 'cwd').returns('process/cwd'));
  afterEach(() => processStub.restore());

  describe('getAbsolutePath', () => {

    const scenarios: Array<[string[], string]> = [
      [[], 'process/cwd'],
      [['path1'], 'process/cwd/path1'],
      [['/path1/'], 'process/cwd/path1'],
      [['/path1//'], 'process/cwd/path1'],
      [['path1', 'path2'], 'process/cwd/path1/path2'],
      [['/path1/', '/path2/'], 'process/cwd/path1/path2'],
      [['/path1//', '/path2//'], 'process/cwd/path1/path2']
    ];
    scenarios.forEach(([paths, expectedAbsolutePath]) => {
      it(`Should get correct absolute path for [${paths}]`, () => {
        expect(getAbsolutePath(...paths)).toBe(expectedAbsolutePath);
        expect(processStub.calledOnceWithExactly()).toBe(true);
      });
    });
  });
});
