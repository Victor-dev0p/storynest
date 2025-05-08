"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, Timestamp, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";
import Link from "next/link";

export default function StoryDetailsPage() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("id");
  const [story, setStory] = useState(null);
  const [nextEpisode, setNextEpisode] = useState(null);
  const [prevEpisode, setPrevEpisode] = useState(null);

  useEffect(() => {
    if (!storyId) return;

    const fetchStory = async () => {
      const docRef = doc(db, "stories", storyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Fix the timestamp if it's a string
        if (typeof data.timestamp === "string") {
          const convertedTimestamp = Timestamp.fromDate(new Date(data.timestamp));
          await updateDoc(docRef, { timestamp: convertedTimestamp });
          data.timestamp = convertedTimestamp;
          console.log("Fixed timestamp in Firestore");
        }

        setStory(data);
        fetchAdjacentEpisodes(data.storyId, data.episodeNumber);
      }
    };

    const fetchAdjacentEpisodes = async (storyTitle, currentEpisode) => {
      const q = query(collection(db, "stories"), where("storyId", "==", storyTitle));
      const querySnapshot = await getDocs(q);

      const episodes = [];
      querySnapshot.forEach((doc) => {
        episodes.push({ id: doc.id, ...doc.data() });
      });

      const sortedEpisodes = episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);

      const currentIndex = sortedEpisodes.findIndex((ep) => ep.episodeNumber === currentEpisode);
      setPrevEpisode(sortedEpisodes[currentIndex - 1] || null);
      setNextEpisode(sortedEpisodes[currentIndex + 1] || null);
    };

    fetchStory();
  }, [storyId]);

  if (!story) {
    return <p className="text-center mt-10">Loading story...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
      <p className="text-gray-600 mb-4">By {story.author} • Episode {story.episodeNumber}</p>
      <div className="prose max-w-none whitespace-pre-wrap leading-relaxed">{story.body}</div>

      <div className="flex justify-between mt-10">
        {prevEpisode && (
          <Link
            href={`/story-details?id=${prevEpisode.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Previous Episode
          </Link>
        )}
        {nextEpisode && (
          <Link
            href={`/story-details?id=${nextEpisode.id}`}
            className="text-blue-600 hover:underline ml-auto"
          >
            Next Episode →
          </Link>
        )}
      </div>
    </div>
  );
}