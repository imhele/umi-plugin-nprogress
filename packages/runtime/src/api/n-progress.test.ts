import MockNProgress from '../__mocks__/nprogress';
import { NProgress } from './n-progress';

describe('class NProgress', () => {
  it('should exist', () => {
    expect(NProgress).toBe(MockNProgress);
  });
});
