import React from "react";
import { FaFacebook, FaLine } from "react-icons/fa";

function FooterUser() {
  return (
    <footer className="bg-transparent text-white mt-7 p-4 text-center  sticky top-[100vh]">
      <div className="flex  container mx-auto justify-between text-sm">
        <label>Forest Tales</label>
        <div>
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Menu</a>
            </li>
            <li>
              <a>About us</a>
            </li>
          </ul>
        </div>
        <div>
          <label>Our Product</label>
          <div className="flex gap-2">
            <ul>
              <li>
                <a>Coffee</a>
              </li>
              <li>
                <a>Soft Drink</a>
              </li>
              <li>
                <a>Signature drink</a>
              </li>
            </ul>
            <ul>
              <li>
                <a>Cookie and Cake</a>
              </li>
              <li>
                <a>Matcha</a>
              </li>
              <li>
                <a>Coffee Beans</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <label>Contacts</label>
          <label>0640691 2709</label>
          <div className="flex gap-2">
            <a className="text-xl">
              <FaFacebook />
            </a>
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
