import 'jest';
import Wrapper from '../src/Wrapper';
import { isStarted } from './__mocks__/nprogress';

jest.mock('nprogress');

Object.defineProperty(window, 'g_app', {
  value: {
    _store: {
      loading: {
        global: true,
      },
    },
  },
});

describe('Wrapper.test.ts', () => {
  test('Component exists', () => {
    expect(Wrapper).toBeTruthy();
  });

  test('SFC render correctly', () => {
    expect((<any>window).g_app._store.loading.global).toBe(true);
    expect(Wrapper({ children: 'test' })).toBe('test');
    expect(isStarted()).toBe(true);
    expect(Wrapper({ children: 'test' })).toBe('test');
    expect(isStarted()).toBe(true);
    (<any>window).g_app._store.loading.global = false;
    expect(Wrapper({ children: 'test' })).toBe('test');
    expect(isStarted()).toBe(false);
    expect(Wrapper({ children: 'test' })).toBe('test');
    expect(isStarted()).toBe(false);
  });
});
