const wait = async function (timeout) {
  await new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default {
  namespace: 'global',
  state: null,
  effects: {
    *waitForMe({ timeout }, { call }) {
      yield call(wait, timeout);
    },
  },
};
