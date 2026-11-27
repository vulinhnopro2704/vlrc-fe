# @vlrc-fe/animated-component

Optional GSAP motion and StyleX surfaces built on `@vlrc-fe/components`.

```tsx
import '@vlrc-fe/components/theme.css';
import '@vlrc-fe/animated-component/styles.css';
import { GlassSurface, SlideIn, FoxMascot, TrailBanner } from '@vlrc-fe/animated-component';

<SlideIn from="right">
  <GlassSurface>Work item details</GlassSurface>
</SlideIn>;

<TrailBanner
  title="Chapter 1: The Forest Path"
  detail="Master foundational vocabulary and explore the trail."
  artwork="/trail/forest.svg"
  companion={<FoxMascot label="Guide Fox" happy />}
/>;
```

## Components

- **`FoxMascot`**: Interactive paper fox with playful ear flicks, blinking, happy celebration state, and keyboard/screen-reader accessibility.
- **`TrailBanner`**: Mobile-first responsive illustrated chapter heading with GSAP entrance animations, optional action children, and companion mascot slot.
- **`GlassSurface`**: Semi-transparent blurred backdrop surface using theme tokens with graceful fallback for systems without backdrop filters.
- **`SlideIn`**: Directional entrance transitions (`left`, `right`, `top`, `bottom`) respecting user reduced-motion preferences.
