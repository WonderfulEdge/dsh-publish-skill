---
name: publish-skill
description: XDSP 前端发版技能。按顺序发布 packages 下的子模块，或发布用户指定的单个子模块；统一修改 package.json version，执行 yarn transpile，再执行 npm publish。仅当用户手动输入 /publish-skill 时调用。
disable-model-invocation: true
user-invocable: true
---

# XDSP 前端发版

对 XDSP 前端仓库执行可恢复的顺序发版。除非用户明确要求单模块发布，否则按目录名字母序处理 `packages/` 下的直属子目录。

## 输入参数

执行前，从用户消息中提取以下参数：

| 参数 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- |
| `TARGET_VERSION` | 是 | 所有待发布模块的目标版本 | `2.1.4-beta.0` |
| `START_PACKAGE` | 否 | 全量发版时从哪个模块开始，适用于失败后续发 | `xdsp-chatbi` |
| `PACKAGE` | 否 | 只发布一个模块；指定后不遍历其他模块 | `xdsp-bi` |

如果用户没有提供 `TARGET_VERSION`，必须先询问，不能猜测。用户同时指定 `PACKAGE` 和 `START_PACKAGE` 时，先询问其真实意图，不能自行选择。

把用户提供的版本号作为字符串使用。修改任何文件前，确认它是 npm 接受的有效版本号；若无把握，可执行 `npm view` 之外的本地 semver 校验，校验失败时停止并要求用户更正，不得擅自改写版本号。

## 进度管理

开始后维护以下进度，并在每个模块完成后立即更新：

```text
Task Progress:
- [ ] 确认 TARGET_VERSION 和发布范围
- [ ] 列出并确认待发布模块
- [ ] 依次执行：修改 version -> yarn transpile -> npm publish
- [ ] 汇总发布结果
```

发布是有外部副作用的操作。首次执行 `npm publish` 前，向用户展示目标版本和有序模块列表，并取得明确确认。若当前对话中用户已明确要求按该版本立即发布，可视为已经确认；不要重复询问。

## 1. 确定模块列表

1. 找到项目根目录及其 `packages/` 目录。不存在时停止并报告路径问题。
2. 仅读取 `packages/` 的直属子目录；只纳入包含 `package.json` 的目录。
3. 按目录名的字母序排列，与项目 `deploy-run.sh` 的预期顺序保持一致。
4. 默认排除已废弃或无需构建的 `xdsp-core`、`hzero-front-hpfm-dpc`。
5. 如果存在 `deploy-run.sh` 或 `config/packages-config.js`，读取并检查它们是否定义了更窄的发布集合或不同顺序。若与实际目录或本技能冲突，在发布前向用户说明并确认，不要静默扩大范围。
6. 指定 `START_PACKAGE` 时，确认它存在于有序列表，从该模块开始保留到列表末尾，跳过之前的模块。
7. 指定 `PACKAGE` 时，确认该模块存在且含 `package.json`，列表中只保留该模块。
8. 没有待发布模块时停止，不执行任何发布命令。

完整的常见模块和中文说明见 [packages-reference.md](packages-reference.md)。实际仓库内容及仓库自身配置优先于参考表。

## 2. 逐模块发布

严格串行处理列表。必须等待当前模块的 `transpile` 得出结果后才能决定下一步：成功时执行该模块的 `publish`；若失败原因能明确确认仅来自 TypeScript 编译阶段，则跳过该失败阶段并仍然执行当前模块的 `publish`。执行了 `publish` 时，必须等待其成功后才能进入下一个模块。

对每个 `<pkg>`：

1. 读取 `packages/<pkg>/package.json`。
2. 仅把顶层 `version` 字段改为 `TARGET_VERSION`，保持 JSON 正确，并保留其他字段、缩进和换行风格。
3. 重新读取或解析文件，确认顶层 `version` 等于目标版本且没有改动其他字段。
4. 以 `packages/<pkg>` 为工作目录执行构建：

```bash
yarn transpile
```

5. `yarn transpile` 成功，或者失败原因能明确确认仅来自 TypeScript 编译阶段时，在同一目录继续执行：

```bash
npm publish
```

不要并行执行多个模块，也不要在项目根目录批量启动这些命令。

### 失败处理

#### TypeScript 编译阶段失败

`yarn transpile` 返回失败时，检查输出并确认失败阶段。只有日志明确指向 TypeScript 编译阶段（例如 `tsc` 或 `TSxxxx` 诊断），且没有同时出现其他构建阶段错误时，才允许跳过该失败：

- 记录模块、TypeScript 编译阶段和关键错误信息，并标记为“TypeScript 编译失败已跳过”。
- 不自动重试 `yarn transpile`，仍然对当前模块执行 `npm publish`。
- `npm publish` 成功后继续处理有序列表中的下一个模块，不需要再次询问用户。
- 不得把无法确认阶段的失败、依赖缺失、脚本启动失败或其他构建工具错误归类为可跳过的 TypeScript 编译失败。

#### 其他构建失败

`yarn transpile` 的失败不满足上述条件时立即停止，不执行当前模块的 `npm publish`，也不处理后续模块。记录失败模块、构建阶段和关键错误信息，且不自动重试。

#### npm 发布失败或状态不确定

`npm publish` 失败或输出无法明确判断是否成功时立即停止：

- 记录失败模块、发布阶段和关键错误信息。
- 不处理后续模块，也不自动重试 `npm publish`，避免不确定发布结果导致重复操作。
- 若输出无法明确判断是否已成功，标记为“发布状态待核实”，提示用户先查询 registry，再决定是否用 `START_PACKAGE` 续发。
- 若错误涉及认证或 registry，提示检查 npm 凭证，以及模块 `publishConfig.registry`。常用 registry 为 `http://nexus.saas.hand-china.com/content/repositories/hdsp-ui/`，但以模块实际配置为准。
- 告知用户可再次调用 `/publish-skill TARGET_VERSION=<version> START_PACKAGE=<failed-package>` 从失败模块续发。

不要回滚已经成功发布的模块。未成功发布模块中已经修改的本地 `package.json` 也不要擅自恢复；在汇总中明确说明其状态。

## 3. 发布汇总

结束时输出：

- 成功发布的模块及版本号；其中带有已跳过 TypeScript 编译失败的模块必须单独标注，并附关键编译错误信息。
- 其他构建失败、发布失败或状态待核实的模块、阶段和原因；没有这类失败则明确写明。
- 因其他构建失败、发布失败或状态不确定而未处理的后续模块。
- 已修改版本但未确认发布成功的模块。
- 本次使用的 registry（可从各模块 `publishConfig.registry` 或 npm 配置判断时）。
- 明确说明没有执行 git commit，除非用户另有要求。

## 快捷脚本

若根目录已有 `deploy-run.sh`，可在 Bash 环境下使用，但必须先读取脚本并确认它满足本技能的范围、顺序、版本要求，并且只会跳过明确属于 TypeScript 编译阶段的失败、随后仍发布当前模块，其他构建失败或发布失败时会停止。需要使用时：

1. 只将脚本的 `CURRENT_VERSION` 改为 `TARGET_VERSION`。
2. 按需设置 `START_PACKAGE`。
3. 从项目根目录执行：

```bash
bash deploy-run.sh
```

脚本不满足要求、用户要求单模块发布，或 Windows 环境没有 Bash 时，按上述逐模块流程执行。不要仅因脚本存在就跳过发布前确认和结果汇总。

## 约束

- 所有待发布模块默认使用同一版本；只有用户明确指定例外时才能使用不同版本。
- 只修改 `package.json` 的顶层 `version` 字段，不更新 lockfile，不改依赖版本，不执行自动格式化。
- 不运行 `git commit`、`git tag`、`git push`，除非用户另行明确要求。
- 不使用 `npm publish --force`，不自动更改 registry，不自动登录 npm。
- 不将 token、密码或 `.npmrc` 内容写入日志或汇总。
