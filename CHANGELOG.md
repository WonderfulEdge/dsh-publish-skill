# Changelog

All notable changes to this project are documented here.

## Unreleased

- Derive runtime description and invocation policy from the canonical skill frontmatter.
- Validate required release guidance and relative skill resources.
- Verify the installable DSH bundle manifest.
- Test supported Node.js versions in CI.

## 1.0.0 - 2026-08-17

- Register the user-only `/publish-skill` workflow through `ctx.skills`.
- Support full, single-package, and resume-from-package XDSP release scopes.
- Require target-version validation, serial transpile/publish execution, and stop-on-failure reporting.
- Ship the XDSP package reference as a relative skill resource.
- Provide a `dsh.bundle` manifest for profile and plugin-market installation.
