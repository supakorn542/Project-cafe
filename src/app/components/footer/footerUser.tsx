import Link from "next/link";
import React from "react";
import { FaFacebook, FaLine } from "react-icons/fa";

interface FooterProp {
  color?: string;
}

function FooterUser({ color = "white" }: FooterProp) {
  return (
    <footer
      className={`bg-transparent text-${color} mt-7 p-4 text-center  sticky top-[100vh]`}
    >
      <div className="flex  container mx-auto justify-between text-sm">
        <label>Forest Tales</label>
        <div>
          <ul>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/user/menu"}>Menu</Link>
            </li>
            <li>
              <Link href={"/user/aboutus"}>About us</Link>
            </li>
          </ul>
        </div>
        <div>
          <Link href={"/user/menu"}>Our Product</Link>
          <div className="flex gap-2">
            <ul>
              <li>
                <Link href={"/user/menu"}>Coffee</Link>
              </li>
              <li>
                <Link href={"/user/menu"}>Soft Drink</Link>
              </li>
              <li>
                <Link href={"/user/menu"}>Signature Drink</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href={"/user/menu"}>Matcha</Link>
              </li>
              <li>
                <Link href={"/user/menu"}>Coffee Bean</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <label>Contacts</label>
          <label>0640691 2709</label>
          <div className="flex gap-2" >
            <Link className="text-xl" href={"https://www.facebook.com/paranyu.limkul"}>
              <FaFacebook />
            </Link>

            <a className="text-xl">
              <FaLine />{" "}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterUser;
