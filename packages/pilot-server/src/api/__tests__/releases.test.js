import { releaseIsAlpha, notVersionNum, serialize } from '../releases';

describe('releases', () => {
  describe('isAlpha', () => {
    it('should return true when is an alpha release', () => {
      const x = {
        type: 'alpha'
      };
      expect(releaseIsAlpha(x)).toBe(true);
    });

    it('should return false when is not an alpha release', () => {
      const x = {
        type: 'beta'
      };

      expect(releaseIsAlpha(x)).toBe(false);
    });
  });

  describe('notVersionNum', () => {
    it('should return true when is not a release', () => {
      expect(notVersionNum('created')).toBe(true);
    });

    it('should return true when is not a release', () => {
      expect(notVersionNum('modified')).toBe(true);
    });

    it('should return false when is a release', () => {
      expect(notVersionNum('1.0.0')).toBe(false);
    });
  });

  describe('serialize', () => {
    it('should serialize a release', () => {
      expect(
        serialize(
          { '1.0.1': '2018-05-18T11:17:35.529Z' },
          ['1.0.0', '1.0.1', '1.1.0'],
          '1.0.1'
        )
      ).toStrictEqual({
        _id: '1.0.1',
        version: '1.0.1',
        date: 1526642255529,
        tarball: '',
        type: 'release'
      });
    });
  });
});
