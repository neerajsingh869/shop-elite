import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronDown, LogOut, ShoppingCart, User } from "lucide-react";

import { ROUTES } from "../../constants";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../../features/auth/authSelectors";
import SearchBar from "../SearchBar/SearchBar";
import { useAuth } from "../../../features/auth/hooks";
import { openCart } from "../../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import CartDrawer from "../../../features/cart/components/CartDrawer";
import { selectCartCount } from "../../../features/cart/cartSelectors";

function Header() {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const user = useAppSelector(selectUser);
  const cartCount = useAppSelector(selectCartCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const dispatch = useAppDispatch();

  const { logout } = useAuth();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);

  /*
    Close the account menu on Escape and on an outside click.
    Escape also puts focus back on the trigger - if we only hide the menu then
    focus is sitting on a button that no longer exists, the browser drops it
    onto <body> and a keyboard user gets thrown back to the top of the page.
  */
  useEffect(() => {
    if (!showUserMenu) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setShowUserMenu(false);
      userMenuTriggerRef.current?.focus();
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      // clicks on the trigger are handled by its own onClick
      if (
        userMenuRef.current?.contains(target) ||
        userMenuTriggerRef.current?.contains(target)
      ) {
        return;
      }

      setShowUserMenu(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [showUserMenu]);

  return (
    <>
      {/* No need to check condition for CartDrawer component, it is already handled in that component */}
      <CartDrawer />
      <header className="border-b border-b-zinc-800">
        <div className="max-w-7xl flex justify-between items-center mx-auto py-6 px-6 md:px-8">
          <Link to={ROUTES.home} className="text-xl text-yellow-500 font-bold">
            ShopElite
          </Link>
          <nav
            aria-label="Main"
            className="flex gap-4 sm:gap-6 md:gap-8 items-center justify-between"
          >
            <SearchBar />
            {/*
              Was a div with onClick - not focusable, no role, no name. A real
              button gives all three for free, plus Enter/Space handling.
            */}
            <button
              onClick={() => dispatch(openCart())}
              aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              className="relative cursor-pointer rounded-md p-0.5"
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {cartCount > 0 && (
                // decorative - the count is already in the button's name above,
                // announcing it twice is just noise
                <div
                  aria-hidden="true"
                  className="bg-yellow-500 rounded-full text-zinc-950 font-semibold text-center w-4 h-4 text-xs absolute right-0 top-0 translate-x-3 -translate-y-3"
                >
                  {cartCount}
                </div>
              )}
            </button>
            {isAuthenticated && user ? (
              <div className="relative">
                {/*
                  Deliberately a disclosure (aria-expanded), not role="menu".
                  role="menu" promises arrow key navigation, Home/End and
                  typeahead - we don't implement any of that, and a role that
                  lies about behaviour is worse than no role at all.
                */}
                <button
                  ref={userMenuTriggerRef}
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-expanded={showUserMenu}
                  aria-controls="user-menu"
                  aria-label={`Account menu for ${user.name}`}
                  className="cursor-pointer flex items-center justify-center gap-1 rounded-md"
                >
                  {user?.avatarUrl ? (
                    // alt="" because the button already carries the name -
                    // a filename or "avatar" here would just be read twice
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center uppercase text-zinc-950 font-bold text-sm"
                    >
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`text-zinc-400 transition-colors ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showUserMenu && (
                  <div
                    id="user-menu"
                    ref={userMenuRef}
                    className="border absolute right-0 top-full mt-2 w-52 rounded-xl border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden z-50"
                  >
                    <div className="border-b border-zinc-800 px-4 py-3">
                      <p className="text-sm text-zinc-100 font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="px-4 py-3">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="text-red-400 text-sm flex gap-3 items-center cursor-pointer rounded-md"
                      >
                        <LogOut size={15} aria-hidden="true" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // the label text is hidden below sm, and `hidden` is display:none
              // which drops it out of the a11y tree too - so on mobile this
              // link had no name at all. aria-label keeps it named at every
              // breakpoint and matches the visible text where there is one.
              <Link
                to="/login"
                aria-label="Sign in"
                className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <User className="cursor-pointer" size={18} aria-hidden="true" />
                <span className="hidden sm:block">Sign in</span>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
