/**
 * build Compile related changes, such as release, dependence on the project build or changes
 * chore Any other changes, Such as change the build process, or add dependent libraries, tools, etc
 * docs Document revision
 * feat New features and new features
 * fix Modify the bug
 * perf Optimization related, such as improving performance, experience
 * refactor Code refactoring
 * revert Roll back to the previous version
 * style Code format modification
 * test Test case modification
 */

module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
}