import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseSkillSource } from '../lib/index.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillPath = resolve(root, 'skills', 'publish-skill', 'SKILL.md')
const source = readFileSync(skillPath, 'utf8')
const definition = parseSkillSource(source, skillPath)

for (const required of [
  'TARGET_VERSION',
  'START_PACKAGE',
  'PACKAGE',
  'yarn transpile',
  'npm publish',
  '失败处理',
  '发布汇总',
]) {
  assert.ok(definition.content.includes(required), `SKILL.md is missing required guidance: ${required}`)
}

const shellBlocks = [...definition.content.matchAll(/```(?:bash|sh)\r?\n([\s\S]*?)```/g)]
  .map((match) => match[1])
  .join('\n')
assert.doesNotMatch(shellBlocks, /npm publish\b[^\n]*--force/)
assert.doesNotMatch(shellBlocks, /git push\b[^\n]*--force/)

const links = [...definition.content.matchAll(/\[[^\]]+\]\((?!https?:|#)([^)]+)\)/g)]
for (const [, target] of links) {
  assert.ok(existsSync(resolve(dirname(skillPath), target)), `Missing skill resource: ${target}`)
}

console.log(`validated publish-skill (${links.length} relative resource link(s))`)
