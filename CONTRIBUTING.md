## Radar Contribution Guide

Thank you for your interest in contributing to Radar! We welcome contributions from anyone on the internet, and are grateful for even the smallest of fixes!

### How to contribute

If you'd like to contribute, please fork the repo, fix, commit and send a pull request against the `beta` branch for the maintainers to review and merge into the main code base. If you wish to submit more complex changes, please check with a core dev first on [Radar Relay Slack](https://radarrelay.slack.com/) in the #dev channel to ensure those changes are in-line with the general philosophy of the project and/or to get some early feedback which can make both your efforts easier as well as our review and merge procedures quick and simple.

We encourage a “PR early” approach so create the PR as early as possible even without the fix/feature ready, so that devs and other contributors know you have picked up the issue. These early PRs should indicate an 'in progress' status by adding the 'WIP' label to the PR. Please make sure your contributions adhere to our coding guidelines:

*   Pull requests adding features or refactoring should be opened against the `beta` branch
*   Pull requests fixing bugs in the latest release version should be opened against the `master` branch
*   Write [good commit messages](https://chris.beams.io/posts/git-commit/)

### Code quality

Because our repositories are used by automated traders and other projects in production, we strive for exceptional code quality. Please follow the existing code standards and conventions – `tslint`.

If you're adding functionality, please also add tests and make sure they pass. We have an automatic coverage reporting tool, so we'll see it if they are missing ;)
If you're adding a new public function/member, make sure you document it with Java doc-style comments. We use typedoc to generate documentation from the comments within our source code.

### Styleguide

We use [TSLint](https://palantir.github.io/tslint/) with [custom configs](https://github.com/0xProject/0x-monorepo/tree/development/packages/tslint-config) to keep our code style consistent.

To lint your code just run: `yarn lint`

If using the Atom text editor, we recommend you install the following packages:

*   [atom-typescript](https://atom.io/packages/atom-typescript)
*   [linter-tslint](https://atom.io/packages/linter-tslint)

### Branch structure & versioning

We use [semantic versioning](http://semver.org/), but before a package reaches v1.0.0 all breaking changes as well as new features will be minor version bumps.

We have two main branches: `master` and `beta`.

`master` represents the most recent released (published on npm) version.

`beta` represents the development state and is a default branch to which you will submit a PR. We use this structure so that we can push hotfixes to the currently released version without needing to publish all the changes made towards the next release. If a hotfix is implemented on `master`, it is back-ported to `beta`.