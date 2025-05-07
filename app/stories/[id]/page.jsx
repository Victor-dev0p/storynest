"use client";
import { useState, useEffect } from "react";
import { db } from "@/Lib/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
    <div className="h-10 bg-gray-300 rounded-md"></div>
    <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
    <div className="h-3 w-20 bg-gray-200 rounded-md"></div>
    <div className="h-48 bg-gray-200 rounded-md mt-6"></div>
    <div className="h-10 w-32 bg-gray-300 rounded-md mx-auto mt-10"></div>
  </div>
);

const getFormattedTimestamp = (timestamp) => {
  let date;
  if (timestamp?.seconds) {
    // Firestore Timestamp object
    date = new Date(timestamp.seconds * 1000);
  } else if (typeof timestamp === "string" || timestamp instanceof Date) {
    // ISO string or Date
    date = new Date(timestamp);
  } else {
    return "Unknown";
  }

  return !isNaN(date.getTime())
    ? formatDistanceToNow(date, { addSuffix: true })
    : "Unknown";
};

const StoryDetails = ({ params }) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodeList, setEpisodeList] = useState([]);

  useEffect(() => {
    const fetchStory = async () => {
      const storyRef = doc(db, "stories", params.id);
      const storySnap = await getDoc(storyRef);

      if (storySnap.exists()) {
        const data = { id: storySnap.id, ...storySnap.data() };
        setStory(data);

        if (data.storyId) {
          const q = query(
            collection(db, "stories"),
            where("storyId", "==", data.storyId)
          );
          const querySnap = await getDocs(q);
          const episodes = [];
          querySnap.forEach((doc) => {
            episodes.push({ id: doc.id, ...doc.data() });
          });

          // Sort episodes by episodeNumber
          episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
          setEpisodeList(episodes);
        }
      }

      setLoading(false);
    };
    fetchStory();
  }, [params.id]);

  const getNavigationLinks = () => {
    if (!story || episodeList.length === 0) return { prev: null, next: null };

    const currentIndex = episodeList.findIndex((ep) => ep.id === story.id);
    const prev = episodeList[currentIndex - 1];
    const next = episodeList[currentIndex + 1];
    return { prev, next };
  };

  const { prev, next } = getNavigationLinks();

  return (
    <main className="min-h-screen px-5 py-10 max-w-3xl mx-auto bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6">
        {loading ? (
          <Skeleton />
        ) : story ? (
          <>
            <span className="inline-block mb-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
              {story.genre}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
            <p className="text-sm text-gray-500 mb-1">By {story.author}</p>
            <p className="text-xs text-gray-400 mb-6">
              Posted {getFormattedTimestamp(story.timestamp)}
            </p>
            <p className="text-gray-700 leading-7 whitespace-pre-line">{story.body}</p>

            <div className="mt-10 flex justify-between items-center gap-4">
              {prev ? (
                <Link
                  href={`/stories/${prev.id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded-md"
                >
                  ← Previous Episode
                </Link>
              ) : (
                <span />
              )}

              {next ? (
                <Link
                  href={`/stories/${next.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-sm text-white px-4 py-2 rounded-md"
                >
                  Next Episode →
                </Link>
              ) : (
                <span />
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Back to Stories
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Story not found.</p>
        )}
      </div>
    </main>
  );
};

export default StoryDetails;