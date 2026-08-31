import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { calculateReviewMetrics } from "./reviewMetrics";

const ctx = {
  user: { id: 1, openId: "test", role: "user", name: "Test", email: "test@example.com", loginMethod: "test", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} },
  res: {},
} as TrpcContext;

describe("insights.explain", () => {
  it("rejects incomplete chart context before invoking the model", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.insights.explain({ chartTitle: "", dataSummary: "", language: "English" })).rejects.toThrow();
  });

  it("rejects invalid dataset and inspection inputs before storage work", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.datasets.save({ fileName: "", contentBase64: "", mimeType: "text/csv", rowCount: -1, columnCount: 1, profileJson: "{}" })).rejects.toThrow();
    await expect(caller.insights.inspect({ fileName: "", imageBase64: "", mimeType: "image/jpeg", language: "English" })).rejects.toThrow();
  });

  it("rejects ratings outside 1 to 5 and reviews shorter than three characters", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.reviews.create({ rating: 0, reviewText: "Too short" })).rejects.toThrow();
    await expect(caller.reviews.create({ rating: 5, reviewText: "  " })).rejects.toThrow();
  });

  it("calculates average and stable five-star distribution", () => {
    expect(calculateReviewMetrics([{ rating: 5 }, { rating: 4 }, { rating: 4 }])).toEqual({ total: 3, average: 4.33, distribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 1 } });
  });

  it("blocks regular users from admin review metrics", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.reviews.adminMetrics()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
