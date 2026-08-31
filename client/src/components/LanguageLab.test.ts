import { describe, expect, it } from "vitest";
import { HEART_MAX, HEART_REFILL_MS, assessmentDurations, chooseDialogue, dialogueFromAi, dialogueFromFallback, findSpeechVoice, getAccentOptions, getAssessmentDuration, getDialogueLine, getFallbackDialogue, getHeartRefillLabel, languageOptions, normalizePracticeAnswer } from "./LanguageLab";

describe("Language Lab assessment contract", () => {
  it("keeps the learner Test at five minutes and Exam at twenty minutes", () => {
    expect(assessmentDurations.Test).toBe(300);
    expect(assessmentDurations.Exam).toBe(1200);
    expect(getAssessmentDuration("Test")).toBe(300);
    expect(getAssessmentDuration("Exam")).toBe(1200);
  });

  it("offers at least 50 quick-pick languages and keeps core choices available", () => {
    expect(languageOptions.length).toBeGreaterThanOrEqual(50);
    expect(languageOptions).toEqual(expect.arrayContaining(["English", "Spanish", "Arabic", "Japanese", "Swahili", "Welsh"]));
  });

  it("keeps five hearts and explains the five-hour refill window", () => {
    expect(HEART_MAX).toBe(5);
    expect(HEART_REFILL_MS).toBe(5 * 60 * 60 * 1000);
    expect(getHeartRefillLabel(null)).toBe("Hearts full");
    expect(getHeartRefillLabel(0, 0)).toContain("5h");
    expect(getHeartRefillLabel(0, HEART_REFILL_MS)).toBe("A full refill is ready");
    expect(normalizePracticeAnswer(" ¡Hola, Ana! ")).toBe("¡hola ana");
  });

  it("keeps fallback dialogue scenes target-language aware and consistently selectable", () => {
    const scene = getFallbackDialogue(0, "Spanish");
    const nextScene = getFallbackDialogue(2, "Japanese");
    expect(scene.title).toContain("café");
    expect(scene.line.startsWith("Spanish:")).toBe(true);
    expect(nextScene.line.startsWith("Japanese:")).toBe(true);
    expect(nextScene.reply).toContain("robot");
    const aiScene = { title: "AI café", coach: "Support", line: "Hola, ¿qué tal?", reply: "Great work." };
    expect(getDialogueLine(aiScene)).toBe("Hola, ¿qué tal?");
    const fallback = getFallbackDialogue(0, "Spanish");
    expect(chooseDialogue(aiScene, fallback)).toEqual(aiScene);
    expect(chooseDialogue(null, fallback)).toEqual(fallback);
    const aiState = dialogueFromAi(0, aiScene);
    expect(aiState.source).toBe("ai");
    expect(aiState.dialogue).toEqual(aiScene);
    const fallbackState = dialogueFromFallback(1, "Spanish");
    expect(fallbackState.source).toBe("fallback");
    expect(fallbackState.dialogue.line.startsWith("Spanish:")).toBe(true);
  });

  it("maps regional accents to locale-aware browser voices with a closest-match fallback", () => {
    const mexicanSpanish = getAccentOptions("Spanish").find(option => option.id === "mx");
    expect(mexicanSpanish?.locale).toBe("es-MX");
    expect(findSpeechVoice([{ name: "Google español de Estados Unidos", lang: "es-US" }], mexicanSpanish!)).not.toBeNull();
    expect(findSpeechVoice([{ name: "English voice", lang: "en-US" }], mexicanSpanish!)).toBeNull();
  });
});
