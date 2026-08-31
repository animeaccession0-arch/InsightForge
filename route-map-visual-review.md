# VeloRoute route-map verification

The populated desktop and mobile captures use the focused `fleetDemo=1` state. Both show six endpoint rows, configurable fleet count and capacity, endpoint/road-distance/transfer metrics, the interactive map container, and per-vehicle capacity-pressure cards. The narrow layout stacks the map and vehicle cards without horizontal overflow. Google road directions are requested after the map becomes ready; while the request is pending, the UI reports the local coordinate estimate and keeps the route result readable.
