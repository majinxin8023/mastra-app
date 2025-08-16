import { Mastra } from "@mastra/core/mastra";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { crAgent } from "./agents/cr-agent";
import { ragAgent } from "./agents/rag-agent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, crAgent, ragAgent }, // 注册天气、Code Review和RAG智能体111
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  deployer: new CloudflareDeployer({
    projectName: "mastra-agents",
  }),
});
