import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const patch = readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8')

assert.equal(manifest.name, 'dsh-publish-skill')
assert.equal(manifest.type, 'module')
assert.equal(manifest.main, 'lib/index.js')
assert.equal(manifest.exports?.['.'], './lib/index.js')
assert.equal(manifest.dsh?.bundle?.patch, './cordis.patch.yml')
assert.ok(manifest.files.includes('lib/'))
assert.ok(manifest.files.includes('skills/'))
assert.ok(manifest.files.includes('cordis.patch.yml'))
assert.equal(manifest.repository?.url, 'git+https://github.com/WonderfulEdge/dsh-publish-skill.git')
assert.match(patch, /^\s*- id: dsh-publish-skill$/m)
assert.match(patch, /^\s*name: dsh-publish-skill$/m)

console.log(`verified ${manifest.name}@${manifest.version} bundle manifest`)
