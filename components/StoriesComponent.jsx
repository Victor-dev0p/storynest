"use client";
import React, { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";
import Link from "next/link";
import { IoTrashBinSharp } from "react-icons/io5";

const StoriesComponent = ({ session }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    setLoading(true); // Start loading
    try {
      const storyData = [];
      const querySnapshot = await getDocs(collection(db, "stories"));
      querySnapshot.forEach((doc) => {
        const story = { id: doc.id, ...doc.data() };
        storyData.push(story);
      });
      setStories(storyData);
      console.log(stories);
    } catch (error) {
      console.error("Error fetching stories", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchStories();
  }, []); // Only run on mount

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "stories", id));
    // setStories((prev) => prev.filter((story) => story.id !== id));
    fetchStories();
  };

  return (
    <main className="min-h-dvh py-3 px-8">
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Discover Captivating Stories
        </h1>
        <p className="text-base text-gray-600 text-center mt-3">
          Immerse yourself in compelling tales across different genres.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 mt-6 gap-8">
          {stories.map((story, i) => (
            <div
              key={i}
              className="shadow-md rounded-md p-3 relative space-y-5"
            >
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
              {session?.user?.id == story.userId && (
                <button
                  onClick={() => handleDelete(story.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 text-xs rounded-md w-fit"
                >
                  <IoTrashBinSharp />
                </button>
              )}
              <p className="text-sm text-gray-500">
                Posted on {story.timestamp}
              </p>
              <Link
                href={`/stories/${story.id}`}
                className="flex items-center max-md:justify-center gap-1 border px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all ml-auto max-md:w-full w-fit"
              >
                Read more
                <MdKeyboardDoubleArrowRight className="text-lg" />
              </Link>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default StoriesComponent;
