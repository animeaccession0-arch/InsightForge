import { describe, expect, it } from "vitest";
import { calculateAcademicProfile, calculateVendingForecast, estimateLuxTransmission, generateSampleSalesCsv, parseOperationalCsv, validateOperationalCsvFile, simulateSwarmRouting, simulateVeloRouteShock, isShockActive, isShockReportReady, getShockReportSummary, compareTrafficRoutes, buildDepartureTimeline, getRouteDistanceDisplay } from "./operations";

describe("operational analytics helpers", () => {
  it("accepts CSV file inputs for both operational modes and rejects non-CSV files", () => {
    expect(validateOperationalCsvFile("vending-log.csv", "text/csv")).toBeNull();
    expect(validateOperationalCsvFile("academic-cycle.csv", "application/octet-stream")).toBeNull();
    expect(validateOperationalCsvFile("notes.txt", "text/plain")).toBe("Please choose a CSV file.");
  });

  it("parses quoted CSV values without losing commas", () => {
    const parsed = parseOperationalCsv('timestamp,product,units\n2026-08-20T09:00:00Z,"Tea, jasmine",4');
    expect(parsed.rows[0]?.product).toBe("Tea, jasmine");
    expect(parsed.rows[0]?.units).toBe("4");
  });

  it("calculates an exact depletion date when inventory_on_hand is present", () => {
    const parsed = parseOperationalCsv("timestamp,product,units,inventory_on_hand\n2026-08-20T09:00:00Z,Water,4,20\n2026-08-21T09:00:00Z,Water,6,10");
    const result = calculateVendingForecast(parsed.rows);
    expect(result.inventoryKey).toBe("inventory_on_hand");
    expect(result.products[0]?.onHand).toBe(10);
    expect(result.products[0]?.depletionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("applies the hotter scenario multiplier to the vending rate", () => {
    const parsed = parseOperationalCsv("timestamp,product,units,inventory_on_hand\n2026-08-20T09:00:00Z,Water,4,20\n2026-08-21T09:00:00Z,Water,6,10");
    const baseline = calculateVendingForecast(parsed.rows, "baseline");
    const hotter = calculateVendingForecast(parsed.rows, "hotter");
    expect(hotter.scenarioFactor).toBe(1.15);
    expect(hotter.products[0]?.dailyRate).toBeGreaterThan(baseline.products[0]?.dailyRate ?? 0);
  });

  it("finds vending peak hours and product velocity", () => {
    const parsed = parseOperationalCsv("timestamp,product,units\n2026-08-20T09:00:00Z,Water,4\n2026-08-20T09:30:00Z,Water,6\n2026-08-20T14:00:00Z,Snack,2");
    const result = calculateVendingForecast(parsed.rows);
    expect(result.peakHour).toBe("09:00");
    expect(result.products[0]?.product).toBe("Water");
  });

  it("accepts academic mode schemas with year, country, subject, and score fields", () => {
    const parsed = parseOperationalCsv("year,country,subject,score\n2025,Japan,Math,72\n2026,Japan,Math,74");
    const result = calculateAcademicProfile(parsed.rows);
    expect(result.periodKey).toBe("year");
    expect(result.regions[0]?.region).toBe("Japan");
  });

  it("calculates region applicant change when periods exist", () => {
    const parsed = parseOperationalCsv("year,country,subject,score\n2025,Japan,Math,72\n2025,India,Math,68\n2026,Japan,Math,74\n2026,India,Math,71");
    const result = calculateAcademicProfile(parsed.rows);
    expect(result.regionChanges.find(item => item.region === "Japan")?.changePct).toBe(0);
    expect(result.regionChanges.find(item => item.region === "India")?.changePct).toBe(0);
  });

  it("generates fresh varied sales CSVs with the vending schema", () => {
    const now = new Date("2026-08-28T12:00:00Z");
    const first = generateSampleSalesCsv(() => 0.1, now);
    const second = generateSampleSalesCsv(() => 0.9, now);
    expect(parseOperationalCsv(first).headers).toEqual(["timestamp", "product", "units", "inventory_on_hand"]);
    expect(parseOperationalCsv(first).rows.length).toBe(112);
    expect(first).not.toBe(second);
    expect(Number(parseOperationalCsv(first).rows[0]?.units)).toBeGreaterThan(0);
  });

  it("only enables shock report export when analyzed data and a result are available", () => {
    expect(isShockReportReady(false, false)).toBe(false);
    expect(isShockReportReady(true, false)).toBe(false);
    expect(isShockReportReady(true, true)).toBe(true);
  });

  it("builds a labeled shock summary for the downloadable report", () => {
    expect(getShockReportSummary({ typhoon: 75, transitBlockage: 40, demandSpike: 90 })).toEqual(["Sudden typhoon intensity: 75%", "Localized transit blockage: 40%", "Micro-retail demand spike: 90%"]);
  });

  it("calculates SKU inventory adaptation thresholds from shock-adjusted demand", () => {
    const result = simulateVeloRouteShock([{ hour: "09:00", units: 10 }], { typhoon: 20, transitBlockage: 10, demandSpike: 80 }, [{ product: "Water", onHand: 6, dailyRate: 4, sellOutInDays: 1.5 }]);
    expect(result.inventoryThresholds[0]?.product).toBe("Water");
    expect(result.inventoryThresholds[0]?.projectedDailyDemand).toBeGreaterThan(4);
    expect(result.inventoryThresholds[0]?.status).toBe("critical");
    expect(result.inventoryThresholds[0]?.trigger).toContain("replenish");
  });

  it("warps hourly velocity locally and activates critical mitigation thresholds", () => {
    const result = simulateVeloRouteShock([{ hour: "09:00", units: 10 }, { hour: "18:00", units: 20 }], { typhoon: 90, transitBlockage: 80, demandSpike: 85 });
    expect(isShockActive({ typhoon: 90, transitBlockage: 80, demandSpike: 85 })).toBe(true);
    expect(result.warpedHours[0]?.baselineUnits).toBe(10);
    expect(result.warpedHours[0]?.units).not.toBe(10);
    expect(result.constraints.some(item => item.status === "critical")).toBe(true);
    expect(result.roadmap.some(item => item.threshold === "Protect" && item.active)).toBe(true);
  });

  it("estimates directional-light transmission and flags non-uniform material signals", () => {
    const result = estimateLuxTransmission([
      { frame: 1, angle: 0, transmittedLight: 75, scattering: 10, diffraction: 12 },
      { frame: 2, angle: 90, transmittedLight: 72, scattering: 44, diffraction: 38 },
      { frame: 3, angle: 180, transmittedLight: 70, scattering: 12, diffraction: 14 },
    ]);
    expect(result.frameCount).toBe(3);
    expect(result.densityMap).toHaveLength(9);
    expect(result.flags.some(item => item.label === "High transmission pocket")).toBe(true);
    expect(result.flags.some(item => item.label === "Scattering discontinuity")).toBe(true);
  });

  it("caps swarm routing at 50 endpoints and recommends transfer handoffs when pressure is uneven", () => {
    const endpoints = Array.from({ length: 52 }, (_, index) => ({ id: `S-${index + 1}`, latitude: 35 + index * 0.001, longitude: 139 + index * 0.001, inventory: index === 0 ? 1 : 100, demandRate: index === 0 ? 50 : 1 }));
    const result = simulateSwarmRouting(endpoints, 3);
    expect(result.endpointCount).toBe(50);
    expect(result.capped).toBe(true);
    expect(result.vehicles).toHaveLength(3);
    const transferScenario = simulateSwarmRouting([
      { id: "Low-stock", latitude: 35, longitude: 139, inventory: 1, demandRate: 50 },
      { id: "Resupply", latitude: 35.1, longitude: 139.1, inventory: 100, demandRate: 1 },
      { id: "Reserve", latitude: 35.2, longitude: 139.2, inventory: 100, demandRate: 1 },
    ], 3);
    expect(transferScenario.transfers[0]?.fromVehicle).toBe("V-2");
    expect(transferScenario.transfers[0]?.toVehicle).toBe("V-1");
    expect(result.routeSegments.length).toBeGreaterThan(0);
    expect(result.roadDistanceKm).toBeGreaterThan(0);
    const capacityPressure = simulateSwarmRouting([{ id: "Capacity", latitude: 35, longitude: 139, inventory: 250, demandRate: 1 }], 1, 200);
    expect(capacityPressure.vehicles[0]?.capacityPressure).toBe("over");
  });

  it("triggers an alternate path sweep below the severe traffic threshold", () => {
    const analysis = compareTrafficRoutes([
      { id: "original", distanceKm: 10, durationMinutes: 30, trafficDurationMinutes: 90, minimumSpeedKmh: 4 },
      { id: "alternate-1", distanceKm: 13, durationMinutes: 36, trafficDurationMinutes: 42, minimumSpeedKmh: 18 },
    ]);
    expect(analysis.rerouteTriggered).toBe(true);
    expect(analysis.selected?.id).toBe("alternate-1");
    expect(analysis.selected?.fuelLiters).toBeGreaterThan(analysis.original?.fuelLiters ?? 0);
    expect(buildDepartureTimeline(42, true, "06:15")).toEqual({ departure: "06:15", arrival: "06:57", status: "Alternate clear path selected" });
  });

  it("retains a clear route and labels fallback distance when traffic is unavailable", () => {
    const analysis = compareTrafficRoutes([{ id: "original", distanceKm: 8, durationMinutes: 12, trafficDurationMinutes: 14, minimumSpeedKmh: 34 }]);
    expect(analysis.rerouteTriggered).toBe(false);
    expect(analysis.selected?.id).toBe("original");
    expect(getRouteDistanceDisplay(null, 9.44)).toEqual({ distanceKm: 9.44, source: "coordinate estimate" });
    expect(getRouteDistanceDisplay(8.2, 9.44)).toEqual({ distanceKm: 8.2, source: "road network" });
  });

  it("isolates the lowest-average academic subject as a bottleneck", () => {
    const parsed = parseOperationalCsv("country,subject,score\nJapan,Math,72\nIndia,Math,68\nBrazil,Science,90");
    const result = calculateAcademicProfile(parsed.rows);
    expect(result.totalApplicants).toBe(3);
    expect(result.bottleneck).toBe("Math");
    expect(result.regions[0]?.region).toBe("Japan");
  });
});
