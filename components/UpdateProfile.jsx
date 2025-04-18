"use client";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";

const UpdateProfile = ({ uid, currentName }) => {
  console.log(uid, currentName);

  const [name, setName] = useState(currentName || "");

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("name cannot be empty")
    }

    try {
      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, {name})
      alert("Name Updated Sucessfully")
    } catch (error) {
      console.error("Error updating profile", error)
      alert("An eror occurred. Please try again later.")
    }
  };

  return (
    <main className="md:px-10 p-3">
      <form onSubmit={handleSubmit} className="mt-6">
        <input
          type="text"
          className="w-full p-2 rounded-md border border-gray-200 outline-none"
          placeholder="Update your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md">
          Update
        </button>
      </form>
    </main>
  );
};

export default UpdateProfile;
