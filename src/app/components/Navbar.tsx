"use client";

import Link from "next/link";
import { useState, useEffect,useRef } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingBasket } from "react-icons/fa";

interface NavnarProp {
  textColor?: string;

}

const Navbar = ( {textColor = "text-black" } : NavnarProp) => {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

 

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent  py-4 px-11 flex justify-between items-center">
      <div>
        <Link href="/" className={`font-gloock font-bold text-2xl ${textColor}`}>
          Forest Tale
        </Link>
      </div>

      <div className="hidden md:block">
        <ul className="flex md:flex-row flex-col md:gap-[4vw] md:items-center gap-8 text-lg">
          <li>
            <Link href="#" className={`hover:text-gray-500 ${textColor}`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="#" className={`hover:text-gray-500 ${textColor}`}>
              Menu
            </Link>
          </li>
          <li>
            <Link href="#" className={`hover:text-gray-500 ${textColor}`}>
              About us
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-8">
        {user ? (
          <>
            <FaShoppingBasket className={`text-3xl cursor-pointer ${textColor} `}  />
            <div className="relative" ref={dropdownRef}>
              <MdAccountCircle
                onClick={toggleDropdown}
                className={`text-3xl cursor-pointer ${textColor}`}
              />
              {isOpen && (
                <div  className="absolute left-1/2 -translate-x-1/2 min-w-max z-10 mt-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 dark:divide-gray-600">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                    <li>
                      <Link
                        href="/user/profile"
                        className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white `}
                      >
                        Profile
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <Link
                      href="#"
                      onClick={signOutUser}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white`}
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/signin">
              <button className="bg-transparent px-2 py-1 rounded-3xl border border-black hover:bg-blue-400">
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-transparent px-2 py-1 rounded-3xl border border-black hover:bg-blue-400">
                Sign up
              </button>
            </Link>
          </>
        )}

        {menuOpen ? (
          <AiOutlineClose
            onClick={toggleMenu}
            className={`text-2xl cursor-pointer md:hidden ${textColor}`}
            aria-label="Close menu"
          />
        ) : (
          <AiOutlineMenu
            onClick={toggleMenu}
            className={`text-2xl cursor-pointer md:hidden ${textColor}`}
            aria-label="Open menu"
          />
        )}
      </div>

      {menuOpen && (
    <div className="absolute top-full left-0 w-full bg-transparent shadow-md md:hidden">
      <ul className="flex flex-col items-start py-4 px-6 gap-4 text-lg">
        <li>
          <Link href="#" className={`hover:text-gray-500 ${textColor}`}>
            Home
          </Link>
        </li>
        <li>
          <Link href="#" className={`hover:text-gray-500 ${textColor}`}>
            Menu
          </Link>
        </li>
        <li>
          <Link href="#" className={`hover:text-gray-500 ${textColor}`}>
            About us
          </Link>
        </li>
      </ul>
    </div>
  )}
    </nav>
  );
};

export default Navbar;
