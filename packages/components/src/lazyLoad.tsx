import { lazy, Suspense, type ComponentProps, type ComponentType, type ReactNode } from 'react';

// oxlint-disable-next-line typescript/no-explicit-any
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: ReactNode = null,
) {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props: ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
