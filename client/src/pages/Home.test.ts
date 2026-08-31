import { describe, expect, it } from "vitest";
import { canViewAdminReviews, filterTools, getNavigationAriaCurrent, matchesAdminTool, mergeBatchAssessments, mobileNavItems, parseCsv, reportExportLabel, selectTool, toggleNavigation, toolMenu, toolSearchAriaLabel } from "./Home";

describe("parseCsv", () => {
  it("routes named tools to focused destinations and toggles the mobile drawer", () => {
    expect(selectTool("Predictive Vending")).toBe("Predictive Vending");
    expect(selectTool("Academic Inbound")).toBe("Academic Inbound");
    expect(selectTool("Language Lab")).toBe("Language Lab");
    expect(selectTool("unknown")).toBe("Overview");
    expect(toggleNavigation(false)).toBe(true);
    expect(toggleNavigation(true)).toBe(false);
  });

  it("keeps All tools and every named tool in the navigation registry", () => {
    expect(toolMenu.map(item => item.label)).toEqual(["All tools", "Data analysis", "Chart insights", "Product inspection", "Predictive Vending", "Heritage QC", "Academic Inbound", "Language Lab"]);
  });
  it("keeps mobile navigation compact and keyboard-addressable", () => {
    expect(mobileNavItems.map(item => item.label)).toEqual(["Home", "Data", "Learn", "Ops", "Search"]);
    expect(mobileNavItems.every(item => item.key && item.label)).toBe(true);
    expect(selectTool(mobileNavItems[2].key)).toBe("Language Lab");
    expect(getNavigationAriaCurrent(true)).toBe("page");
    expect(getNavigationAriaCurrent(false)).toBeUndefined();
    expect(toolSearchAriaLabel).toBe("Search tools");
    expect(canViewAdminReviews("admin")).toBe(true);
    expect(canViewAdminReviews("user")).toBe(false);
  });

  it("filters tools by name and exposes a clear no-results contract", () => {
    expect(filterTools("vending").map(item => item.label)).toEqual(["Predictive Vending"]);
    expect(filterTools("language").map(item => item.label)).toEqual(["Language Lab"]);
    expect(filterTools("inventory").map(item => item.label)).toEqual(["Predictive Vending"]);
    expect(selectTool(filterTools("language")[0].key)).toBe("Language Lab");
    expect(filterTools("does-not-exist")).toEqual([]);
    expect(matchesAdminTool("review")).toBe(true);
    expect(matchesAdminTool("vending")).toBe(false);
  });

  it("parses pasted rows with quoted commas and profiles numeric columns", () => {
    const parsed = parseCsv('month,revenue,note\nJan,4200,"Strong, launch"\nFeb,5100,"Growing"');
    expect(parsed.headers).toEqual(["month", "revenue", "note"]);
    expect(parsed.rows[0]).toEqual(["Jan", "4200", "Strong, launch"]);
    expect(parsed.columns.find(column => column.name === "revenue")?.type).toBe("numeric");
  });

  it("returns no data for empty pasted content", () => {
    expect(parseCsv("").rows).toEqual([]);
    expect(parseCsv("").headers).toEqual([]);
  });

  it("keeps the PDF report action available and maps batch results by image order", () => {
    expect(reportExportLabel).toBe("Export PDF");
    const items = [{ name: "one.jpg" }, { name: "two.jpg" }];
    const mapped = mergeBatchAssessments(items, [{ assessment: { condition: "Good" } }, { assessment: { condition: "Fair" } }]);
    expect(mapped.map(item => item.assessment.condition)).toEqual(["Good", "Fair"]);
  });
});
