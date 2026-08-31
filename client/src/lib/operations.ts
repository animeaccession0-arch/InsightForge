export type CsvRow = Record<string, string>;

export function validateOperationalCsvFile(name: string, type: string) {
  return name.toLowerCase().endsWith(".csv") || type === "text/csv" ? null : "Please choose a CSV file.";
}

export function parseOperationalCsv(input: string): { headers: string[]; rows: CsvRow[] } {
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("Add a header row and at least one data row.");
  const split = (line: string) => {
    const cells: string[] = []; let cell = ""; let quoted = false;
    for (let i = 0; i < line.length; i += 1) { const char = line[i]; if (char === '"' && line[i + 1] === '"') { cell += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { cells.push(cell.trim()); cell = ""; } else cell += char; }
    cells.push(cell.trim()); return cells;
  };
  const headers = split(lines[0]).map((value, index) => value || `Column ${index + 1}`);
  const rows = lines.slice(1).map(line => { const values = split(line); return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])); });
  return { headers, rows };
}

export function calculateVendingForecast(rows: CsvRow[], scenario: "baseline" | "hotter" | "rainier" = "baseline") {
  const keys = Object.keys(rows[0] ?? {});
  const find = (terms: string[]) => keys.find(key => terms.some(term => key.toLowerCase().includes(term)));
  const productKey = find(["product", "sku", "item"]) ?? keys[1] ?? keys[0];
  const dateKey = find(["timestamp", "date", "time", "sold_at"]) ?? keys[0];
  const unitsKey = find(["units", "quantity", "qty", "sales", "sold"]) ?? keys[2] ?? keys[1];
  const weatherKey = find(["weather", "temp", "rain", "temperature"]); const inventoryKey = find(["inventory", "stock", "on_hand", "on hand"]);
  const byHour: Record<string, number> = {}; const byProduct: Record<string, { units: number; lastDate: string }> = {};
  for (const row of rows) { const date = new Date(row[dateKey]); const hour = Number.isNaN(date.getTime()) ? "Unparsed" : `${String(date.getHours()).padStart(2, "0")}:00`; const units = Number(row[unitsKey]) || 0; byHour[hour] = (byHour[hour] ?? 0) + units; const product = row[productKey] || "Unnamed product"; const current = byProduct[product] ?? { units: 0, lastDate: row[dateKey] }; byProduct[product] = { units: current.units + units, lastDate: row[dateKey] }; }
  const hours = Object.entries(byHour).sort((a, b) => b[1] - a[1]); const averageDailyRate = rows.length ? Object.values(byProduct).reduce((sum, item) => sum + item.units, 0) / Math.max(1, new Set(rows.map(row => row[dateKey].slice(0, 10))).size) : 0;
  const scenarioFactor = scenario === "hotter" ? 1.15 : scenario === "rainier" ? 0.9 : 1; const products = Object.entries(byProduct).map(([product, item]) => { const inventoryValues = inventoryKey ? rows.filter(row => (row[productKey] || "Unnamed product") === product).map(row => Number(row[inventoryKey])).filter(Number.isFinite) : []; const onHand = inventoryValues.length ? inventoryValues[inventoryValues.length - 1] : null; const observedDailyRate = item.units / Math.max(1, new Set(rows.map(row => row[dateKey].slice(0, 10))).size); const dailyRate = observedDailyRate * scenarioFactor; const sellOutInDays = onHand !== null && dailyRate > 0 ? Number(Math.min(7, onHand / dailyRate).toFixed(1)) : null; return { product, units: item.units, dailyRate: Number(dailyRate.toFixed(2)), onHand, sellOutInDays, depletionDate: sellOutInDays !== null && onHand !== null && onHand / dailyRate <= 7 ? new Date(Date.now() + sellOutInDays * 86400000).toISOString().slice(0, 10) : null }; }).sort((a, b) => b.units - a.units).slice(0, 8);
  return { dateKey, productKey, unitsKey, weatherKey, inventoryKey, scenario, scenarioFactor, peakHour: hours[0]?.[0] ?? "Not enough timestamps", peakUnits: hours[0]?.[1] ?? 0, averageDailyRate: Number(averageDailyRate.toFixed(2)), products, hours: hours.slice(0, 8).map(([hour, units]) => ({ hour, units })) };
}

export function calculateAcademicProfile(rows: CsvRow[]) {
  const keys = Object.keys(rows[0] ?? {}); const find = (terms: string[]) => keys.find(key => terms.some(term => key.toLowerCase().includes(term)));
  const regionKey = find(["country", "region", "nationality", "origin"]) ?? keys[0]; const subjectKey = find(["subject", "exam", "discipline", "category"]) ?? keys[1]; const scoreKey = find(["score", "points", "mark"]) ?? keys[2]; const periodKey = find(["year", "cycle", "date", "timestamp"]);
  const byRegion: Record<string, number> = {}; const bySubject: Record<string, { total: number; count: number }> = {}; const byPeriodRegion: Record<string, Record<string, number>> = {};
  for (const row of rows) { const region = row[regionKey] || "Unknown"; const subject = row[subjectKey] || "Unspecified"; const score = Number(row[scoreKey]) || 0; byRegion[region] = (byRegion[region] ?? 0) + 1; bySubject[subject] = bySubject[subject] ?? { total: 0, count: 0 }; bySubject[subject].total += score; bySubject[subject].count += 1; if (periodKey) { const period = row[periodKey].slice(0, 4); byPeriodRegion[period] = byPeriodRegion[period] ?? {}; byPeriodRegion[period][region] = (byPeriodRegion[period][region] ?? 0) + 1; } }
  const subjects = Object.entries(bySubject).map(([subject, value]) => ({ subject, average: Number((value.total / value.count).toFixed(1)), count: value.count })).sort((a, b) => a.average - b.average);
  const periods = Object.keys(byPeriodRegion).sort(); const previous = periods.at(-2); const latest = periods.at(-1); const regionChanges = latest ? Object.keys(byRegion).map(region => { const prior = previous ? byPeriodRegion[previous]?.[region] ?? 0 : 0; const current = byPeriodRegion[latest]?.[region] ?? 0; return { region, period: latest, current, previous: prior, changePct: prior ? Number((((current - prior) / prior) * 100).toFixed(1)) : null }; }).sort((a, b) => (b.changePct ?? -Infinity) - (a.changePct ?? -Infinity)).slice(0, 10) : []; return { regionKey, subjectKey, scoreKey, periodKey, totalApplicants: rows.length, regions: Object.entries(byRegion).map(([region, applicants]) => ({ region, applicants })).sort((a, b) => b.applicants - a.applicants).slice(0, 10), regionChanges, subjects, bottleneck: subjects[0]?.subject ?? "Not enough subject data" };
}

export type ShockInputs = { typhoon: number; transitBlockage: number; demandSpike: number };
export type ShockConstraint = { label: string; status: "stable" | "watch" | "critical"; detail: string };

export function simulateVeloRouteShock(hours: { hour: string; units: number }[], shocks: ShockInputs, products: { product: string; onHand: number | null; dailyRate: number; sellOutInDays: number | null }[] = []) {
  const weatherFactor = 1 - shocks.typhoon * 0.006;
  const transitFactor = 1 - shocks.transitBlockage * 0.0075;
  const demandFactor = 1 + shocks.demandSpike * 0.012;
  const netFactor = Number((weatherFactor * transitFactor * demandFactor).toFixed(3));
  const warpedHours = hours.map((item, index) => {
    const commuteExposure = /^(07|08|09|17|18|19)/.test(item.hour) ? 1.12 : 1;
    const warpedUnits = Math.max(0, Math.round(item.units * netFactor * commuteExposure));
    return { ...item, baselineUnits: item.units, units: warpedUnits, delta: warpedUnits - item.units, shockFactor: Number((warpedUnits / Math.max(1, item.units)).toFixed(2)), index };
  });
  const shockLoad = shocks.typhoon * 0.34 + shocks.transitBlockage * 0.42 + shocks.demandSpike * 0.38;
  const constraints: ShockConstraint[] = [
    { label: "Weather access", status: shocks.typhoon >= 70 ? "critical" : shocks.typhoon >= 35 ? "watch" : "stable", detail: shocks.typhoon >= 70 ? "Route access may be interrupted; protect exposed nodes." : shocks.typhoon >= 35 ? "Monitor service windows and outdoor demand." : "No weather constraint detected." },
    { label: "Transit flow", status: shocks.transitBlockage >= 70 ? "critical" : shocks.transitBlockage >= 35 ? "watch" : "stable", detail: shocks.transitBlockage >= 70 ? "Diversion pressure is likely to move demand to nearby nodes." : shocks.transitBlockage >= 35 ? "Expect localized arrival-time variance." : "Transit network remains within baseline assumptions." },
    { label: "Inventory pressure", status: shocks.demandSpike >= 70 ? "critical" : shocks.demandSpike >= 35 ? "watch" : "stable", detail: shocks.demandSpike >= 70 ? "Demand shock can breach replenishment thresholds quickly." : shocks.demandSpike >= 35 ? "Pull forward replenishment for high-velocity SKUs." : "Demand remains close to baseline." },
  ];
  const inventoryThresholds = products.map(item => { const projectedDailyDemand = Number((item.dailyRate * demandFactor).toFixed(2)); const projectedDepletionDays = item.onHand !== null && projectedDailyDemand > 0 ? Number((item.onHand / projectedDailyDemand).toFixed(1)) : item.sellOutInDays; const trigger = projectedDepletionDays !== null && projectedDepletionDays <= 2 ? "Critical: replenish now" : projectedDepletionDays !== null && projectedDepletionDays <= 4 ? "Adapt: pull forward next run" : "Monitor: keep baseline cadence"; return { product: item.product, onHand: item.onHand, projectedDailyDemand, projectedDepletionDays, trigger, status: projectedDepletionDays !== null && projectedDepletionDays <= 2 ? "critical" : projectedDepletionDays !== null && projectedDepletionDays <= 4 ? "watch" : "stable" }; });
  const roadmap = [
    { threshold: "Watch", trigger: "Composite shock load ≥ 25", action: "Increase node checks and confirm one extra replenishment window.", active: shockLoad >= 25 },
    { threshold: "Adapt", trigger: "Composite shock load ≥ 55", action: "Rebalance inventory toward resilient routes; reserve 15–20% safety stock.", active: shockLoad >= 55 },
    { threshold: "Protect", trigger: "Composite shock load ≥ 80", action: "Pause exposed replenishment runs and route critical SKUs to alternate nodes.", active: shockLoad >= 80 },
  ];
  return { weatherFactor, transitFactor, demandFactor, netFactor, shockLoad: Number(shockLoad.toFixed(1)), warpedHours, constraints, inventoryThresholds, roadmap };
}

export function isShockActive(shocks: ShockInputs) { return shocks.typhoon > 0 || shocks.transitBlockage > 0 || shocks.demandSpike > 0; }

export function isShockReportReady(hasVendingData: boolean, hasShockResult: boolean) { return hasVendingData && hasShockResult; }

export function getShockReportSummary(shocks: ShockInputs) {
  return [
    `Sudden typhoon intensity: ${shocks.typhoon}%`,
    `Localized transit blockage: ${shocks.transitBlockage}%`,
    `Micro-retail demand spike: ${shocks.demandSpike}%`,
  ];
}

export function generateSampleSalesCsv(random: () => number = Math.random, now = new Date()) {
  const products = [
    { name: "Water", rate: 5, stock: 42 },
    { name: "Green Tea", rate: 3, stock: 30 },
    { name: "Rice Cracker", rate: 4, stock: 36 },
    { name: "Energy Bar", rate: 2, stock: 24 },
  ];
  const hours = [8, 10, 12, 14, 16, 18, 20];
  const dayCount = 4;
  const stock = new Map(products.map(item => [item.name, item.stock + Math.floor(random() * 18)]));
  const rows: string[] = ["timestamp,product,units,inventory_on_hand"];
  for (let day = dayCount - 1; day >= 0; day -= 1) {
    for (const hour of hours) {
      for (const product of products) {
        const rushMultiplier = hour >= 11 && hour <= 14 ? 1.35 : hour >= 17 ? 1.2 : 0.85;
        const noise = 0.65 + random() * 0.8;
        const units = Math.max(1, Math.round(product.rate * rushMultiplier * noise));
        const remaining = Math.max(0, (stock.get(product.name) ?? 0) - units);
        stock.set(product.name, remaining);
        const timestamp = new Date(now.getTime() - day * 86400000);
        timestamp.setHours(hour, 0, 0, 0);
        rows.push(`${timestamp.toISOString()},${product.name},${units},${remaining}`);
      }
    }
  }
  return rows.join("\n");
}

export type LuxFrameSample = { frame: number; angle: number; transmittedLight: number; scattering: number; diffraction: number };
export type LuxRiskFlag = { label: string; severity: "watch" | "elevated" | "high"; detail: string };

export function estimateLuxTransmission(frames: LuxFrameSample[]) {
  const samples = frames.filter(frame => Number.isFinite(frame.transmittedLight) && Number.isFinite(frame.scattering) && Number.isFinite(frame.diffraction));
  if (!samples.length) return { frameCount: 0, averageTransmission: 0, scatteringVariation: 0, diffractionVariation: 0, densityMap: Array.from({ length: 9 }, () => 0), flags: [] as LuxRiskFlag[] };
  const average = (key: keyof LuxFrameSample) => samples.reduce((sum, frame) => sum + Number(frame[key]), 0) / samples.length;
  const averageTransmission = average("transmittedLight");
  const scatteringValues = samples.map(frame => frame.scattering); const diffractionValues = samples.map(frame => frame.diffraction);
  const scatteringVariation = Math.max(...scatteringValues) - Math.min(...scatteringValues);
  const diffractionVariation = Math.max(...diffractionValues) - Math.min(...diffractionValues);
  const densityMap = Array.from({ length: 9 }, (_, index) => Number(Math.max(0, Math.min(1, 1 - (averageTransmission / 100) + ((scatteringValues[index % scatteringValues.length] - average("scattering")) / 200))).toFixed(2)));
  const flags: LuxRiskFlag[] = [];
  if (averageTransmission > 68) flags.push({ label: "High transmission pocket", severity: "high", detail: "Light passes through more readily than the screening baseline; inspect for voids or thin sections." });
  else if (averageTransmission > 48) flags.push({ label: "Transmission variation", severity: "elevated", detail: "Directional light response suggests a non-uniform internal structure." });
  if (scatteringVariation > 28) flags.push({ label: "Scattering discontinuity", severity: "elevated", detail: "Surface response changes across angles; repeat with fixed distance and calibrated illumination." });
  if (diffractionVariation > 22) flags.push({ label: "Diffraction anomaly", severity: "watch", detail: "Angle-dependent diffraction changes may indicate texture, layering, or subsurface interfaces." });
  if (!flags.length) flags.push({ label: "No strong screening flag", severity: "watch", detail: "The sampled response is comparatively uniform; this does not rule out hidden defects." });
  return { frameCount: samples.length, averageTransmission: Number(averageTransmission.toFixed(1)), scatteringVariation: Number(scatteringVariation.toFixed(1)), diffractionVariation: Number(diffractionVariation.toFixed(1)), densityMap, flags };
}

export type FleetEndpoint = { id: string; latitude: number; longitude: number; inventory: number; demandRate: number };
export type FleetTransfer = { fromVehicle: string; toVehicle: string; endpointId: string; units: number; reason: string };
export type FleetRouteSegment = { vehicleId: string; from: FleetEndpoint; to: FleetEndpoint; distanceKm: number };
export function simulateSwarmRouting(endpoints: FleetEndpoint[], vehicleCount = 3, vehicleCapacity = 200) {
  const bounded = endpoints.filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude)).slice(0, 50);
  const count = Math.max(1, Math.min(6, Math.floor(vehicleCount)));
  const capacity = Math.max(1, Math.floor(vehicleCapacity));
  const vehicles = Array.from({ length: count }, (_, index) => ({ id: `V-${index + 1}`, endpoints: [] as FleetEndpoint[], remainingInventory: 0, depletionRate: 0, routeDistance: 0, capacity, capacityUsed: 0, capacityPressure: "comfortable" as "comfortable" | "watch" | "over" }));
  bounded.forEach((endpoint, index) => vehicles[index % count].endpoints.push(endpoint));
  const transfers: FleetTransfer[] = [];
  const routeSegments: FleetRouteSegment[] = [];
  for (const vehicle of vehicles) {
    vehicle.remainingInventory = vehicle.endpoints.reduce((sum, item) => sum + item.inventory, 0);
    vehicle.capacityUsed = vehicle.remainingInventory;
    vehicle.capacityPressure = vehicle.capacityUsed > vehicle.capacity ? "over" : vehicle.capacityUsed > vehicle.capacity * 0.8 ? "watch" : "comfortable";
    vehicle.depletionRate = Number(vehicle.endpoints.reduce((sum, item) => sum + item.demandRate, 0).toFixed(2));
    vehicle.routeDistance = Number(vehicle.endpoints.reduce((sum, item, index) => { const previous = vehicle.endpoints[index - 1]; if (previous) routeSegments.push({ vehicleId: vehicle.id, from: previous, to: item, distanceKm: Number((Math.hypot(item.latitude - previous.latitude, item.longitude - previous.longitude) * 111).toFixed(2)) }); return sum + (previous ? Math.hypot(item.latitude - previous.latitude, item.longitude - previous.longitude) : 0); }, 0).toFixed(2));
  }
  for (let index = 0; index < vehicles.length; index += 1) { const vehicle = vehicles[index]; const next = vehicles[(index + 1) % vehicles.length]; const projectedNeed = vehicle.depletionRate * Math.max(1, vehicle.endpoints.length); if (vehicle.remainingInventory < projectedNeed && next.remainingInventory > projectedNeed) { const units = Math.max(1, Math.round(Math.min(next.remainingInventory - projectedNeed, projectedNeed - vehicle.remainingInventory))); transfers.push({ fromVehicle: next.id, toVehicle: vehicle.id, endpointId: vehicle.endpoints[0]?.id ?? "unassigned", units, reason: `${vehicle.id} approaches depletion before completing its assigned route.` }); } }
  const roadDistanceKm = Number((routeSegments.reduce((sum, segment) => sum + segment.distanceKm, 0) * 1.18).toFixed(2));
  return { endpointCount: bounded.length, capped: endpoints.length > 50, vehicleCount: count, vehicleCapacity: capacity, roadDistanceKm, routeSegments, vehicles, transfers, unassigned: Math.max(0, endpoints.length - bounded.length) };
}

export function getRouteDistanceDisplay(liveRoadDistanceKm: number | null, localEstimateKm: number) {
  return liveRoadDistanceKm === null
    ? { distanceKm: localEstimateKm, source: "coordinate estimate" as const }
    : { distanceKm: liveRoadDistanceKm, source: "road network" as const };
}

export type TrafficRouteCandidate = {
  id: string;
  distanceKm: number;
  durationMinutes: number;
  trafficDurationMinutes: number;
  minimumSpeedKmh: number;
};

export function compareTrafficRoutes(candidates: TrafficRouteCandidate[], baselineSpeedThresholdKmh = 40, fuelLitersPerKm = 0.09) {
  const original = candidates[0];
  if (!original) return { rerouteTriggered: false, selected: null, original: null, alternate: null, matrix: [] as Array<TrafficRouteCandidate & { fuelLiters: number; timeDeltaMinutes: number; fuelDeltaLiters: number; selected: boolean }> };
  const matrix = candidates.map(route => ({ ...route, fuelLiters: Number((route.distanceKm * fuelLitersPerKm).toFixed(2)), timeDeltaMinutes: Number((route.trafficDurationMinutes - original.trafficDurationMinutes).toFixed(1)), fuelDeltaLiters: Number(((route.distanceKm - original.distanceKm) * fuelLitersPerKm).toFixed(2)), selected: false }));
  const rerouteTriggered = original.minimumSpeedKmh < baselineSpeedThresholdKmh * 0.3;
  const ranked = [...matrix].sort((a, b) => (a.trafficDurationMinutes + a.fuelLiters * 1.8) - (b.trafficDurationMinutes + b.fuelLiters * 1.8));
  const selected = rerouteTriggered ? (ranked[0] ?? matrix[0]) : matrix[0];
  if (selected) selected.selected = true;
  return { rerouteTriggered, selected: selected ?? null, original: matrix[0] ?? null, alternate: matrix.find(route => route.id !== original.id) ?? null, matrix };
}

export function buildDepartureTimeline(durationMinutes: number, rerouteTriggered: boolean, departure = "06:00") {
  const [hours, minutes] = departure.split(":").map(Number);
  const arrival = new Date(Date.UTC(2026, 0, 1, Number.isFinite(hours) ? hours : 6, Number.isFinite(minutes) ? minutes : 0) );
  arrival.setUTCMinutes(arrival.getUTCMinutes() + Math.max(0, Math.round(durationMinutes)));
  const format = (date: Date) => date.toISOString().slice(11, 16);
  return { departure, arrival: format(arrival), status: rerouteTriggered ? "Alternate clear path selected" as const : "Original route retained" as const };
}
