# Global Icons Registry Rules & Guidelines

To enforce import hygiene, reduce compilation bundle weights, and avoid duplicate graphic libraries, the main web application (`src/`) has a strict convention regarding UI icons.

---

## 1. Banned Direct Imports of `lucide-react`

Inside the main web application directory (`src/`), under no circumstances are you allowed to import icons directly from `lucide-react` or similar icon packages.

```tsx
// ❌ BAD (Do NOT do this in the main web app)
import { Sparkles, Trash } from 'lucide-react';

// ✅ GOOD (Always use the auto-imported Icons namespace)
const MyComponent = () => (
  <div>
    <Icons.Sparkles style={{ width: 16, height: 16 }} />
    <Icons.Trash style={{ width: 16, height: 16 }} />
  </div>
);
```

---

## 2. Standard Usage of the `Icons` Object

The `Icons` object is a centralized registry containing optimized Lucide icons, styled dynamically with custom classes.

### Styling Icons

Icons accept standard React `style` and `className` props. Prefer StyleX for styling:

```tsx
import * as stylex from '@stylexjs/stylex';

const iconStyles = stylex.create({
  accent: { color: 'var(--primary)', width: 20, height: 20 },
  small: { width: 16, height: 16 },
  spinner: { width: 24, height: 24, color: 'var(--primary)' },
});

<Icons.Sparkles {...stylex.props(iconStyles.accent)} />
<Icons.ArrowLeft {...stylex.props(iconStyles.small)} />
<Icons.Loader2 {...stylex.props(iconStyles.spinner)} />
```

---

## 3. Adding New Icons to the Registry

If your task requires an icon that is not currently present on the `Icons` object:

1. Open the package registry file: [packages/components/src/Icons/Icons.tsx](file:///Users/lvtruong/personal/vlrc-fe/packages/components/src/Icons/Icons.tsx).
2. Import the desired icon from `lucide-react` at the top of the package file (explicit package imports _are_ required in `packages/` since it compiles independently).
3. Append the icon to the exported `Icons` object map.
4. Run `pnpm build` to compile the package and verify its exports.
5. In your web application `src/` code, access the newly added icon globally using `Icons.MyNewIcon` without writing any imports.
