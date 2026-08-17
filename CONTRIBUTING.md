# Contributing

Changes should keep the plugin narrowly focused on repeatable XDSP frontend releases.

## Development

1. Edit the canonical skill under `skills/publish-skill/`.
2. Keep `disable-model-invocation: true` and `user-invocable: true`; publishing must remain an explicit user gesture.
3. Run the complete local checks:

```sh
npm test
npm run pack:check
```

4. Confirm the dry-run tarball includes `lib/`, `skills/`, `cordis.patch.yml`, `README.md`, and `LICENSE`, with no credentials, npm cache, or test profile.

## Behavior Changes

Release-flow changes must preserve these invariants:

- `TARGET_VERSION` is required and never guessed.
- Modules are processed serially.
- A transpile failure clearly limited to the TypeScript compile stage may be skipped, allowing that module to publish.
- Any other build failure, or a failed or uncertain publish, stops later modules and is not retried automatically.
- The skill does not log in to npm, rewrite registry configuration, commit Git changes, or expose credentials.

Update tests and user documentation in the same pull request when behavior changes.
