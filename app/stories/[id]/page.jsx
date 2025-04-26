"use client";
import { db } from "@/Lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { RiLoader2Fill } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";

const handleSingleFetch = async (id) => {
  if (!id) return null;

  try {
    const storyRef = doc(db, "stories", id);
    const storyDoc = await getDoc(storyRef);

    if (storyDoc.exists()) {
      return { id, ...storyDoc.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error("Error fetching story", err);
    alert("Fetch failed, please try again.");
    return null;
  }
};

// 🔥 Handles all possible timestamp types
const getFormattedTimestamp = (timestamp) => {
  let date;

  if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (typeof timestamp === "string" || timestamp instanceof Date) {
    date = new Date(timestamp);
  }

  if (date && !isNaN(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return "Unknown";
};

const StoryDetails = async ({ params }) => {
  const story = await handleSingleFetch(params.id);

  if (!story) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <RiLoader2Fill className="text-4xl animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-5 py-10 max-w-3xl mx-auto bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6">
        <span className="inline-block mb-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
          {story.genre}
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
        <p className="text-sm text-gray-500 mb-1">By {story.author}</p>
        <p className="text-xs text-gray-400 mb-6">
          Posted {getFormattedTimestamp(story.timestamp)}
        </p>
        <p className="text-gray-700 leading-7 whitespace-pre-line">{story.body}</p>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Back to Stories
          </button>
        </div>
      </div>
    </main>
  );
};

export default StoryDetails;