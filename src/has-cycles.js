'use strict';

const buildDepGraph = require('./build-dep-graph');
// const buildChangeGraph = require('./build-change-graph');
// const { collectPackages } = require('./build-dep-graph');
const buildDAG = require('./build-dag');
// const {
//   getWorkspaceCwd,
// } = require('./git');

// const { builder } = require('../bin/commands/changed');

const { collectPackages } = buildDepGraph;

async function hasCycles({
  // cwd = process.cwd(),
  workspaceCwd,
  // shouldOnlyIncludeReleasable = builder['only-include-releasable'].default,
  // shouldExcludeDevChanges = builder['exclude-dev-changes'].default,
  // fromCommit,
  // fromCommitIfNewer,
  // toCommit,
  // sinceBranch,
  // cached,
} = {}) {
  // let workspaceCwd = await getWorkspaceCwd(cwd);

  let workspaceMeta = await buildDepGraph({ workspaceCwd });

  let visitedNodes = {};

  for (let _package of collectPackages(workspaceMeta)) {
    if (!_package.packageName || !_package.version) {
      continue;
    }

    try {
      buildDAG(workspaceMeta, _package.packageName, {
        visitedNodes,
        shouldThrowOnCycle: true,
      });
    } catch (err) {
      return true;
    }
  }

  // let _hasCycles = await hasCycles({
  //   workspaceMeta,
  // });

  return false;
}

module.exports = hasCycles;
