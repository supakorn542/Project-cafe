"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image"



const Navbar = () => {
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

    return (
        <nav className={`sticky top-0 left-0 right-0 transition-all duration-300 z-50 ${
            scrolled ? "bg-white/80 text-black shadow-md saturate-[180%] backdrop-blur-md" : "bg-transparent text-white"
        } p-2`}>
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <Link href="/"></Link>
                    </div>
                    <ul className="flex space-x-20 font-semibold text-base font-sans">
                        <li className="hover:border-b-2 transition-all ease-in-out">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="hover:border-b-2 transition-all ease-in-out">
                            <Link href="/">PlanTrip</Link>
                        </li>
                        <li className="hover:border-b-2 transition-all ease-in-out">
                            <Link href="/">Explore</Link>
                        </li>
                        <li className="hover:border-b-2 transition-all ease-in-out">
                            <Link href="/">Q&A</Link>
                        </li>
                        <li className="hover:border-b-2 transition-all ease-in-out">
                            <img src="" alt="Icon" />
                        </li>
                    </ul>
                    <ul className="flex items-center space-x-3">
                        <li className="border-2 border-white rounded-full px-3 bg-white text-black text-lg font-semibold"><Link href="/">Sign in</Link></li>
                        <li className="border-2 border-white rounded-full px-3 bg-tranparent text-black text-lg font-semibold"><Link href="/">Sign up</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;