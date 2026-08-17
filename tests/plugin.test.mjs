import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

import { apply, inject, name, parseSkillSource } from '../lib/index.js'

function testRegistrationLifecycle() {
  let registered
  let disposed = false
  let effectLabel

  const ctx = {
    effect(callback, label) {
      effectLabel = label
      this.dispose = callback()
    },
    skills: {
      register(skill) {
        registered = skill
        return () => {
          disposed = true
        }
      },
    },
  }

  apply(ctx)

  assert.equal(name, 'dsh-publish-skill')
  assert.deepEqual(inject, ['skills'])
  assert.equal(effectLabel, 'dsh-publish-skill: register skill')
  assert.equal(registered.name, 'publish-skill')
  assert.deepEqual(registered.invocation, {
    modelInvocable: false,
    userInvocable: true,
  })
  assert.equal(registered.source, 'bundled')
  assert.equal(registered.provider, 'dsh-publish-skill')
  assert.equal(registered.resourceBase.kind, 'directory')
  assert.ok(existsSync(registered.path))
  assert.match(registered.content, /^# XDSP 前端发版/m)
  assert.match(registered.content, /TARGET_VERSION/)
  assert.match(registered.content, /packages-reference\.md/)
  assert.doesNotMatch(registered.content, /^---$/m)

  ctx.dispose()
  assert.equal(disposed, true)
}

function testFrontmatter() {
  const source = readFileSync(
    new URL('../skills/publish-skill/SKILL.md', import.meta.url),
    'utf8',
  )
  const parsed = parseSkillSource(source, 'SKILL.md')

  assert.match(source, /^name: publish-skill$/m)
  assert.match(source, /^disable-model-invocation: true$/m)
  assert.match(source, /^user-invocable: true$/m)
  assert.match(parsed.description, /XDSP/)
  assert.match(parsed.content, /^# XDSP 前端发版/m)

  assert.throws(
    () => parseSkillSource(source.replace('user-invocable: true', 'user-invocable: false')),
    /must be user-only/,
  )
  assert.throws(() => parseSkillSource('# no frontmatter'), /Invalid skill frontmatter/)
}

testRegistrationLifecycle()
testFrontmatter()
console.log('publish-skill plugin tests passed')
