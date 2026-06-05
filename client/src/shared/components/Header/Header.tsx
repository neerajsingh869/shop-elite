import { useState } from "react";
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

  return (
    <>
      {/* No need to check condition for CartDrawer component, it is already handled in that component */}
      <CartDrawer />
      <header className="border-b border-b-zinc-800">
        <div className="max-w-7xl flex justify-between items-center mx-auto py-6 px-6 md:px-8">
          <Link to={ROUTES.home} className="text-xl text-yellow-500 font-bold">
            ShopElite
          </Link>
          <div className="flex gap-4 sm:gap-6 md:gap-8 items-center justify-between">
            <SearchBar />
            <div
              className="relative cursor-pointer"
              onClick={() => dispatch(openCart())}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <div className="bg-yellow-500 rounded-full text-zinc-950 font-semibold text-center w-4 h-4 text-xs absolute right-0 top-0 translate-x-3 -translate-y-3">
                  {cartCount}
                </div>
              )}
            </div>
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="cursor-pointer flex items-center justify-center gap-1"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center uppercase text-zinc-950 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <ChevronDown
                    size={15}
                    className={`text-zinc-500 transition-colors ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showUserMenu && (
                  <div className="border absolute right-0 top-full mt-2 w-52 rounded-xl border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden z-50">
                    <div className="border-b border-zinc-800 px-4 py-3">
                      <p className="text-sm text-zinc-100 font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="px-4 py-3">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="text-red-400 text-sm flex gap-3 items-center cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <User className="cursor-pointer" size={18} />
                <span className="hidden sm:block">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
