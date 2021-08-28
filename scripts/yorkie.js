const path = require('path');
const installFrom = require('yorkie/src/install');
const isCI = require(require.resolve('is-ci', {
  paths: [require.resolve('yorkie/src/install')],
}));

console.log('\nRegister git hooks for yorkie...');

if (isCI && !process.env.HUSKY_IGNORE_CI && !process.env.YORKIE_IGNORE_CI) {
  return console.log('CI detected, skipping Git hooks installation');
}

if (process.env.HUSKY_SKIP_INSTALL || process.env.YORKIE_SKIP_INSTALL) {
  return console.log(
    `env variable HUSKY_SKIP_INSTALL is set to ${process.env.HUSKY_SKIP_INSTALL}, skipping Git hooks installation`,
  );
}

console.log('setting up Git hooks');

installFrom(path.join(__dirname, '..'));
