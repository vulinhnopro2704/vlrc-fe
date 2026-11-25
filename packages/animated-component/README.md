# @vlrc-fe/animated-component

Optional GSAP and StyleX components built on `@vlrc-fe/components`.

```tsx
import '@vlrc-fe/components/theme.css';
import '@vlrc-fe/animated-component/styles.css';
import { GlassSurface, SlideIn } from '@vlrc-fe/animated-component';

<SlideIn from="right">
  <GlassSurface>Work item details</GlassSurface>
</SlideIn>;
```

`GlassSurface` uses the current theme and falls back to an opaque surface when backdrop filters are unavailable. `SlideIn` runs only when the system motion preference allows it.
