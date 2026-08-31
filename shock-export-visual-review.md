# Synthetic Shock PDF Export Visual Review

The Predictive Vending workspace was captured at desktop (1280×900) and mobile (390×844) viewport sizes after adding the `Export shock PDF` control. In both captures, the control is rendered inside the Synthetic Shock & Chaos Simulation panel beside `Reset shocks`, remains visible without horizontal overflow, and wraps with the panel controls on the narrow viewport. The button is intentionally disabled until a vending analysis result exists, which prevents generating an incomplete report; the readiness helper is covered by Vitest.

The mobile capture also confirms that the shock sliders, composite-load readout, export control, and reset control remain within the panel's readable flow. The desktop capture confirms the control aligns with the existing premium mint/coral simulation styling and does not disrupt the adjacent analytics workspace.
