# Troubleshooting

## `/publish-skill` Is Not Listed

1. Confirm the plugin is a dependency of the active profile and appears in `dsh.profile.bundles`.
2. Restart the Harness process after installation so the profile composition reloads.
3. Check startup logs for `dsh-publish-skill` loader or frontmatter errors.
4. Verify the conversation uses the profile where the plugin was installed.

The skill is intentionally absent from model-facing catalogs. It should appear only in the user slash-command skill list.

## Target Version Is Rejected

Use a valid npm package version such as `2.1.4` or `2.1.4-beta.0`. The skill does not normalize or guess malformed versions.

## `yarn transpile` Fails

If the failure is clearly limited to the TypeScript compile stage, the workflow records a warning, skips that failed stage, and still runs `npm publish` for the current package. Other transpile failures, or failures whose stage cannot be identified confidently, stop the workflow before publishing.

## `npm publish` Reports Authentication or Registry Errors

Authenticate outside the skill against the registry declared by the package's `publishConfig.registry`. Do not paste npm tokens or `.npmrc` contents into the conversation.

## Version Already Exists

An npm registry generally rejects republishing the same package version. Verify whether the package is already present, choose a new target version if appropriate, and do not use `--force`.

## Publish Result Is Uncertain

Do not retry immediately. Query the configured registry for the exact package and version first. If it exists, resume from the next unprocessed package; if it does not, resume from the uncertain package. Preserve the command output needed to make that decision, with credentials removed.

## Windows Path or Shell Problems

The skill does not require Bash. When `deploy-run.sh` cannot run, the agent should execute the documented package steps directly with each package directory as the working directory.
