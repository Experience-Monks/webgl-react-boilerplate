# Contributing to this library

Are you thinking about getting involved with the library? Great!, there are a few things you need to know.

## Code of Conduct

We have adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Branching

Our `master` branch has the latest code, with tests passing after every PR is merged. However, if you want to use the latest stable version is recommended to download the latest release.

### Branching name convention

`[topic]/[natural-name]`

Where [topic] are the same types requires by [commitlint](.commitlintrc.yml)

## Semantic Versioning

We follow [semantic versioning](http://semver.org/). We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance.

We tag every pull request with a label marking whether the change should go in the next patch, minor, or a major version.

Every significant change is documented in the [changelog file](CHANGELOG.md).

## Bugs

We are using GitHub Issues for our public bugs. Before creating a new issue, try to make sure your problem doesn’t already exist.

We are using a template for our issues, using this template will reduce the time of understanding the issue and creating a solution.

## Pull Requests

Pull Requests are welcome, please follow our template.

You should always create Pull Request and never merge directly to `master`, and the `master` branch will be protected by default.

## Coding Style Guides

To ensure following the same code style guidelines we are using in the repository Prettier and ESLint. By default, the repository is set up to avoid pushing if the coding rules are not being followed.
