# dsh-publish-skill

XDSP 前端顺序发版插件，为 DeepSeek Harness 注册仅限用户调用的 `/publish-skill` 技能。

## 功能

- 全量发布 `packages/` 下的模块。
- 使用 `START_PACKAGE` 从失败模块继续发布。
- 使用 `PACKAGE` 只发布一个模块。
- 统一修改目标模块的 `package.json` 顶层 `version`。
- 严格串行执行 `yarn transpile` 和 `npm publish`。
- 首次发布前确认版本与有序模块列表；TypeScript 编译阶段失败时允许当前模块继续发布，其他构建失败或发布失败时立即停止。
- 不自动提交 Git、不修改 lockfile、不自动登录或更改 npm registry。

技能声明了 `disable-model-invocation: true`，模型不会自行选择它。只有用户输入 `/publish-skill` 才会加载发布指令。

## 安装

### 插件商店

仓库被 awesome-dsh-plugin.com 收录后，可在 DeepSeek Harness Web GUI 的 **设置 -> 插件 -> 插件市场** 中搜索 `dsh-publish-skill` 并安装。

包已提供插件商店要求的 `dsh.bundle.patch` manifest 和 Host 插件入口。安装目标是 `web` profile，不包含浏览器 bundle。

### GitHub

```sh
dsh plugin --profile web add github:WonderfulEdge/dsh-publish-skill
```

安装后重启当前 Web Harness 进程使 profile 重新组合。开发环境也可以从本地目录安装：

```sh
dsh plugin --profile web add ./publish-skill
```

### 手动 Skill Bundle

不使用插件管理器时，也可以将 `skills/publish-skill` 复制到：

```text
%DSH_HOME%\skills\publish-skill
```

## 使用

全量发布：

```text
/publish-skill TARGET_VERSION=2.1.4-beta.0
```

从指定模块续发：

```text
/publish-skill TARGET_VERSION=2.1.4-beta.0 START_PACKAGE=xdsp-chatbi
```

只发布一个模块：

```text
/publish-skill TARGET_VERSION=2.1.4-beta.0 PACKAGE=xdsp-bi
```

如果没有提供 `TARGET_VERSION`，技能会先询问版本号，不会自行猜测。

## 商店收录

GitHub 仓库公开后，还需要向 [awesome-dsh-plugin.com](https://awesome-dsh-plugin.com/) 的精选目录提交仓库地址。目录收录与插件包兼容性是两个步骤：本仓库提供可安装 manifest；进入商店搜索结果取决于目录维护者审核。

推荐目录信息：

| 字段 | 值 |
| --- | --- |
| Repository | `WonderfulEdge/dsh-publish-skill` |
| Install source | `github:WonderfulEdge/dsh-publish-skill` |
| Profile | `web` |
| Category | Skills / Developer Tools |
| Package | `dsh-publish-skill` |

## 开发验证

```sh
npm test
npm run pack:check
```

插件入口从包内读取 canonical `SKILL.md`，通过 `ctx.skills.register()` 注册运行时技能，并将注销函数交给 Cordis effect 管理。停用或卸载插件时，技能贡献会同步移除。

## 维护文档

- [架构与信任边界](docs/architecture.md)
- [故障排查](docs/troubleshooting.md)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [变更记录](CHANGELOG.md)

## License

[MIT](LICENSE)
