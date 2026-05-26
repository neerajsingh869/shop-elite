import { Link } from "react-router";
import { ShoppingCart, User } from "lucide-react";

import { ROUTES } from "../../constants";
import SearchBar from "../SearchBar/SearchBar";

function Header() {
  return (
    <>
      <header className="border-b border-b-zinc-800">
        <div className="max-w-7xl flex justify-between items-center mx-auto py-6 px-6 md:px-8">
          <Link to={ROUTES.home} className="text-xl text-yellow-500 font-bold">
            ShopElite
          </Link>
          <div className="flex gap-4 sm:gap-6 md:gap-8 items-center justify-between">
            <SearchBar />
            <ShoppingCart className="cursor-pointer" size={20} />
            <User className="cursor-pointer" size={20} />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
