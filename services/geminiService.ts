
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAdvice = async (query: string, context?: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `背景信息: ${JSON.stringify(context)}\n\n用户问题: ${query}`,
      config: {
        systemInstruction: "你是一位资深的农业科学家和农场管理专家。请针对作物管理、病虫害防治、土壤健康和天气影响提供精准且可操作的建议。请使用专业且通俗易懂的中文回答。",
        temperature: 0.7,
      },
    });
    return response.text || "抱歉，我无法处理该请求。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "连接 AI 顾问出错，请稍后再试。";
  }
};

export const diagnoseCrop = async (imageBase64: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: "请分析这张作物图片。识别潜在的病害、营养缺乏或虫害。提供诊断总结和建议的行动方案。请务必使用中文。" }
        ]
      },
      config: {
        systemInstruction: "你是一位植物病理学专家。请分析提供的图像并给出详细的健康报告（中文）。",
      }
    });
    return response.text || "无法诊断该图像。";
  } catch (error) {
    console.error("Diagnosis Error:", error);
    return "处理诊断图像时出错。";
  }
};
