"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { query, limit, getDocs, collection } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const genres = [
  { name: "Fantasy", img: "/Fantasy.png" },
  { name: "Romance", img: "/Romance.png" },
  { name: "Sci-Fi", img: "/sci-fi.png" },
  { name: "Mystery", img: "/Mystery.png" },
  { name: "Horror", img: "/HorrorZ.png" },
  { name: "Sorcery", img: "/HorrorV.png" },
  { name: "Comedy", img: "/Comedy.png", hidden: true },
  { name: "Drama", img: "/Drama.png", hidden: true },
];

const topPicks = [
  {
    img: "/Betrayedbond.png",
    description:
      "Jason Carter built his life around his family—until a DNA test shattered everything...",
  },
  {
    img: "/Lostheir.png",
    description:
      "Ethan Cole learns he is the illegitimate son of a late business tycoon...",
  },
  {
    img: "/Against.png",
    description:
      "A forbidden romance between the son of a pastor and the daughter of an imam...",
  },
  {
    img: "/Shattered.png",
    description:
      "No matter how hard Daniel fights to build a better life, fate seems determined to break him...",
  },
  {
    img: "/Lost.png",
    description:
      "On the distant planet of Xyphera, darkness reigns under the iron grip of a ruthless tyrant...",
  },
  {
    img: "/Shadow.png",
    description:
      "Amara, a strikingly beautiful but deeply misunderstood woman, must navigate a world...",
  },
];

const Page = () => {
  const [stories, setStories] = useState([]);
  const { data: session } = useSession();

  const handleFetch = async () => {
    try {
      const storiesRef = collection(db, "stories");
      const q = query(storiesRef, limit(3));
      const querySnapshot = await getDocs(q);
      const storyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(storyData)
      console.log(stories);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [stories]);

  return (
    <>
     <section className="min-h-dvh bg-[url('/bg.jpg')] bg-no-repeat bg-cover bg-center">
        <div className="min-h-dvh bg-black/70">
          <div className="flex flex-col lg:p-20 md:p-7 p-3 justify-between h-[80vh]">
            <h1 className="text-white font-bold lg:text-5xl md:text-3xl text-[1.2rem] uppercase max-md:text-center max-md:mt-">
              Where stories take flight
            </h1>
            <p className="text-white lg:text-2xl md:text-lg text-base max-md:text-center">
              Whether it's fiction, poetry, or real-life narratives, StoryNest
              provides a creative space for storytellers to showcase their work
              and for readers to immerse themselves in diverse tales from around
              the world. Writers can publish their stories, engage with a
              community of passionate readers, and receive feedback to refine
              their craft.
            </p>
            <div className="md:space-x-5 max-md:flex flex-col gap-5">
              <Link
                href={"#"}
                className="bg-blue-600 text-white md:py-3 md:px-10 p-2 text-lg hover:bg-blue-500 transition-all text-center"
              >
                Start Reading
              </Link>
              <Link
                href={session ? "/upload-story" : "/auth/signin"}
                className="bg-blue-600 text-white md:py-3 md:px-10 p-2 text-lg hover:bg-blue-500 transition-all text-center"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Recent Stories
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          Discover some of the most captivating stories handpicked for you.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 mt-6 gap-8 px-10">
          {stories.map((story, i) => (
            <div key={i} className="shadow-md rounded-md p-3 relative space-y-5">
              <h1 className="text-center text-2xl text-gray-800 font-bold my-2 mt-5">
                {story.title}
              </h1>
              <p className="text-sm text-center text-gray-500">by</p>
              <p className="text-base text-center text-gray-800 font-semibold">
                {story.author}
              </p>
              <p className="line-clamp-3 text-sm text-gray-500">{story.body}</p>
              <span className="absolute top-2 left-2 bg-green-500 text-white p-1 text-xs rounded-md">
                {story.genre}
              </span>
              <p className="text-sm text-gray-500">Posted on {story.timestamp}</p>
              <Link href={`/stories/${story.id}`} className="flex items-center max-md:justify-center gap-1 border px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all ml-auto max-md:w-full w-fit">
                Read more
                <MdKeyboardDoubleArrowRight className="text-lg" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Top Picks Section */}
      <section className="py-20 bg-gray-300 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 pb-2">
          Top Picks
        </h2>
        <p className="text-gray-600 mt-2 mb-6 font-semibold">
          Must-Read Stories of the Week!
        </p>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto pt-2">
          {topPicks.map((pick, index) => (
            <div key={index} className="shadow-lg group">
              <img
                src={pick.img}
                alt="Story Image"
                className="h-50 shadow-lg hover:opacity-60 transition-all max-md:w-full"
              />
              <p className="mt-2">{pick.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center mt-6 space-y-6 md:space-y-0 md:space-x-12 px-6">
          {["Create an account", "Explore stories", "Share your own"].map(
            (step, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                {step}
              </div>
            )
          )}
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Community Highlights
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          Check out some of the top contributors and their amazing stories.
        </p>
        <div className="grid md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto group">
          <div className="mb-2 text-sm font-semibold">
            <p className="group-hover:text-gray-400 transition-all">
              Top Writer
            </p>
            <img
              src="/Lostheir.png"
              alt=""
              className="mt-2 group-hover:bg-sky-600 shadow-lg
             hover:opacity-60 group-focus:opacity-100 hover:duration-300"
            />
          </div>
          <div className="text-sm font-semibold">
            <p className="group-hover:text-gray-400 transition-all">
              Top Writer
            </p>
            {/* className="p-6 bg-gray-100 rounded-lg shadow-lg" */}
            <img
              src="/Against.png"
              alt=""
              className="mt-2 group-hover:bg-sky-600 shadow-lg
              hover:opacity-60 group-focus:opacity-100 hover:duration-300"
            />
          </div>
          <div className="text-sm font-semibold">
            <p className="group-hover:text-gray-400 transition-all">
              Top Writer
            </p>
            <img
              src="/Shadow.png"
              alt=""
              className="mt-2 group-hover:bg-sky-600 shadow-lg
              hover:opacity-60 group-focus:opacity-100 hover:duration-300"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold">
          Join StoryNest Today!
        </h2>
        <p className="mt-2 mb-6">
          Sign up now to start reading, writing, and engaging with the
          community.
        </p>
        <Link
          href={session ? "/upload-story" : "/auth/signin"}
          className="bg-orange-500 text-white py-3 px-8 text-lg font-semibold rounded-md hover:bg-orange-400 transition-all shadow-lg"
        >
          Get Started
        </Link>
      </section>
    </>
  );
};

export default Page;
