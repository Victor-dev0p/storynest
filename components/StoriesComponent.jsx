"use client";
import React, { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IoTrashBinSharp, IoBookmark, IoBookmarkOutline, IoHeart, IoHeartOutline } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, deleteDoc as deleteFirestoreDoc } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";

const StoriesComponent = ({ session }) => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "All");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [storiesPerPage, setStoriesPerPage] = useState(parseInt(searchParams.get("perPage")) || 6);
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "latest");

  const formatTimestamp = (timestamp) => {
    try {
      if (timestamp?.seconds) {
        const postDate = new Date(timestamp.seconds * 1000);
        return `Posted on ${format(postDate, "MMMM dd, yyyy 'at' h:mm a")}`;
      }
    } catch (error) {
      console.error("Invalid timestamp:", error);
    }
    return "Date unknown";
  };

  const updateParams = (params) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === "All" || value == null) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value);
      }
    });
    router.push(`${pathname}?${updatedParams.toString()}`);
  };

  const fetchStories = async () => {
    setLoading(true);
    try {
      const storyData = [];
      const querySnapshot = await getDocs(collection(db, "stories"));
      querySnapshot.forEach((doc) => {
        storyData.push({ id: doc.id, ...doc.data() });
      });
      setStories(storyData);
    } catch (error) {
      console.error("Error fetching stories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "stories", id));
    fetchStories();
  };

  const toggleLike = async (storyId) => {
    if (!session?.user?.id) {
      alert("Please sign in to like stories!");
      return;
    }

    const likeDocRef = doc(db, "stories", storyId, "likes", session.user.id);
    const isLiked = likes[storyId]?.liked;

    try {
      if (isLiked) {
        // Unlike
        await deleteFirestoreDoc(likeDocRef);
      } else {
        // Like
        await setDoc(likeDocRef, { likedAt: new Date() });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleSave = (id) => {
    const updated = { ...saved, [id]: !saved[id] };
    setSaved(updated);
    localStorage.setItem("savedStories", JSON.stringify(updated));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    setCurrentPage(1);
    setStoriesPerPage(6);
    setSortOption("latest");
    updateParams({ search: "", genre: "All", page: 1, perPage: 6, sort: "latest" });
  };

  useEffect(() => {
    fetchStories();
    setSaved(JSON.parse(localStorage.getItem("savedStories")) || {});
  }, []);

  useEffect(() => {
    const unsubscribeLikes = [];

    stories.forEach((story) => {
      const likesCollectionRef = collection(db, "stories", story.id, "likes");
      const unsubscribe = onSnapshot(likesCollectionRef, (snapshot) => {
        const likesCount = snapshot.size;
        const userLiked = snapshot.docs.some((doc) => doc.id === session?.user?.id);

        setLikes((prev) => ({
          ...prev,
          [story.id]: { count: likesCount, liked: userLiked },
        }));
      });
      unsubscribeLikes.push(unsubscribe);
    });

    return () => {
      unsubscribeLikes.forEach((unsub) => unsub());
    };
  }, [stories, session?.user?.id]);

  useEffect(() => {
    let filtered = [...stories];

    if (selectedGenre !== "All") {
      filtered = filtered.filter((story) => story.genre === selectedGenre);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    if (sortOption === "latest") {
      filtered.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
    } else if (sortOption === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "title-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredStories(filtered);
  }, [stories, selectedGenre, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const paginatedStories = filteredStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  const uniqueGenres = ["Select genre", ...new Set(stories.map((story) => story.genre))];

  return (
    <main className="min-h-dvh py-6 px-8">
      {/* Top Header and Filters */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Discover Captivating Stories</h1>
        <p className="text-base text-gray-600 mt-2">Immerse yourself in compelling tales across genres.</p>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
          {/* Genre Dropdown */}
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
              updateParams({ genre: e.target.value, page: 1 });
            }}
            className="px-4 py-2 border rounded-md bg-white shadow-sm"
          >
            {uniqueGenres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              updateParams({ search: e.target.value, page: 1 });
            }}
            placeholder="Search by title or author"
            className="px-4 py-2 border rounded-md shadow-sm w-64"
          />

          {/* Stories per Page */}
          <select
            value={storiesPerPage}
            onChange={(e) => {
              setStoriesPerPage(parseInt(e.target.value));
              setCurrentPage(1);
              updateParams({ perPage: e.target.value, page: 1 });
            }}
            className="px-4 py-2 border rounded-md bg-white shadow-sm"
          >
            {[6, 9, 12, 15].map((num) => (
              <option key={num} value={num}>
                {num} per page
              </option>
            ))}
          </select>

          {/* Sort Option */}
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
              updateParams({ sort: e.target.value, page: 1 });
            }}
            className="px-4 py-2 border rounded-md bg-white shadow-sm"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Story Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 mt-6 gap-8">
            {paginatedStories.map((story) => (
              <div
                key={story.id}
                className="shadow-md rounded-md p-3 relative space-y-4 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <h1 className="text-xl font-bold text-gray-800 text-center">{story.title}</h1>
                <p className="text-sm text-center text-gray-500">by {story.author}</p>
                <p className="line-clamp-3 text-sm text-gray-600">{story.body}</p>

                {/* Genre Tag */}
                <span className="absolute top-2 left-2 bg-green-500 text-white p-1 text-xs rounded-md">
                  {story.genre}
                </span>

                {/* Delete Button */}
                {session?.user?.id === story.userId && (
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1 rounded-md text-xs"
                  >
                    <IoTrashBinSharp />
                  </button>
                )}

                {/* Bottom Info */}
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <LuClock3 className="text-blue-500" /> {formatTimestamp(story.timestamp)}
                  </span>

                  <div className="flex gap-3 items-center text-lg">
                    <button onClick={() => toggleLike(story.id)} className="flex items-center gap-1">
                      {likes[story.id]?.liked ? <IoHeart className="text-red-600" /> : <IoHeartOutline />}
                      <span className="text-xs">{likes[story.id]?.count || 0}</span>
                    </button>
                    <button onClick={() => toggleSave(story.id)}>
                      {saved[story.id] ? <IoBookmark className="text-blue-600" /> : <IoBookmarkOutline />}
                    </button>
                  </div>
                </div>

                {/* Read More Link */}
                <Link
                  href={`/stories/${story.id}`}
                  className="flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full mt-2 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Read More <MdKeyboardDoubleArrowRight />
                </Link>
              </div>
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 text-gray-700">
              <button
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  updateParams({ page: newPage });
                }}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                <MdNavigateBefore />
              </button>

              <span>Page {currentPage} of {totalPages}</span>

              <button
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  setCurrentPage(newPage);
                  updateParams({ page: newPage });
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                <MdNavigateNext />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default StoriesComponent;