import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// 假设你的文档数据如下
const docs: string[] = [
  "来访者：心理咨询师，您好，我是曾珊，最近我因为一些事情感到很困扰，想请教您。",

  "心理咨询师：你好，曾珊。很高兴你能来咨询。请问你遇到了什么困扰，想要解决的问题是什么呢？",

  "来访者：最近我和班上的同学发生了冲突，我觉得我很努力地去融入他们，但总是被排斥。我很难过，甚至有时候想放弃。",

  "心理咨询师：我能理解你的感受。面对人际关系的问题，确实会让人感到痛苦。首先，我们要明确的是，每个人都有自己的特点和优点，也许他们并不了解你。你想跟我分享一下这次冲突的具体情况吗？",

  "来访者：是这样的，那天我在课间休息时，跟他们说了我最近的一些困扰。我觉得我说得挺真诚的，但没想到他们却嘲笑我，说我太敏感。这让我感到很受伤。",

  "心理咨询师：明白了。这种情况下，你的感受是很正常的。当我们遇到不理解和支持的人时，会感到难过和无助。你觉得在这个问题上，你有什么可以改进的地方吗？",

  "来访者：我想了一下，也许我应该学会更好地表达自己，让他们了解我的感受。但我不知道该怎么去做。",

  "心理咨询师：这很好。接下来，我们可以学习一些有效的沟通技巧。首先，要学会倾听，给别人一个表达自己观点的机会。其次，表达自己的感受时，要用'I'开头的句子，比如'我觉得……'，这样可以避免对方产生防御心理。你愿意试试吗？",

  "来访者：好的，我会试试的。但我还是担心，如果他们不理解我，我该怎么办？",

  "心理咨询师：曾珊，我们要认识到，我们不能控制别人的想法和行为，但我们可以控制自己的反应。当遇到不理解的人时，试着保持冷静，告诉自己这是他们的问题，而不是你的。同时，你可以寻找一些支持你的朋友和家人，让他们知道你的困扰，他们会给你提供帮助和支持。",
  "来访者：谢谢你的建议。我会试试的。但我还是有点担心，怕自己处理不好这些事情。",

  "心理咨询师：不用害怕。在这个过程中，我会一直陪伴着你。如果你遇到任何问题，都可以随时来找我。我们要相信，只要你付出努力，一定能够克服这些困难。",

  "来访者：好的，心理咨询师，我会努力的。谢谢你给了我这么多建议。",

  "心理咨询师：不客气，曾珊。我相信你具备克服困难的能力。只要我们共同努力，你一定能够度过这段难关。如果你有任何疑问或需要帮助，随时都可以来找我。祝你好运！",
];

// 定义关键词映射，用于语义搜索
const keywordMap: Record<string, string[]> = {
  // 人际关系相关
  冲突: ["冲突", "矛盾", "争执", "吵架", "不和", "排斥", "孤立"],
  同学: ["同学", "朋友", "伙伴", "集体", "班级", "团队"],
  融入: ["融入", "加入", "参与", "适应", "接纳", "归属"],
  排斥: ["排斥", "孤立", "排挤", "疏远", "冷落", "拒绝"],

  // 情绪相关
  难过: ["难过", "伤心", "痛苦", "悲伤", "沮丧", "失落", "受伤"],
  困扰: ["困扰", "烦恼", "焦虑", "担心", "害怕", "恐惧"],
  敏感: ["敏感", "脆弱", "易受伤", "情绪化", "多愁善感"],

  // 沟通相关
  表达: ["表达", "沟通", "交流", "说话", "倾诉", "分享"],
  倾听: ["倾听", "理解", "支持", "关心", "帮助"],
  技巧: ["技巧", "方法", "策略", "建议", "指导"],

  // 心理咨询相关
  咨询: ["咨询", "心理", "辅导", "帮助", "建议", "指导"],
  问题: ["问题", "困难", "挑战", "困境", "麻烦"],
  解决: ["解决", "处理", "应对", "克服", "面对"],

  // 具体场景
  课间: ["课间", "休息", "课余", "放学后", "课后"],
  嘲笑: ["嘲笑", "讽刺", "挖苦", "取笑", "奚落"],
  真诚: ["真诚", "诚实", "坦率", "直接", "真实"],
};

// 计算文本相似度（简单的关键词匹配评分）
function calculateRelevance(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  let score = 0;

  // 1. 直接包含匹配（权重最高）
  if (lowerText.includes(lowerQuery)) {
    score += 100;
  }

  // 2. 关键词匹配（权重中等）
  for (const [category, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword) && lowerText.includes(keyword)) {
        score += 50;
      }
      if (lowerText.includes(keyword)) {
        score += 10; // 文档包含相关关键词
      }
    }
  }

  // 3. 部分词匹配（权重较低）
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length > 2);
  const textWords = lowerText.split(/\s+/).filter((word) => word.length > 2);

  for (const queryWord of queryWords) {
    for (const textWord of textWords) {
      if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
        score += 5;
      }
    }
  }

  // 4. 长度惩罚（避免过长的文档得分过高）
  const lengthPenalty = Math.min(text.length / 100, 1);
  score = score * (1 - lengthPenalty * 0.1);

  return score;
}

function searchDocs(query: string): string | null {
  if (!query.trim()) return null;

  const results: Array<{ text: string; score: number }> = [];

  // 计算每个文档的相关性得分
  for (const doc of docs) {
    const score = calculateRelevance(query, doc);
    if (score > 0) {
      results.push({ text: doc, score });
    }
  }

  // 按得分排序，选择最相关的文档
  results.sort((a, b) => b.score - a.score);

  // 设置阈值，只返回相关性较高的文档
  const threshold = 20; // 可以调整这个阈值
  const relevantDocs = results.filter((result) => result.score >= threshold);

  if (relevantDocs.length === 0) {
    return null;
  }

  // 如果找到多个相关文档，可以选择合并或选择最相关的
  if (relevantDocs.length === 1) {
    return relevantDocs[0].text;
  } else {
    // 返回最相关的文档，或者合并前几个
    const topDocs = relevantDocs.slice(0, 2); // 最多返回2个文档
    return topDocs.map((doc) => doc.text).join("\n\n");
  }
}

export const ragTool = createTool({
  id: "rag-tool",
  description: "优先在本地文档中查找答案，找不到再用大模型回答",
  inputSchema: z.object({
    question: z.string().describe("用户问题"),
  }),
  outputSchema: z.object({
    answer: z.string(),
  }),
  async execute({ context }) {
    console.log("rag-tool---------", context);
    const userQuestion = context.question;
    const docResult = searchDocs(userQuestion);
    console.log("docResult---------", docResult);

    let answer: string;
    if (docResult) {
      // 如果找到相关文档，基于文档内容生成回复
      answer = `基于我找到的相关信息，我建议你：\n\n${docResult}\n\n针对你的问题"${userQuestion}"，我希望能给你一些帮助。如果你需要更详细的建议，请告诉我更多具体情况。`;
    } else {
      // 如果没有找到相关文档，给出通用回复
      answer = `我理解你的困扰。虽然我没有找到完全匹配的信息，但作为心理咨询师，我建议你：\n\n1. 先冷静下来，深呼吸几次\n2. 尝试客观地分析问题的根源\n3. 寻求身边朋友或家人的支持\n4. 如果问题持续存在，考虑寻求专业帮助\n\n关于你的问题"${userQuestion}"，你能告诉我更多细节吗？这样我就能给你更准确的建议。`;
    }

    console.log(answer, "answer-p---");
    return {
      answer,
    };
  },
});
