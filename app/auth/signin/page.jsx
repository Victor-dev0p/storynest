import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (session) {
    redirect("/upload-story");
  }
  return (
    <main className="min-h-dvh">
      <h1 className="text-center mt-10 text-2xl">
        Sign in to StoryNest with an option below
      </h1>

      <div className="max-w-2xl mx-auto my-10 p-5 flex flex-col justify-center items-center gap-10">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="flex items-center md:gap-5 gap-2 shadow-md text-lg py-2 px-6 rounded-full cursor-pointer">
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button className="flex items-center md:gap-5 gap-2 shadow-md text-lg py-2 px-6 rounded-full cursor-pointer">
            <FaGithub className="text-2xl text-gray-800" />
            Continue with Github
          </button>
        </form>
        <button className="flex items-center md:gap-5 gap-2 shadow-md text-lg py-2 px-6 rounded-full">
          <FaFacebook className="text-2xl text-blue-500" />
          Continue with Facebook
        </button>
        <span className="text-sm">
          By signing in, you accept our{" "}
          <Link href={"#"} className="hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href={"#"} className="hover:underline">
            Terms of Use
          </Link>
        </span>
      </div>
    </main>
  );
};

export default page;
