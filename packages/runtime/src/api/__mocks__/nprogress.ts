const NProgress = {
  configure: jest.fn(),
  done: jest.fn(),
  inc: jest.fn(),
  isStarted: jest.fn(),
  remove: jest.fn(),
  set: jest.fn(),
  settings: {
    easing: 'ease',
    minimum: 0.08,
    parent: 'body',
    showSpinner: true,
    speed: 200,
    template: '',
    trickle: true,
    trickleSpeed: 800,
  },
  start: jest.fn(),
  status: null,
  version: '0.2.0',
} as const;

export default NProgress;
