# Global Icons Registry Rules & Guidelines

To enforce import hygiene, reduce compilation bundle weights, and avoid duplicate graphic libraries, `@vlrc-fe/components` provides a unified icon system backed by Lucide and Astryx `IconProvider`.

---

## 1. Banned Direct Imports of `lucide-react`

Inside consumer applications and packages, under no circumstances are you allowed to import icons directly from `lucide-react`:

```tsx
// ❌ BAD (Do NOT import directly from lucide-react)
import { Sparkles, Trash } from 'lucide-react';

// ✅ GOOD (Always use the centralized Icons registry from @vlrc-fe/components)
import { Icons, HStack } from '@vlrc-fe/components';

const MyComponent = () => (
  <HStack gap="sm">
    <Icons.Sparkles />
    <Icons.Trash />
  </HStack>
);
```

---

## 2. Standard Usage of the `Icons` Object

The `Icons` object is a centralized registry containing optimized icons that accept standard `sx` (StyleX) and `className` props:

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icons, HStack } from '@vlrc-fe/components';
import { colors } from '@vlrc-fe/components/theme';

const iconStyles = stylex.create({
  accent: {
    color: colors.primary,
  },
  destructive: {
    color: colors.destructive,
  },
});

export function IconBar() {
  return (
    <HStack gap="sm">
      <Icons.Sparkles sx={iconStyles.accent} />
      <Icons.Trash sx={iconStyles.destructive} />
      <Icons.Loader2 />
    </HStack>
  );
}
```

---

## 3. Adding New Icons to the Registry

If your feature requires an icon that is not currently present on the `Icons` object:

1. Open the package registry file: `packages/components/src/Icons/Icons.tsx`.
2. Import the desired icon from `lucide-react` at the top of the file.
3. Append the icon to the exported `Icons` object map.
4. Run `pnpm build` to compile the package and verify its exports.
5. In application code, access the newly added icon globally using `<Icons.MyNewIcon />`.
