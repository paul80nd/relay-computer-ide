import { useEffect, useRef, type DependencyList, type EffectCallback } from 'react';

function useUpdate(effect: EffectCallback, deps: DependencyList, applyChanges = true) {
  const isInitialMount = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    isInitialMount.current || !applyChanges
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps,
  );
}

export default useUpdate;
