"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingBasket } from "react-icons/fa";

interface NavnarProp {
  textColor?: string;
  color?: string;
  textWhenScroll?: string;
}

const Navbar = ({
  textColor = "text-black",
  textWhenScroll = "text-black",
  color = "black",
}: NavnarProp) => {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

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
    <nav
      className={`fixed flex justify-between top-0 left-0 right-0 transition-all duration-300 z-50 p-3 
                 ${scrolled? 'bg-white/40 text-black shadow-md saturate-[130%] backdrop-blur-md': 'bg-transparent text-black'} 
                 ${menuOpen? 'bg-white': ''}`} 
    >
      <div className={` ${menuOpen? `text-black`: scrolled? textWhenScroll: textColor}`}>
        <Link
          href="/"
          className={`font-gloock font-bold text-2xl }`}
        >
          Forest Tale
        </Link>
      </div>

      <div className="hidden md:block">
        <ul className="flex md:flex-row flex-col md:gap-[4vw] md:items-center gap-8 text-lg">
          <li>
            <Link
              href="/"
              className={`hover:text-gray-500 ${
                scrolled ? textWhenScroll : textColor
              } `}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/user/menu"
              className={`hover:text-gray-500 ${
                scrolled ? textWhenScroll : textColor
              }`}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/user/aboutus"
              className={`hover:text-gray-500 ${
                scrolled ? textWhenScroll : textColor
              }`}
            >
              About us
            </Link>
          </li>
        </ul>
      </div>



      {/* เมื่อล็อคอินแล้วว */}

      <div className="flex items-center gap-8 pr-2">
        {user ? (
          <>
            <div>
              <Link href={"/user/cart"}>
                <FaShoppingBasket
                  className={`text-3xl cursor-pointer ${textColor} `}
                />
              </Link>
            </div>

            <div className="relative" ref={dropdownRef}>
              <MdAccountCircle
                onClick={toggleDropdown}
                className={`text-3xl cursor-pointer ${textColor}`}
              />
              {isOpen && (
                <div className="absolute  -translate-x-1/2 min-w-max z-10 mt-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 dark:divide-gray-600">
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
        ) : 
        // เทื่อไม่ได้ล็อคอิน
        (
          <>
            <Link href="/signin">
              <button
                className={`bg-transparent px-2 py-1 rounded-3xl border border-${color} hover:bg-slate-400 ${
                  scrolled ? textWhenScroll : textColor
                }`}
              >
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button
                className={`bg-transparent px-2 py-1 rounded-3xl border border-${color} hover:bg-slate-400 ${
                  scrolled ? textWhenScroll : textColor
                }`}
              >
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

      {/* ส่วนของจอเล็ก */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
          <ul className="flex flex-col items-start py-4 px-6 gap-4 text-lg text-black">
            <li>
              <Link
                href="/"
                className="hover:border-b-2 transition-all ease-in-out fade-in-stagger"
                style={{ animationDelay: "0s" }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/user/menu"
                className={`hover:border-b-2 transition-all ease-in-out fade-in-stagger" `}
                style={{ animationDelay: "0.5s" }}
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                href="/user/aboutus"
                className={`hover:border-b-2 transition-all ease-in-out fade-in-stagger"`}
                style={{ animationDelay: "1s" }}
              >
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
