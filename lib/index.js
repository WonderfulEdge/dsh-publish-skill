import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-publish-skill'
export const inject = ['skills']

const description = 'XDSP 前端发版技能。按顺序发布 packages 下的子模块，或发布用户指定的单个子模块；统一修改 package.json version，执行 yarn transpile，再执行 npm publish。仅当用户手动输入 /publish-skill 时调用。'
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const skillDirectory = join(packageRoot, 'skills', 'publish-skill')
const skillPath = join(skillDirectory, 'SKILL.md')

function readSkillContent() {
  const source = readFileSync(skillPath, 'utf8')
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)

  if (!match) {
    throw new Error(`Invalid publish-skill frontmatter: ${skillPath}`)
  }

  return match[1]
}

export function apply(ctx) {
  const registration = {
    name: 'publish-skill',
    description,
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
    content: readSkillContent(),
  }

  ctx.effect(
    () => ctx.skills.register(registration),
    'dsh-publish-skill: register skill',
  )
}
