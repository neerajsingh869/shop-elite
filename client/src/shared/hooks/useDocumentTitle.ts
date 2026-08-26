import { useEffect } from "react";

const SITE_NAME = "ShopElite";

/*
  Keeps the browser tab title in sync with the page.
  In a SPA the title never changes on its own, and screen readers announce the
  document title after navigation - without this every single page announces
  "ShopElite" and the user cannot tell that anything moved (WCAG 2.4.2).
*/
function useDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title) return;

    document.title = `${title} | ${SITE_NAME}`;
  }, [title]);
}

export default useDocumentTitle;
