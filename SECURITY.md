# Security Policy

## Scope

`dsh-publish-skill` registers instructions that may lead an agent to run `yarn transpile` and `npm publish` in a user's repository. The plugin itself does not read npm credentials, change registry configuration, or publish during installation.

The skill requires an explicit `/publish-skill` user gesture and asks for confirmation before the first publish operation unless the same conversation already contains an explicit immediate-release instruction.

## Reporting

Report suspected credential exposure, unexpected installation-time behavior, or a release flow that can publish outside the confirmed package set through a private GitHub security advisory for this repository. Do not include npm tokens, `.npmrc` contents, or other credentials in a public issue.

Include the affected commit, operating system, DSH version, invocation text, and sanitized command output when available.

## Supported Versions

Security fixes are applied to the latest release and the `main` branch. Older Git revisions are not maintained separately.
