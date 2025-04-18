"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import { IoIosArrowDown } from "react-icons/io";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navItems = [
    {
      text: "Home",
      url: "/" 
    },
    { 
      text: "Stories", 
      url: "/stories"
    },
    { 
      text: "About", 
      url: "/about" 
    },
    { 
      text: "Contact Us", 
      url: "/contact" 
    },
  ];

  return (
    <main>
      <section className="flex items-center justify-between py-3 px-5 shadow-md">
        <div className="flex items-center gap-1 z-50">
          <Image src={"/logo.png"} width={30} height={30} alt="logo" />
          <p className="text-lg font-semibold text-blue-500">StoryNest</p>
        </div>

        <div className="flex items-center gap-8 max-lg:hidden ml-auto">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="text-lg text-black hover:text-blue-500 transition-all"
            >
              {item.text}
            </Link>
          ))}

          {session ? (
            <div>
              <button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="flex items-center gap-1"
              >
                <img
                  src={session?.user?.image}
                  alt={session?.user?.name.slice(0, 1).toUpperCase()}
                  className="w-8 h-8 rounded-full ml-2"
                />
                <IoIosArrowDown className="text-2xl text-gray-500" />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                <MenuItem onClick={handleClose}>
                  <Link href="/profile">My Profile</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/upload-story">Upload Story</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <button onClick={() => signOut()}>Sign Out</button>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="text-lg text-black hover:text-blue-500 transition-all ml-2"
            >
              Sign In
            </Link>
          )}
        </div>
        <button
          onClick={() => setShowNav(!showNav)}
          className="lg:hidden text-3xl text-blue-500 z-50"
        >
          {showNav ? <IoClose /> : <IoIosMenu />}
        </button>
      </section>

      {showNav && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-screen flex flex-col items-center py-16 bg-white z-40 overflow-y-auto">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              onClick={() => setShowNav(false)}
              className="text-lg py-2 text-black font-medium hover:text-blue-500 transition"
            >
              {item.text}
            </Link>
          ))}

          {session ? (
            <div className="flex flex-col items-center gap-3 mt-6 w-3/4 max-w-xs">
              <img
                src={session?.user?.image}
                alt={session?.user?.name?.slice(0, 1)}
                className="w-12 h-12 rounded-full"
              />
              <Link
                href="/profile"
                onClick={() => setShowNav(false)}
                className="block text-blue-500 hover:underline"
              >
                My Profile
              </Link>
              <Link
                href="/upload-story"
                onClick={() => setShowNav(false)}
                className="block text-blue-500 hover:underline"
              >
                Upload Story
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setShowNav(false);
                }}
                className="text-red-500 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setShowNav(false)}
              className="mt-4 text-lg text-blue-500 font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </main>
  );
};

export default Navbar;
