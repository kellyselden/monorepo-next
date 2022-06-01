'use strict';

const { describe, it, setUpSinon } = require('./helpers/mocha');
const { expect } = require('./helpers/chai');
const path = require('path');
const buildDepGraph = require('../src/build-dep-graph');
const buildDAG = require('../src/build-dag');
const hasCycles = require('../src/has-cycles');
const { createTmpDir } = require('../src/tmp');
const fixturify = require('fixturify');
const stringifyJson = require('../src/json').stringify;

// const { hasCycles } = buildDAG;

let cwd = path.resolve(__dirname, './fixtures/workspace');

describe(hasCycles, function() {
  let tmpPath;

  // eslint-disable-next-line mocha/no-setup-in-describe
  setUpSinon();

  beforeEach(async function() {
    tmpPath = await createTmpDir();
  });

  it('finds a cycle', async function() {
    fixturify.writeSync(tmpPath, {
      'packages': {
        'package-a': {
          'package.json': stringifyJson({
            'name': 'package-a',
            'version': '0.0.0',
            'dependencies': {
              'package-b': '0.0.0',
            },
          }),
        },
        'package-b': {
          'package.json': stringifyJson({
            'name': 'package-b',
            'version': '0.0.0',
            'dependencies': {
              'package-a': '0.0.0',
            },
          }),
        },
      },
      'package.json': stringifyJson({
        'workspaces': [
          'packages/*',
        ],
      }),
    });

    let expected = true;

    let actual = await hasCycles({ workspaceCwd: tmpPath });

    expect(actual).to.equal(expected);
  });

  it('ignores a dev dependency cycle', async function() {
    fixturify.writeSync(tmpPath, {
      'packages': {
        'package-a': {
          'package.json': stringifyJson({
            'name': 'package-a',
            'version': '0.0.0',
            'dependencies': {
              'package-b': '0.0.0',
            },
          }),
        },
        'package-b': {
          'package.json': stringifyJson({
            'name': 'package-b',
            'version': '0.0.0',
            'devDependencies': {
              'package-a': '0.0.0',
            },
          }),
        },
      },
      'package.json': stringifyJson({
        'workspaces': [
          'packages/*',
        ],
      }),
    });

    let expected = false;

    let actual = await hasCycles({ workspaceCwd: tmpPath });

    expect(actual).to.equal(expected);
  });
});
