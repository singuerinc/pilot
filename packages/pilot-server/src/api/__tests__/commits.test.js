import { url, serialize } from '../commits';

describe('commits', () => {
  describe('serialize', () => {
    it('should serialize a commit', () => {
      const input = {
        id: '123',
        authorTimestamp: '4321'
      };
      const x = serialize(input);

      expect(x).toStrictEqual({
        _id: '123',
        date: '4321'
      });
    });

    it('should return null date if the authorTimestamp is not present', () => {
      const input = {
        id: '123'
      };
      const x = serialize(input);

      expect(x).toStrictEqual({
        _id: '123',
        date: null
      });
    });
  });

  describe('url', () => {
    it('should return a contructed url', () => {
      const input = url('MY_PROJECT', 'MY_REPO', { limit: 100 });
      const expected =
        'https://bitbucket.com/rest/api/1.0/projects/MY_PROJECT/repos/MY_REPO/commits?limit=100';

      expect(input).toBe(expected);
    });
  });
});
