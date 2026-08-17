# XDSP 子模块参考

来源参考：`config/packages-config.js`。本表仅用于识别常见模块；发布时以目标仓库的实际 `packages/`、`deploy-run.sh` 和配置文件为准。

## HZero 平台模块

| 包名 | 说明 |
| --- | --- |
| `hzero-front-hadm` | 平台管理 |
| `hzero-front-hfile` | 文件服务 |
| `hzero-front-hiam` | 身份权限 |
| `hzero-front-himp` | 导入 |
| `hzero-front-hmnt` | 监控 |
| `hzero-front-hmsg` | 消息 |
| `hzero-front-hpfm` | 平台基础 |
| `hzero-front-hsdr` | 调度 |
| `hzero-front-hitf` | 接口 |
| `hzero-front-halt` | 告警 |
| `hzero-front-hwkf` | 工作流 |
| `hzero-front-hrpt` | 报表 |
| `hzero-front-haip` | AI 平台 |

## XDSP 业务模块

| 包名 | 说明 |
| --- | --- |
| `xdsp-front` | 基座/门户 |
| `xdsp-core2` | 核心模块（新版，`xdsp-core` 已废弃） |
| `xdsp-dispatch2` | 调度 |
| `xdsp-index` | 首页 |
| `xdsp-asset` | 资产 |
| `xdsp-audit` | 审计 |
| `xdsp-dm` | 数据管理 |
| `xdsp-dmp` | 数据平台 |
| `xdsp-factory` | 工厂 |
| `xdsp-mining` | 挖掘 |
| `xdsp-ops` | 运维 |
| `xdsp-quality` | 质量 |
| `xdsp-report-plus` | 报表增强 |
| `xdsp-security` | 安全 |
| `xdsp-service` | 服务 |
| `xdsp-model` | 模型 |
| `xdsp-reporting` | 填报 |
| `xdsp-bi` | BI |
| `xdsp-hmnt` | 监控 |
| `xdsp-product` | 产品 |
| `xdsp-chatbi` | ChatBI |
| `xdsp-data-claw` | 数据采集 |

## 融合及其他模块

| 包名 | 说明 |
| --- | --- |
| `sdps-data-process` | 数据处理 |
| `cqp-front-message` | 消息 |
| `hops-front-opadm` | 运维管理 |
| `hops-front-oplog` | 运维日志 |
| `hops-front-opmon` | 运维监控 |
| `hops-front-opmp` | 运维 MP |
| `hops-front-opapm` | 运维 APM |

## 默认不纳入构建

- `xdsp-core`：老版本，已废弃。
- `hzero-front-hpfm-dpc`：HZero 插件，不需要打包。
