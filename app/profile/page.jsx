"use server";
import { auth } from "@/auth";
import UpdateProfile from "@/components/UpdateProfile";
import { redirect } from "next/navigation";

async function ProfilePage() {
  const session = await auth();
  // console.log(session);
  const uid = session?.user?.id;
  // console.log(uid);
  const currentName = session?.user?.name;
  // console.log(currentName);
  if (!session) {
    redirect("/auth/signin"); // Redirect if not authenticated
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center">
      <div className="w-full max-w-4xl p-4">
        {/* Profile Cover */}
        <div className="relative bg-blue-400 h-40 rounded-lg shadow-md">
          <div className="absolute -bottom-10 left-4 flex items-center space-x-4">
            {/* Profile Image */}
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            {/* User Name & Email (conditionally displayed) */}
            <div>
              <h2 className="text-xl font-bold text-white">
                {session?.user?.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{session?.user?.name || "N/A"}</p>
            </div>
            {session?.user?.email && (
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">
                  {session?.user?.email ? session.user.email : "Not available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {uid && <UpdateProfile uid={uid} currentName={currentName} />}
    </div>
  );
}

export default ProfilePage;