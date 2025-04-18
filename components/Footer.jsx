import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <main className="border-t border-gray-200 mb-3">
      <div className="flex max-md:flex-col items-center gap-10 max-md:gap-3 justify-center text-sm text-gray-500 py-3">
        <Link href={"#"} className="hover:underline">
          FAQs
        </Link>
        <Link href={"#"} className="hover:underline">
          About
        </Link>
        <Link href={"#"} className="hover:underline">
          Contact
        </Link>
        <Link href={"#"} className="hover:underline">
          Privacy Policy
        </Link>
        <Link href={"#"} className="hover:underline">
          Terms of Use
        </Link>
      </div>
      <p className="text-center text-gray-500 text-xs">
        &copy; 2025 Storynest. All Rights Reserved.
      </p>
    </main>
  );
};

export default Footer;
