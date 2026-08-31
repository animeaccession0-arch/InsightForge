# Reference-inspired redesign visual verification

The redesigned shell was checked on desktop and mobile with near-black surfaces, lime signal accents, outlined navigation, a compact header, and a fixed mobile bottom navigation. The overview, Language Lab, and Predictive Vending workspaces remain readable under the darker treatment.

Focused desktop captures for `?tool=Predictive%20Vending` and `?tool=Admin` show the operational CSV controls, sample-data actions, Export PDF header action, and role-gated Admin reviews surface with its loading/empty-feedback states. Focused mobile captures show the operational sample controls and Language Lab setup controls above the fixed Home/Data/Learn/Ops/Search navigation. Navigation uses `aria-current`, visible focus rings, and labelled inputs. Existing admin role gating and export button behavior remain unchanged; the theme is scoped through the root shell wrapper and global CSS overrides.
