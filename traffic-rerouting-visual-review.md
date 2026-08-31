# Traffic-aware VeloRoute verification

The focused desktop and mobile captures use the populated `fleetDemo=1` state. The VeloRoute panel keeps the endpoint and road-distance metrics readable, while the map container and route-status note remain visible. The traffic-aware matrix is result-gated and will populate when the map provider returns route legs with traffic durations; the current preview correctly reports the local estimate fallback when live routing is unavailable. The mobile layout stacks the map, route cards, and any future timeline rows without horizontal overflow.
