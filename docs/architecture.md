# Architecture

## Package Layout

- `cordis.patch.yml` inserts the `dsh-publish-skill` Host plugin into an installed profile.
- `lib/index.js` is the zero-build ESM runtime entry.
- `skills/publish-skill/SKILL.md` is the canonical metadata and instruction source.
- `skills/publish-skill/packages-reference.md` is resolved through the skill's directory resource base.

## Registration

At activation, the Host plugin reads and validates the canonical frontmatter, then registers one skill through `ctx.skills.register()`:

- name: `publish-skill`
- model invocation: disabled
- user invocation: enabled
- source: bundled
- resource base: the packaged skill directory

The registration disposer is owned by a Cordis effect. Stopping, updating, or uninstalling the plugin removes exactly this contribution without changing user skill files.

## Trust Boundary

Installing the plugin only reads packaged text and registers it. No release command runs at plugin activation time.

The release side effects happen later through the normal agent tool and approval boundaries after a user explicitly invokes `/publish-skill`. The skill instructs the agent to validate scope, confirm the package order, and process one package at a time. Publication depends only on a successful transpile stage; the subsequent TypeScript compile stage is ignored. A transpile-stage failure, an unconfirmed transpile result, or a failed or uncertain publish stops the workflow.

## Source of Truth

Runtime metadata is derived from `SKILL.md` rather than duplicated in JavaScript. `scripts/validate-skill.mjs` checks workflow invariants and relative resources, while `scripts/verify-package.mjs` checks the DSH bundle contract. This keeps manual installation and plugin installation behavior aligned.
