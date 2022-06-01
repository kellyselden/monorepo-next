'use strict';

// const commonArgs = require('../common-args');

module.exports = {
  command: 'has-cycles',
  describe: 'detect and prevent dependency cycles',
  // builder: {
  //   'only-include-releasable': commonArgs['only-include-releasable'],
  //   'exclude-dev-changes': commonArgs['exclude-dev-changes'],
  //   'silent': commonArgs['silent'],
  // },
  async handler(argv) {
    const {
      getWorkspaceCwd,
    } = require('../../src/git');
    const hasCycles = require('../../src/has-cycles');

    let workspaceCwd = await getWorkspaceCwd();

    let _hasCycles = await hasCycles({
      workspaceCwd,
    });

    if (_hasCycles) {
      console.log('cycles detected');

      process.exitCode = 1;
    } else {
      console.log('no cycles detected');
    }
  },
};
