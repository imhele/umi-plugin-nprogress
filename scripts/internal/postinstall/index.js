(async () => {
  await require('./yorkie')();
  const build = require('child_process').spawn('pnpm', ['run', 'build']);
  build.stdout.pipe(process.stdout, { end: false });
  build.stderr.pipe(process.stderr, { end: false });
})();
