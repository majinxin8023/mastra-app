// 引入 Mastra 核心框架
import { Mastra } from "@mastra/core/mastra";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
// 引入日志记录器
import { PinoLogger } from "@mastra/loggers";
// 引入 LibSQL 存储实现
import { LibSQLStore } from "@mastra/libsql";
// 引入天气工作流
import { weatherWorkflow } from "./workflows/weather-workflow";
// 引入天气智能体
import { weatherAgent } from "./agents/weather-agent";
import { crAgent } from "./agents/cr-agent";
import { ragAgent } from "./agents/rag-agent";

// 创建并导出 Mastra 实例，注册所有工作流和智能体
export const mastra = new Mastra({
  workflows: { weatherWorkflow }, // 注册天气工作流
  agents: { weatherAgent, crAgent, ragAgent }, // 注册天气、Code Review和RAG智能体
  storage: new LibSQLStore({
    // 存储 Mastra 的遥测、评测等数据。当前为内存存储，如需持久化可改为 file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  deployer: new CloudflareDeployer({
    projectName: "hello-mastra",
  }),
});
