import { useEffect } from "react";

/*
  Scroll back to the top once a page has finished loading.

  This used to call scrollIntoView() on an empty <div ref={topRef}> sitting at
  the top of the page content. That works visually, but scrollIntoView also
  sets Chrome's "sequential focus navigation starting point" to that element -
  so the very first Tab press resumed from inside <main> and skipped the skip
  link and the entire header. window.scrollTo does not move that point.

  Caught by the keyboard pass, not by axe - a scanner cannot see it because
  the DOM order was correct the whole time.
*/
function useScrollToTop(loadingStatus: boolean) {
  useEffect(() => {
    if (loadingStatus) return;

    // the CSS reduced-motion block cannot reach a JS scroll option
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [loadingStatus]);
}

export default useScrollToTop;
