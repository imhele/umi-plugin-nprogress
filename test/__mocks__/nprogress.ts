let started: boolean = false;

const isStarted = () => started;

const done = () => {
  started = false;
};

const start = () => {
  started = true;
};

export { isStarted, done, start };

export default ({
  isStarted,
  done,
  start,
});
