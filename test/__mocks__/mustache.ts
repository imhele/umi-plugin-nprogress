import { setContext } from '../index.test';

export default {
  render: (_: any, context: object): string => {
    setContext(context);
    return JSON.stringify(context);
  },
};
