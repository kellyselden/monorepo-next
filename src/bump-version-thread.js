'use strict';

const path = require('path');
const {
  read: readJson,
} = require('./json');
const semver = require('semver');
const { expose } = require('threads');

expose(async function bumpVersion({
  releaseTree,
  silent,
  dryRun,
  scripts,
  packageFiles,
  bumpFiles,
  versionOverride,
}) {
  let name = releaseTree.name;
  let cwd = releaseTree.cwd;

  let packageJsonPath = path.join(cwd, 'package.json');

  // eslint-disable-next-line no-inner-declarations
  async function originalVersion(options) {
    await require('standard-version')({
      path: cwd,
      skip: {
        commit: true,
        tag: true,
      },
      silent,
      dryRun,
      tagPrefix: `${name}@`,
      releaseAs: releaseTree.releaseType,
      scripts,
      packageFiles,
      bumpFiles,
      ...options,
    });
  }

  if (releaseTree.shouldBumpVersion) {
    let originalCwd = process.cwd();

    try {
      process.chdir(cwd);

      if (versionOverride) {
        await versionOverride({
          cwd,
          originalVersion,
        });
      } else {
        await originalVersion();
      }
    } finally {
      process.chdir(originalCwd);
    }

    let version;

    if (dryRun) {
      version = semver.inc(releaseTree.oldVersion, releaseTree.releaseType);
    } else {
      version = (await readJson(packageJsonPath)).version;
    }

    releaseTree.newVersion = version;
  }

  return releaseTree;
});
