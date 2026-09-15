import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  // pass labelledBy when the dialog has a visible heading (preferred, because
  // the name then always matches what is on screen), label when it does not
  labelledBy?: string;
  label?: string;
  className?: string;
  backdropClassName?: string;
}

/*
  Everything that has to be true for a dialog, in one place.

  A dialog is the one pattern where plain HTML is not enough - <dialog> exists
  but its styling and behaviour are still uneven across browsers, so this is
  the ARIA version. All three overlays in the app (cart, checkout, search) went
  through the same list of bugs: not announced as a dialog, Tab walked out of
  them into the page behind, Escape did nothing, and focus was dumped on <body>
  on close so keyboard users landed back at the top of the document.
*/

// order matters - this is also the tab order inside the dialog
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function Modal({
  isOpen,
  onClose,
  children,
  labelledBy,
  label,
  className = "",
  backdropClassName = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  /*
    onClose is held in a ref so the effect below can depend on isOpen alone.

    Every caller passes a fresh closure - an inline arrow, or a function
    declared in the component body - so onClose has a new identity on every
    parent render. While it sat in the dependency array, typing a single
    character into a field inside the dialog tore the effect down and re-ran
    it, which re-ran the "move focus into the dialog" step: focus was yanked
    out of the field and onto the first focusable element - in checkout, the
    close button - so the field could not be typed into at all.

    Focus restore survived this by accident: the cleanup put focus back on
    the trigger before each re-run, so the re-captured previouslyFocused kept
    resolving to the same element. Worth knowing, but not something to rely
    on - the effect should only run when the dialog opens or closes.

    Fixed here rather than by asking every caller to useCallback: this
    component owns the invariant, and one missed call site would bring the
    bug back silently.
  */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    // remember who opened the dialog so focus can go back there on close
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const appRoot = document.getElementById("root");

    // stop the page behind scrolling under the dialog
    document.body.classList.add("overflow-hidden");

    /*
      inert takes the rest of the app out of the tab order AND out of the
      accessibility tree. aria-modal on its own is not enough - a screen
      reader's virtual cursor can still wander into the page behind, and our
      dialogs are portalled to document.body so they are outside #root anyway.
    */
    appRoot?.setAttribute("inert", "");

    // move focus into the dialog, otherwise it stays on the trigger behind it
    const firstFocusable =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? dialogRef.current)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // capture phase + stopPropagation so a dialog opened on top of another
        // listener does not close both at once
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ??
          [],
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // wrap at both ends so Tab can never walk out into the page behind
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.classList.remove("overflow-hidden");
      appRoot?.removeAttribute("inert");

      // give focus back to whatever opened us - without this the browser drops
      // focus on <body> and the next Tab starts from the top of the page
      previouslyFocused?.focus();
    };
    // isOpen only - see the onCloseRef comment above. This effect sets up and
    // tears down focus management, so it must run when the dialog opens or
    // closes and at no other time.
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    /*
      eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events --
      Clicking the backdrop is a mouse-only shortcut. The keyboard equivalent
      is Escape, handled above, so this does not need its own key handler and
      making the backdrop focusable would just add a junk tab stop.
    */
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={backdropClassName}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        tabIndex={-1}
        className={className}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
