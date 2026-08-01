import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setIsHeaderVisible } from "../redux/slices/appSlice";

const SCROLL_TOP_THRESHOLD = 100;

/**
 * Hides the header when the user scrolls down a page and reveals it again
 * when they scroll back up, without reaching into the DOM directly.
 * Visibility is stored in Redux so any component (Header, BasketDrawer)
 * can react to it declaratively.
 */
export function useHeaderAutoHide() {
  const dispatch = useDispatch();
  const lastScrollRef = useRef(0);

  const handleHeaderScroll = useCallback(
    (scrollTop) => {
      const lastScroll = lastScrollRef.current;
      const isVisible = scrollTop <= SCROLL_TOP_THRESHOLD || lastScroll > scrollTop;

      dispatch(setIsHeaderVisible(isVisible));
      lastScrollRef.current = scrollTop;
    },
    [dispatch]
  );

  return handleHeaderScroll;
}
