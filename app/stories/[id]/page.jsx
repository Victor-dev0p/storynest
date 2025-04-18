import { db } from "@/Lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { RiLoader2Fill } from "react-icons/ri";


const handleSingleFetch = async (id)=>{
  if(!id) return null;

  try {
    // create a document reference
    const storyRef = doc(db, "stories", id)
    const storyDoc = await getDoc(storyRef)

    if (storyDoc.exists()) {
      return {id, ...storyDoc.data()}
      // console.log("Document data:", storyDoc.data());
    } else {
      // storyDoc.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (err) {
    console.error("Error fetching story", err)
    alert("fetch failed, please try again")
  }
}

const StoryDetails = async ({params}) => {
  const story = await handleSingleFetch(params.id)
  if (!story) return <div className="flex items-center justify-center h-dvh">
    <RiLoader2Fill className="text-4xl animate-spin"/>
  </div>

  return (
    <main className="min-h-screen px-5 py-10 max-w-3xl mx-auto bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6">
        <span className="inline-block mb-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
          {story.genre}
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
        <p className="text-sm text-gray-500 mb-1">By {story.author}</p>
        <p className="text-xs text-gray-400 mb-6">Posted on {story.timestamp}</p>
        <p className="text-gray-700 leading-7 whitespace-pre-line">{story.body}</p>
      </div>
    </main>
  );
};

export default StoryDetails;