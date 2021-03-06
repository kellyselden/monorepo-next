'use strict';

const execa = require('execa');

async function getCurrentBranch(cwd) {
  return (await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd })).stdout;
}

async function getCurrentCommit(cwd) {
  return (await execa('git', ['rev-parse', 'HEAD'], { cwd })).stdout;
}

async function getCommitAtTag(tag, cwd) {
  return (await execa('git', ['rev-list', '-1', tag], { cwd })).stdout;
}

async function getFirstCommit(cwd) {
  // https://stackoverflow.com/a/5189296
  let rootCommits = (await execa('git', ['rev-list', '--max-parents=0', 'HEAD'], { cwd })).stdout;
  return getLinesFromOutput(rootCommits)[0];
}

async function getWorkspaceCwd(cwd) {
  return (await execa('git', ['rev-parse', '--show-toplevel'], { cwd })).stdout;
}

function getLinesFromOutput(output) {
  return output.split(/\r?\n/).filter(Boolean);
}

module.exports = {
  getCurrentBranch,
  getCurrentCommit,
  getCommitAtTag,
  getFirstCommit,
  getWorkspaceCwd,
  getLinesFromOutput,
};
