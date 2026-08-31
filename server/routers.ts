import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { saveDataset, saveInspection, saveAnalysis, saveReview, listReviews } from "./db";
import { calculateReviewMetrics } from "./reviewMetrics";

const insightSchema = {
  type: "object",
  properties: {
    narrative: { type: "string" },
    takeaways: { type: "array", items: { type: "string" } },
    tips: { type: "array", items: { type: "string" } },
    confidence: { type: "string" },
  },
  required: ["narrative", "takeaways", "tips", "confidence"],
  additionalProperties: false,
};

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  return next();
});

const inspectionSchema = {
  type: "object",
  properties: {
    condition: { type: "string" },
    summary: { type: "string" },
    observations: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
  },
  required: ["condition", "summary", "observations", "limitations"],
  additionalProperties: false,
};

async function callJson(messages: Parameters<typeof invokeLLM>[0]["messages"], schema: any) {
  const response = await invokeLLM({
    messages,
    maxTokens: 900,
    responseFormat: { type: "json_schema", json_schema: { name: "insightforge_result", strict: true, schema } },
  });
  const content = response.choices[0]?.message.content;
  const text = typeof content === "string" ? content : content?.map(part => part.type === "text" ? part.text : "").join("") ?? "{}";
  return JSON.parse(text);
}

const heritageSchema = { type: "object", properties: { healthLabel: { type: "string" }, gradePercentage: { type: "number" }, summary: { type: "string" }, observations: { type: "array", items: { type: "object", properties: { area: { type: "string" }, severity: { type: "string" }, observation: { type: "string" }, correction: { type: "string" } }, required: ["area", "severity", "observation", "correction"], additionalProperties: false } }, limitations: { type: "array", items: { type: "string" } } }, required: ["healthLabel", "gradePercentage", "summary", "observations", "limitations"], additionalProperties: false };
const academicSchema = { type: "object", properties: { summary: { type: "string" }, projections: { type: "array", items: { type: "string" } }, caveats: { type: "array", items: { type: "string" } } }, required: ["summary", "projections", "caveats"], additionalProperties: false };
const vendingSchema = { type: "object", properties: { narrative: { type: "string" }, tips: { type: "array", items: { type: "string" } }, projections: { type: "array", items: { type: "string" } }, caveats: { type: "array", items: { type: "string" } }, limitations: { type: "array", items: { type: "string" } } }, required: ["narrative", "tips", "projections", "caveats", "limitations"], additionalProperties: false };
const lessonSchema = { type: "object", properties: { title: { type: "string" }, overview: { type: "string" }, items: { type: "array", items: { type: "object", properties: { phrase: { type: "string" }, translation: { type: "string" }, pronunciation: { type: "string" }, example: { type: "string" } }, required: ["phrase", "translation", "pronunciation", "example"], additionalProperties: false } }, culturalNote: { type: "string" } }, required: ["title", "overview", "items", "culturalNote"], additionalProperties: false };
const languageFeedbackSchema = { type: "object", properties: { score: { type: "number" }, corrected: { type: "string" }, explanation: { type: "string" }, encouragement: { type: "string" }, limitations: { type: "array", items: { type: "string" } } }, required: ["score", "corrected", "explanation", "encouragement", "limitations"], additionalProperties: false };
const assessmentSchema = { type: "object", properties: { score: { type: "number" }, level: { type: "string" }, strengths: { type: "array", items: { type: "string" } }, improvements: { type: "array", items: { type: "string" } }, recommendation: { type: "string" } }, required: ["score", "level", "strengths", "improvements", "recommendation"], additionalProperties: false };
const dialogueSchema = { type: "object", properties: { title: { type: "string" }, coach: { type: "string" }, line: { type: "string" }, reply: { type: "string" } }, required: ["title", "coach", "line", "reply"], additionalProperties: false };

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  datasets: router({
    save: protectedProcedure.input(z.object({
      fileName: z.string().max(255),
      contentBase64: z.string(),
      mimeType: z.string().default("text/csv"),
      rowCount: z.number().int().nonnegative(),
      columnCount: z.number().int().nonnegative(),
      profileJson: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const buffer = Buffer.from(input.contentBase64, "base64");
      const stored = await storagePut(`users/${ctx.user.id}/datasets/${input.fileName}`, buffer, input.mimeType);
      await saveDataset({ userId: ctx.user.id, fileName: input.fileName, fileKey: stored.key, rowCount: input.rowCount, columnCount: input.columnCount, profileJson: input.profileJson });
      return { ...stored, rowCount: input.rowCount, columnCount: input.columnCount };
    }),
  }),
  language: router({
    lesson: protectedProcedure.input(z.object({ targetLanguage: z.string().min(1).max(80), nativeLanguage: z.string().min(1).max(80), level: z.string().min(1).max(30), topic: z.string().min(1).max(120) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a patient multilingual language teacher. Create practical lessons for the requested target language and learner level. Include accurate phrase translations, readable pronunciation guidance, examples, and a respectful cultural note. Return only JSON." }, { role: "user", content: `Create a lesson in ${input.targetLanguage} for a ${input.level} learner whose support language is ${input.nativeLanguage}. Topic: ${input.topic}.` }], lessonSchema)),
    writingFeedback: protectedProcedure.input(z.object({ targetLanguage: z.string().min(1), prompt: z.string().min(1).max(1000), response: z.string().min(1).max(4000) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a supportive language writing coach. Correct grammar, spelling, word choice, and register in the target language. Preserve the learner's meaning, explain the most useful corrections plainly, and avoid pretending to assess abilities not shown. Return only JSON." }, { role: "user", content: `Target language: ${input.targetLanguage}. Prompt: ${input.prompt}. Learner response: ${input.response}` }], languageFeedbackSchema)),
    speakingFeedback: protectedProcedure.input(z.object({ targetLanguage: z.string().min(1), expected: z.string().min(1).max(1000), recognized: z.string().min(1).max(2000) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a careful speaking-practice coach. Compare the expected phrase with browser speech-recognition transcription. Give a score as an approximate communication match, identify likely word mismatches, and explicitly state that transcription is not a clinical phonetic pronunciation assessment. Return only JSON." }, { role: "user", content: `Target language: ${input.targetLanguage}. Expected phrase: ${input.expected}. Recognized speech: ${input.recognized}` }], languageFeedbackSchema)),
    scoreAssessment: protectedProcedure.input(z.object({ targetLanguage: z.string().min(1), mode: z.enum(["Test", "Exam"]), answers: z.string().min(1).max(12000) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a fair language assessment grader. Score only the supplied written responses and speech-recognition transcripts. Use a 0-100 score, a CEFR-like descriptive level without claiming official certification, strengths, improvements, and one practical recommendation. Return only JSON." }, { role: "user", content: `Grade this ${input.mode} in ${input.targetLanguage}: ${input.answers}` }], assessmentSchema)),
    dialogue: protectedProcedure.input(z.object({ targetLanguage: z.string().min(1).max(80), nativeLanguage: z.string().min(1).max(80), level: z.string().min(1).max(30), scenario: z.string().min(1).max(120) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a playful but accurate conversation teacher. Create a short, natural role-play scene for the requested target language and learner level. The coach and reply may be in the learner support language, but line must be written in the target language with no untranslated English. Keep it friendly, useful, and culturally respectful. Return only JSON." }, { role: "user", content: `Create a fun speaking dialogue in ${input.targetLanguage} for a ${input.level} learner supported in ${input.nativeLanguage}. Scenario: ${input.scenario}.` }], dialogueSchema)),
  }),
  operations: router({
    vendingNarrative: protectedProcedure.input(z.object({ summary: z.string().min(1), weatherScenario: z.string().min(1) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a cautious micro-retail operations analyst. Use only the supplied observed sales metrics. Treat weather as a simulated scenario variable, never as verified fact. Return explicit seven-day scenario projections, caveats, and limitations. Explain stockout risk as an estimate, not a guarantee, and avoid fabricated inventory." }, { role: "user", content: `Review this vending forecast with ${input.weatherScenario} scenario: ${input.summary}` }], vendingSchema)),
    academicNarrative: protectedProcedure.input(z.object({ summary: z.string().min(1), language: z.string().min(1) })).mutation(async ({ input }) => callJson([{ role: "system", content: "You are a careful academic recruitment analyst. Summarize observed applicant regions and subject scores, then give explicitly labeled scenario projections. Do not infer protected traits or guarantee enrollment outcomes. Return only JSON." }, { role: "user", content: `Create an executive summary in ${input.language} from this uploaded academic profile: ${input.summary}` }], academicSchema)),
    heritageAssess: protectedProcedure.input(z.object({ fileName: z.string().max(255), imageBase64: z.string().min(1), mimeType: z.string().startsWith("image/"), language: z.string().min(1) })).mutation(async ({ ctx, input }) => {
      const buffer = Buffer.from(input.imageBase64, "base64"); const stored = await storagePut(`users/${ctx.user.id}/heritage/${input.fileName}`, buffer, input.mimeType);
      const assessment = await callJson([{ role: "system", content: "You are a respectful heritage craft quality-control assistant. Assess only visible surface evidence in the macro photograph. Look for apparent symmetry errors, micro-crack-like marks, alignment flaws, or color discolored patches, but label uncertainty. Never claim hidden damage, authenticity, safety, value, or artisan intent. Use a 0-100 visible structural grade and color-coded severity terms low, medium, high. Return explicit limitations." }, { role: "user", content: [{ type: "text", text: `Assess this traditional craft macro photo in ${input.language}. Provide a professional diagnostic log and respectful artisanal correction notes.` }, { type: "image_url", image_url: { url: `data:${input.mimeType};base64,${input.imageBase64}`, detail: "high" } }] }], heritageSchema);
      return { ...stored, assessment };
    }),
  }),
  reviews: router({
    list: publicProcedure.query(async () => {
      const rows = await listReviews(20);
      return rows.map(row => ({ id: row.id, rating: row.rating, reviewText: row.reviewText, createdAt: row.createdAt }));
    }),
    create: protectedProcedure.input(z.object({ rating: z.number().int().min(1).max(5), reviewText: z.string().trim().min(3).max(2000) })).mutation(async ({ ctx, input }) => {
      await saveReview({ userId: ctx.user.id, rating: input.rating, reviewText: input.reviewText });
      return { saved: true } as const;
    }),
    adminMetrics: adminProcedure.query(async () => {
      const rows = await listReviews(10000);
      return { ...calculateReviewMetrics(rows), recent: rows.slice(-10).reverse() };
    }),
  }),
  analyses: router({
    save: protectedProcedure.input(z.object({ chartTitle: z.string().min(1), language: z.string().min(1), resultJson: z.string().min(2), datasetId: z.number().int().optional() })).mutation(async ({ ctx, input }) => {
      await saveAnalysis({ userId: ctx.user.id, chartTitle: input.chartTitle, language: input.language, resultJson: input.resultJson, datasetId: input.datasetId });
      return { saved: true } as const;
    }),
  }),
  insights: router({
    explain: protectedProcedure.input(z.object({ chartTitle: z.string().min(1), dataSummary: z.string().min(1), language: z.string().min(1) })).mutation(async ({ input }) => {
      return callJson([
        { role: "system", content: "You are InsightForge, a careful business data analyst. Explain charts plainly, distinguish observations from hypotheses, avoid guaranteed outcomes, and give practical non-financial-advice business improvements. Return only the requested JSON." },
        { role: "user", content: `Analyze this chart in ${input.language}. Chart: ${input.chartTitle}. Data summary: ${input.dataSummary}. Write a concise narrative, 3 takeaways, and 3 carefully framed improvement tips. Mention uncertainty when relevant.` },
      ], insightSchema);
    }),
    inspect: protectedProcedure.input(z.object({ fileName: z.string().max(255), imageBase64: z.string(), mimeType: z.string(), language: z.string() })).mutation(async ({ ctx, input }) => {
      const buffer = Buffer.from(input.imageBase64, "base64");
      const stored = await storagePut(`users/${ctx.user.id}/inspections/${input.fileName}`, buffer, input.mimeType);
      const assessment = await callJson([
        { role: "system", content: "You are a cautious visual product-condition assistant. Assess only visible condition in the image. Never claim hidden defects, authenticity, safety, or value. Return observations and explicit limitations. Use the requested language." },
        { role: "user", content: [
          { type: "text", text: `Assess the visible condition of this product photo in ${input.language}. Use condition labels such as Excellent, Good, Fair, or Needs review. Include a plain-language summary, observable details, and limitations.` },
          { type: "image_url", image_url: { url: `data:${input.mimeType};base64,${input.imageBase64}`, detail: "high" } },
        ] },
      ], inspectionSchema);
      await saveInspection({ userId: ctx.user.id, fileName: input.fileName, fileKey: stored.key, assessmentJson: JSON.stringify(assessment) });
      return { ...stored, assessment };
    }),
  }),
});

export type AppRouter = typeof appRouter;
