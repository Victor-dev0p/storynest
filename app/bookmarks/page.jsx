// app/bookmarks/page.jsx
import { auth } from "@/auth"; // already exported from your auth.js
import { db } from "@/Lib/firebaseConfig";
import { redirect } from "next/navigation";
import { collection, getDocs, doc, getDoc, } from "firebase/firestore";
import Link from "next/link";

const BookmarksPage = async () => {
  const session = await auth(); // ✅ use auth() instead of getServerSession()

  if (!session) {
    redirect(`/auth/signin?redirect=/bookmarks`);
  }

  const userId = session.user.id;

  const bookmarksRef = collection(db, "users", userId, "bookmarks");
  const bookmarksSnap = await getDocs(bookmarksRef);
  const storyIds = bookmarksSnap.docs.map((doc) => doc.id);

  const stories = await Promise.all(
    storyIds.map(async (id) => {
      const storyRef = doc(db, "stories", id);
      const storySnap = await getDoc(storyRef);
      return storySnap.exists() ? { id: storySnap.id, ...storySnap.data() } : null;
    })
  );

  const bookmarks = stories.filter((story) => story !== null);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookmarked Stories</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((story) => (
            <li key={story.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{story.title}</h2>
              <p className="text-sm text-gray-600">
                {story.description || "No description"}
              </p>
              <Link href={`/story/${story.id}`}>
                <span className="text-blue-500 hover:underline mt-2 inline-block">
                  Read Story
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarksPage;