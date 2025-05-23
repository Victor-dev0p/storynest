"use client";
import React, { useEffect, useState } from "react";
import {
  MdKeyboardDoubleArrowRight,
  MdNavigateBefore,
  MdNavigateNext,
  MdBookmark,
  MdSort,
  MdGridView,
  MdSearch,
} from "react-icons/md";
import { IoTrashBinSharp, IoHeart, IoHeartOutline } from "react-icons/io5";
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, deleteDoc as deleteFirestoreDoc } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";

const StoriesComponent = ({ session }) => {
  // State declarations
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "All");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [storiesPerPage, setStoriesPerPage] = useState(parseInt(searchParams.get("perPage")) || 6);
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "latest");

  // Format Firestore Timestamp to readable string
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

  // Update URL params in router
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

  // Fetch all stories
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

  // Delete a story by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    await deleteDoc(doc(db, "stories", id));
    fetchStories();
  };

  // Toggle like on Firestore
  const toggleLike = async (storyId) => {
    if (!session?.user?.id) {
      alert("Please sign in to like stories!");
      return;
    }
    const likeDocRef = doc(db, "stories", storyId, "likes", session.user.id);
    const isLiked = likes[storyId]?.liked;
    try {
      if (isLiked) {
        await deleteFirestoreDoc(likeDocRef);
      } else {
        await setDoc(likeDocRef, { likedAt: new Date() });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Toggle bookmark saved in Firestore
  const toggleBookmark = async (storyId) => {
    if (!session?.user?.id) {
      alert("Please sign in to bookmark stories!");
      return;
    }
    const bookmarkDocRef = doc(db, "stories", storyId, "bookmarks", session.user.id);
    const isBookmarked = bookmarks[storyId]?.bookmarked;
    try {
      if (isBookmarked) {
        await deleteFirestoreDoc(bookmarkDocRef);
      } else {
        await setDoc(bookmarkDocRef, { bookmarkedAt: new Date() });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Clear filters and reset states & URL params
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    setCurrentPage(1);
    setStoriesPerPage(6);
    setSortOption("latest");
    updateParams({ search: "", genre: "All", page: 1, perPage: 6, sort: "latest" });
  };

  // Initial fetch stories on mount
  useEffect(() => {
    fetchStories();
  }, []);

  // Listen to likes for all stories, and set state
  useEffect(() => {
    if (!session?.user?.id) return;

    const unsubscribes = stories.map((story) => {
      const likesCollectionRef = collection(db, "stories", story.id, "likes");
      return onSnapshot(likesCollectionRef, (snapshot) => {
        const likesCount = snapshot.size;
        const userLiked = snapshot.docs.some((doc) => doc.id === session.user.id);
        setLikes((prev) => ({
          ...prev,
          [story.id]: { count: likesCount, liked: userLiked },
        }));
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [stories, session?.user?.id]);

  // Listen to bookmarks for all stories
  useEffect(() => {
    if (!session?.user?.id) {
      setBookmarks({}); // clear bookmarks if not logged in
      return;
    }

    const unsubscribes = stories.map((story) => {
      const bookmarksCollectionRef = collection(db, "stories", story.id, "bookmarks");
      return onSnapshot(bookmarksCollectionRef, (snapshot) => {
        const userBookmarked = snapshot.docs.some((doc) => doc.id === session.user.id);
        setBookmarks((prev) => ({
          ...prev,
          [story.id]: { bookmarked: userBookmarked },
        }));
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [stories, session?.user?.id]);

  // Filter, search, and sort stories whenever dependencies change
  useEffect(() => {
    let filtered = [...stories];

    if (selectedGenre !== "All") {
      filtered = filtered.filter((story) => story.genre === selectedGenre);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const paginatedStories = filteredStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  const uniqueGenres = ["All", ...new Set(stories.map((story) => story.genre))];

  return (
    <main className="min-h-dvh py-6 px-8 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Discover Captivating Stories</h1>
        <p className="text-base text-gray-600 mt-2">
          Immerse yourself in compelling tales across genres.
        </p>
      </div>

      {/* Filters Container */}
      <section className="bg-white p-4 rounded-md shadow-md flex flex-wrap justify-center items-center gap-4 mb-8">
        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="genre" className="font-medium text-gray-700">Genre:</label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              updateParams({ genre: e.target.value, page: 1 });
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1 w-64">
          <MdSearch className="text-gray-500 text-xl" />
          <input
            type="search"
            placeholder="Search stories or authors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateParams({ search: e.target.value, page: 1 });
              setCurrentPage(1);
            }}
            className="w-full outline-none text-gray-700 placeholder:text-gray-400"
            aria-label="Search stories or authors"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="font-medium text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              updateParams({ sort: e.target.value, page: 1 });
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>

        {/* Stories per page */}
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="font-medium text-gray-700">Stories per page:</label>
          <select
            id="perPage"
            value={storiesPerPage}
            onChange={(e) => {
              setStoriesPerPage(parseInt(e.target.value));
              updateParams({ perPage: e.target.value, page: 1 });
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[3, 6, 9, 12].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Clear filters"
          title="Clear all filters"
        >
          Clear Filters
        </button>
      </section>

      {/* Stories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-600">Loading stories...</p>
        ) : paginatedStories.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No stories found.</p>
        ) : (
          paginatedStories.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-md shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  <Link href={`/stories/${story.id}`} className="hover:underline">
                    {story.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  By{" "}
                  <Link href={`/author/${encodeURIComponent(story.author)}`} className="text-blue-600 hover:underline">
                    {story.author}
                  </Link>
                </p>
                <p className="text-xs text-gray-500 mb-3">{formatTimestamp(story.timestamp)}</p>
                <p className="text-gray-700 line-clamp-4 mb-3">{story.body}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* Likes */}
                  <button
                    onClick={() => toggleLike(story.id)}
                    aria-label={likes[story.id]?.liked ? "Unlike story" : "Like story"}
                    title={likes[story.id]?.liked ? "Unlike story" : "Like story"}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                  >
                    {likes[story.id]?.liked ? (
                      <IoHeart className="text-red-500" />
                    ) : (
                      <IoHeartOutline />
                    )}
                    <span className="text-sm select-none">{likes[story.id]?.count || 0}</span>
                  </button>

                  {/* Bookmark */}
                  <button
                    onClick={() => toggleBookmark(story.id)}
                    aria-label={bookmarks[story.id]?.bookmarked ? "Remove bookmark" : "Bookmark story"}
                    title={bookmarks[story.id]?.bookmarked ? "Remove bookmark" : "Bookmark story"}
                    className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    <MdBookmark
                      className={bookmarks[story.id]?.bookmarked ? "text-blue-600" : ""}
                      size={22}
                    />
                  </button>
                </div>

                {/* Delete (if user owns the story) */}
                {session?.user?.id === story.authorId && (
                  <button
                    onClick={() => handleDelete(story.id)}
                    aria-label="Delete story"
                    title="Delete story"
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
                  >
                    <IoTrashBinSharp size={20} />
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center items-center gap-3 mt-8"
        >
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                updateParams({ page: currentPage - 1 });
              }
            }}
            disabled={currentPage === 1}
            className="p-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <MdNavigateBefore size={24} />
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  updateParams({ page: pageNum });
                }}
                className={`px-3 py-1 rounded focus:outline-none focus:ring-2 ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white focus:ring-blue-600"
                    : "bg-gray-200 hover:bg-gray-300 focus:ring-blue-400"
                }`}
                aria-current={pageNum === currentPage ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                updateParams({ page: currentPage + 1 });
              }
            }}
            disabled={currentPage === totalPages}
            className="p-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <MdNavigateNext size={24} />
          </button>
        </nav>
      )}
    </main>
  );
};

export default StoriesComponent;