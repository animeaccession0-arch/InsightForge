# Project TODO

- [x] Establish the responsive analytics dashboard shell with sidebar navigation and a clear workspace overview.
- [x] Add entry points for Data analysis, Chart insights, and Product inspection.
- [x] Implement CSV upload UI with drag-and-drop, file metadata, preview, and column profiling.
- [x] Implement appropriate interactive charts from uploaded or reviewed data.
- [x] Add LLM-backed chart narrative generation for trends, anomalies, and key takeaways.
- [x] Add carefully framed business improvement tips with non-guaranteed language.
- [x] Add language selection for translated explanations and tips.
- [x] Implement secure product-photo upload persistence via S3-backed storage metadata.
- [x] Add LLM-backed visible-condition product photo assessment with observations and explicit limitations.
- [x] Add database schema, helpers, and tRPC procedures for datasets, analyses, and product inspections.
- [x] Add Vitest coverage for new backend procedures and analysis helpers.
- [x] Verify responsive layouts, interaction states, and TypeScript/build health.
- [x] Save the final project checkpoint for delivery.

- [x] Replace the naive CSV parser with robust quoted-field handling and true per-column profiling.
- [x] Generate chart series dynamically from uploaded CSV data and ground narratives in computed metrics and anomalies.
- [x] Remove hardcoded AI fallbacks and require authentication or show a proper error for product inspection.
- [x] Add persisted analysis records for saved chart narratives and tips.
- [x] Expand Vitest coverage for dataset and inspection procedure validation.
- [x] Run a production build and resolve any remaining interaction or error-state issues.

- [x] Compute explicit trend, spike/dip, and min/max delta metrics and pass them to the LLM.
- [x] Generate more appropriate chart types from dataset structure instead of only one heuristic series.
- [x] Wire the mobile menu control to a working navigation drawer or remove the inert control.
- [x] Add explicit CSV parse and upload error states for malformed or unsupported files.

- [x] Compute and pass largest increase and decrease deltas to the LLM.
- [x] Implement actual chart-type selection for categorical, time-series, and multi-numeric CSV structures.
- [x] Add visible dataset persistence failure feedback with a retry affordance.

- [x] Detect date/time columns and route time-series datasets to line/area charts separately from categorical bar charts.
- [x] Refine chart inference from parsed column semantics before the final checkpoint.

- [x] Add paste-to-analyze CSV input with validation and preview.
- [x] Add a free-access message and keep the app free of payment or subscription gates.
- [x] Add downloadable PDF export for charts, explanations, and business tips.
- [x] Support multi-file product photo selection and batch AI assessment with per-image limitations.
- [x] Add tests, responsive verification, and a final checkpoint for the extension.

- [x] Render each batch photo assessment with its own condition, observations, and limitations.
- [x] Add extension-focused tests for paste parsing, PDF export availability, and batch result state handling.
- [x] Capture mobile verification for paste, export, and batch inspection flows.

- [x] Add tests that verify report export availability and per-photo batch state updates.
- [x] Capture explicit mobile views of the paste panel, export control, and batch inspection results.

- [x] Add a database-backed reviews table with authenticated author, 1–5 rating, review text, and timestamps.
- [x] Add protected create/list review procedures with rating and text validation.
- [x] Build a responsive feedback section for complaints, improvement suggestions, and star ratings.
- [x] Add honest empty states and success/error feedback without fabricated reviews or ratings.
- [x] Add Vitest coverage, run checks, visually verify, and save a final checkpoint.

- [x] Decide and document review-list visibility; keep recent ratings public while protecting submission if that is the intended product behavior.
- [x] Distinguish review submission success from error styling and show recent-review query errors explicitly.
- [x] Save a new checkpoint after the review-system changes and close the tracker.

- [x] Create and validate a reusable InsightForge web-app build workflow skill with concise reusable instructions.
- [x] Add admin-only review metrics for average rating, rating distribution, and recent feedback.
- [x] Add admin navigation and responsive dashboard presentation without exposing admin data to regular users.
- [x] Add tests for admin authorization and rating metric calculations.
- [x] Run final checks, visually verify, save a website checkpoint, and deliver the reusable skill package.

- [x] Deliver the reusable skill package as a skill attachment.
- [x] Close the final verification and delivery tracker after skill delivery.

- [x] Add Predictive Vending & Micro-Retail Hub mode navigation and upload workflow.
- [x] Compute temporal sales velocity, time-of-day spikes, exact depletion markers, and seven-day product sell-out projections from uploaded logs.
- [x] Add explicit simulated external-variable controls and label projections as scenario-based estimates.
- [x] Add Heritage Quality Control & Material Defect Scanner mode with macro-photo upload and structured defect assessment.
- [x] Render color-coded structural health, grade percentage, diagnostic observations, artisanal correction notes, and vision limitations.
- [x] Add Global Academic Inbound Analytics Engine mode with admissions/exam CSV profiling.
- [x] Render region distribution maps, comparative subject trends, bottlenecks, regional enrollment projections, and executive recruitment summary.
- [x] Add focused backend/client tests, responsive verification, build checks, and a final checkpoint.

- [x] Add direct CSV file upload to the predictive vending and academic operational modes.
- [x] Use inventory-on-hand fields when present to calculate exact projected depletion markers; otherwise label sell-out timing as rate-only estimates.
- [x] Render AI vending narrative projections and academic caveats in the operational mode cards.
- [x] Add tests for inventory-aware depletion and mode-specific file ingestion.

- [x] Compute region-over-time applicant volume changes when year, cycle, or timestamp fields exist.
- [x] Render regional enrollment change projections alongside the academic distribution view.

- [x] Apply the selected weather scenario to vending projections and limit the result to the next 7 days.
- [x] Render a geographic-style regional distribution visualization for academic data with a clear no-geocoding limitation.
- [x] Reintroduce vending AI narrative output with scenario-labeled projections and caveats.
- [x] Add client tests for mode-specific CSV file ingestion helpers.
- [x] Save a new operational-mode checkpoint after all verification gaps are resolved.

- [x] Create dedicated menu destinations for Data analysis, Chart insights, Product inspection, Predictive Vending, Heritage QC, Academic Inbound, and Admin reviews.
- [x] Add an All tools overview that keeps every named tool accessible from one place.
- [x] Keep active menu state, mobile navigation, and focused content synchronized without dead ends.
- [x] Add navigation tests and verify desktop/mobile layouts before the next checkpoint.

- [x] Build a true All tools overview card grid with direct entry points for every named tool.
- [x] Add navigation interaction tests for menu registry, focused destinations, and mobile drawer behavior.
- [x] Capture explicit mobile verification after the menu refactor.

- [x] Add executable navigation interaction helpers/tests for named selection, focused destinations, and mobile drawer toggling.

- [x] Add a premium nature-inspired layered 3D background with meadow, hills, sky, and atmospheric depth.
- [x] Add continuously waving foreground grass with reduced-motion fallback.
- [x] Restyle dashboard surfaces with translucent glass treatment while preserving readable contrast.
- [x] Verify desktop/mobile responsiveness, motion behavior, contrast, and production build before checkpoint.

- [x] Add a Synthetic Shock & Chaos Simulation overlay to the VeloRoute analytics workspace.
- [x] Add interactive extreme-weather, transit-blockage, and micro-retail demand-spike controls.
- [x] Add client-side differential constraint sweep calculations with no server-side recalculation.
- [x] Warp baseline hourly sales velocity charts immediately when shocks activate.
- [x] Render real-time inventory adaptation thresholds and a risk mitigation roadmap.
- [x] Add regression tests, responsive verification, and a final checkpoint for the simulation overlay.

- [x] Add SKU-level inventory adaptation thresholds tied to on-hand stock, projected demand delta, and depletion horizon.
- [x] Capture a mobile verification of the Synthetic Shock & Chaos Simulation overlay.
- [x] Save a new reviewable checkpoint after the chaos simulation overlay passes final verification.

- [x] Add a dedicated PDF export button for the Synthetic Shock & Chaos Simulation.
- [x] Include active shocks, warped versus baseline hourly chart, constraint sweep, inventory thresholds, and mitigation roadmap in the report.
- [x] Add report-export tests, responsive verification, and a final checkpoint.

- [x] Add direct regression coverage for Synthetic Shock PDF export availability and export-ready state logic.
- [x] Capture a trusted visual review with the shock export UI visible and reachable.
- [x] Save a new reviewable checkpoint after the shock PDF export feature passes validation.
- [x] Capture and document a trusted visual review of the Predictive Vending chaos panel with the Export shock PDF button clearly visible and reachable, including mobile viewport verification.

- [x] Add a deterministic-schema, varied-on-demand sample sales CSV generator for Predictive Vending tests.
- [x] Add UI controls to load a fresh generated sales CSV into the analyzer and download it as a file.
- [x] Add generator tests, responsive verification, and a final checkpoint for the sample-data feature.
- [x] Add explicit desktop and mobile verification for the new sample-sales load/download controls in the Predictive Vending panel.
- [x] Save a new reviewable checkpoint after the sample-CSV generator and controls pass validation, then mark the checkpoint item complete.

- [x] Add an AI Language Lab destination with selectable target languages and learner paths.
- [x] Add guided vocabulary/sentence lessons, writing corrections, and speaking practice with pronunciation-feedback limitations.
- [x] Add five-minute Test and twenty-minute Exam flows with writing, speaking, recognition prompts, scoring, and completion summaries.
- [x] Add downloadable test/exam certificates and server-side structured AI procedures for lesson, writing, speaking, and scoring feedback.
- [x] Add Language Lab tests, responsive verification, production checks, and a final checkpoint.
- [x] Add a dedicated word-recognition activity to the Test and Exam flows and include it in scoring.
- [x] Capture explicit desktop and mobile verification of the Language Lab workspace states.
- [x] Save a new reviewable checkpoint after the Language Lab passes final verification.
- [x] Add verifiable focused Language Lab route support for responsive screenshots and document lesson, speaking, writing, and assessment states.
- [x] Save the post-verification Language Lab checkpoint and close its tracker item.
- [x] Add direct mode query support for focused Language Lab state verification and document Lessons, Speaking, Writing, and Assessment views.
- [x] Save the post-verification Language Lab checkpoint after all focused states are verified.

- [x] Expand the AI Language Lab quick-pick catalog to at least 50 languages while preserving free-form entry.
- [x] Add catalog regression coverage and verify the expanded selector responsively.
- [x] Save and publish a checkpoint for the expanded language catalog.

- [x] Add learner-friendly speech playback with slower speed, pause/resume, and clearer voice controls.
- [x] Add regional accent choices and browser voice matching with an honest unavailable-voice fallback.
- [x] Add voice-selection tests, responsive verification, and a final checkpoint for the speaking enhancement.

- [x] Add a global tool search field that filters every InsightForge workspace by name and description.
- [x] Add keyboard-friendly search behavior, direct tool selection, and a useful no-results state.
- [x] Add search regression tests, responsive verification, and a final checkpoint.
- [x] Verify tool search visibility, filtering, direct selection, and no-results state on desktop and mobile.
- [x] Save and publish a checkpoint for the global tool search.
- [x] Add searchable description metadata for each tool and include descriptions in filtering.
- [x] Add direct-selection and no-results regression coverage, with focused desktop/mobile evidence for the no-results state.
- [x] Save a post-search reviewable checkpoint after all verification is complete.

- [x] Redesign the global shell with near-black surfaces, lime signal accents, editorial typography, and immersive visual layers inspired by the reference.
- [x] Add compact mobile top navigation and bottom navigation while preserving desktop workspace navigation and tool search.
- [x] Retheme shared dashboard surfaces and controls without changing existing analytics, Language Lab, export, or admin behavior.
- [x] Add responsive/accessibility regression coverage, desktop/mobile visual verification, and a final checkpoint.
- [x] Add focused regression coverage for responsive navigation accessibility, mobile bottom-nav selection, and focusable tool search.
- [x] Verify the redesigned operational, export, Language Lab, and admin surfaces remain legible and behaviorally reachable under the dark theme.
- [x] Save a post-redesign reviewable checkpoint after focused verification.
- [x] Add direct helper coverage for active navigation semantics, labelled/focusable tool search, and admin access gating.
- [x] Capture focused dark-theme evidence for the Export PDF header action and the role-gated Admin destination state.
- [x] Save the post-redesign checkpoint after the focused verification.

- [x] Add a Duolingo-inspired lesson path with step progress, practice rounds, and completion feedback.
- [x] Add five hearts, mistake deduction, disabled practice at zero hearts, and refill countdown messaging capped at five hours.
- [x] Add playful conversational speaking dialogues with target-language prompts, accent playback, and correction feedback.
- [x] Preserve tests, exams, certificates, multilingual support, and add responsive regression coverage plus a final checkpoint.
- [x] Add a true lesson-complete state with reward feedback and prevent practice from wrapping after the final item.
- [x] Make speaking dialogue prompts target-language aware through structured AI generation with a safe fallback.
- [x] Re-run focused responsive verification for lesson and speaking flows, then save the post-game checkpoint.
- [x] Add a structured AI dialogue-generation procedure for target-language speaking scenes with safe fallback behavior.
- [x] Add dialogue-generation regression coverage and save the final Language Lab checkpoint.
- [x] Wire all AI-generated dialogue fields into the Speaking workspace and make local fallback scene changes consistent.
- [x] Add dedicated dialogue scene and fallback regression coverage, then save the final Language Lab checkpoint.
- [x] Ensure the Speaking workspace keeps the complete AI dialogue scene, including its target-language line, after generation; use fallback only before AI generation.
- [x] Add precedence regression coverage for AI scene versus fallback scene and save the final Language Lab checkpoint.
- [x] Keep an AI-generated speaking scene authoritative while allowing New scene to clear it before selecting a local fallback.
- [x] Add flow-level dialogue authority regression coverage and save the final post-dialogue checkpoint.
- [x] Add a focused regression test proving an AI scene remains active until New scene switches back to fallback content.
- [x] Save and publish the final post-dialogue-authority checkpoint.
- [x] Add an explicit dialogue state-transition helper used by AI generation and New scene, with regression coverage for AI-authoritative then fallback behavior.
- [x] Save and publish the post-dialogue-authority checkpoint after the final validation.

- [x] Add XP rewards for lesson practice, speaking, writing, recognition, and completed assessments.
- [x] Add daily XP goal progress and achievement badges with clear unlocked/locked states.
- [x] Add gamification regression tests, responsive verification, and a final checkpoint.

- [x] Add KuraVision sequential directional-light video ingestion and a Lux-Transmission sounding estimate with scattering/diffraction metrics and subsurface-risk flags.
- [x] Add VeloRoute endpoint CSV ingestion capped at 50 retail endpoints, multi-vehicle routing, per-vehicle depletion tracking, and mid-route transfer recommendations.
- [x] Add visible estimated-result limitations, accessible controls, regression tests, responsive verification, and a final checkpoint.
- [x] Add a regression scenario that deterministically produces a mid-route inventory transfer recommendation between vehicles.
- [x] Re-run final validation and close the operations-engine checkpoint after transfer behavior is verified.

- [x] Extend swarm routing results with road-distance estimates, route segments, vehicle capacity, and capacity-pressure metrics.
- [x] Add an interactive VeloRoute map with endpoint markers, vehicle route overlays, and selected-route details.
- [x] Add explicit straight-line fallback and road-network estimation messaging, regression coverage, responsive verification, and a final checkpoint.
- [x] Re-run route overlay setup after MapView becomes ready so markers and road directions are actually drawn for simulated endpoints.
- [x] Add a deterministic map-ready regression contract and verify a populated demo network on desktop/mobile before checkpointing.
- [x] Add a pure route-distance display/status helper used by the map metrics and cover live-road versus coordinate fallback states.
- [x] Save the final interactive VeloRoute map checkpoint after the helper and verification pass.

- [x] Add traffic-aware ETA inputs and segment speed metrics with live/simulated/fallback source labeling.
- [x] Add a rerouting matrix that triggers below 30% baseline speed and compares original versus alternate time and fuel constraints.
- [x] Update VeloRoute map overlays and departure timeline with the selected alternate path, plus regression tests, responsive verification, and a final checkpoint.
- [x] Add clear traffic-feed source status and fallback ETA rows when live directions are unavailable, without claiming real-time congestion.
- [x] Add regression coverage for non-reroute and live/fallback route display states before the final checkpoint.

- [x] Audit and correct unreadable foreground colors across dark workspace cards and result panels.
- [x] Fix textarea, select, input, placeholder, muted text, border, and focus-state contrast on desktop and mobile.
- [x] Add contrast regression coverage, responsive visual verification, and a final checkpoint.
- [x] Capture focused desktop contrast verification for Language Lab, VeloRoute, and shared feedback panels.
- [x] Save the post-contrast-fix checkpoint after desktop verification.

- [x] Prepare a complete GitHub-ready source archive without local secrets or generated dependencies.
- [x] Add deployment instructions explaining GitHub source hosting versus full-stack application hosting.
- [x] Validate archive contents and deliver the downloadable code package.

- [ ] Inspect the user-provided GitHub Pages InsightForge URL and identify the repository/deployment shape.
- [ ] Compare GitHub Pages static-hosting constraints with the full-stack InsightForge source.
- [ ] Synchronize or prepare the repository update only after confirming the target and required authorization.
- [ ] Verify the resulting GitHub Pages state and document any backend limitations.

- [ ] Inspect the connected GitHub session and repository write capability.
- [ ] Prepare the full-stack source and a GitHub Pages-compatible static fallback strategy without exposing secrets.
- [ ] Replace or synchronize the authorized GitHub repository with the validated working code.
- [ ] Verify the GitHub Pages route and document that backend-powered features need full-stack hosting.
