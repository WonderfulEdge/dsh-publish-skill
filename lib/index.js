import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-publish-skill'
export const inject = ['skills']

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const skillDirectory = join(packageRoot, 'skills', 'publish-skill')
const skillPath = join(skillDirectory, 'SKILL.md')

function frontmatterField(frontmatter, key, sourcePath) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match) throw new Error(`Missing ${key} in skill frontmatter: ${sourcePath}`)
  return match[1].trim()
}

export function parseSkillSource(source, sourcePath = '<skill>') {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`Invalid skill frontmatter: ${sourcePath}`)

  const [, frontmatter, content] = match
  const skillName = frontmatterField(frontmatter, 'name', sourcePath)
  const description = frontmatterField(frontmatter, 'description', sourcePath)
  const modelDisabled = frontmatterField(frontmatter, 'disable-model-invocation', sourcePath)
  const userInvocable = frontmatterField(frontmatter, 'user-invocable', sourcePath)

  if (skillName !== 'publish-skill') {
    throw new Error(`Unexpected skill name "${skillName}": ${sourcePath}`)
  }
  if (modelDisabled !== 'true' || userInvocable !== 'true') {
    throw new Error(`publish-skill must be user-only: ${sourcePath}`)
  }

  return { content, description }
}

function readSkillDefinition() {
  return parseSkillSource(readFileSync(skillPath, 'utf8'), skillPath)
}

export function apply(ctx) {
  const definition = readSkillDefinition()
  const registration = {
    name: 'publish-skill',
    description: definition.description,
    invocation: {
      modelInvocable: false,
      userInvocable: true,
    },
    source: 'bundled',
    provider: name,
    resourceBase: {
      kind: 'directory',
      path: skillDirectory,
    },
    path: skillPath,
    content: definition.content,
  }

  ctx.effect(
    () => ctx.skills.register(registration),
    'dsh-publish-skill: register skill',
  )
}
