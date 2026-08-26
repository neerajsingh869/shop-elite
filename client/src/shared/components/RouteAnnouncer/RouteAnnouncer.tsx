import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

/*
  react-router swaps the page without a real browser navigation, so a screen
  reader stays completely silent and the user has no idea the page changed.
  This reads the new document title into a live region after each route change
  (WCAG 4.1.3 Status Messages).

  The small delay gives the new page a chance to mount and call
  useDocumentTitle first, otherwise we would announce the previous title.
*/
function RouteAnnouncer() {
  const [message, setMessage] = useState("");
  const location = useLocation();

  // first render is the normal page load - the browser already announces that,
  // announcing again would just repeat it
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      setMessage(`${document.title}, page loaded`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

export default RouteAnnouncer;
