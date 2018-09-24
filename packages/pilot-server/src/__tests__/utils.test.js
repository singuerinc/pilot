import { paramsToQuery } from '../utils';

describe('utils', () => {
  describe('paramsToQuery', () => {
    it('should return a query string', () => {
      const res = paramsToQuery({
        age: 50,
        gender: 'female'
      });

      expect(res).toBe('?age=50&gender=female');
    });

    it('should return an empty query string when an empty object is passed', () => {
      const res = paramsToQuery({});
      expect(res).toBe('');
    });
  });
});
