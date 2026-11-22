import { useClickAway } from 'ahooks';

export {
  useToggle,
  useBoolean,
  useDebounce,
  useClickAway,
  usePrevious,
  useMount,
  useUnmount,
  useUpdateEffect,
  useSetState,
} from 'ahooks';

export function useClickOutside<T extends Event = Event>(
  target: Parameters<typeof useClickAway<T>>[1],
  onClickOutside: (event: T) => void,
  eventName?: Parameters<typeof useClickAway<T>>[2],
): void {
  useClickAway(onClickOutside, target, eventName);
}
