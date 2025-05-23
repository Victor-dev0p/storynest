"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/Lib/firebaseConfig";
import { BiLoaderCircle } from "react-icons/bi";
import { FaRegCheckCircle } from "react-icons/fa";

const valSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string()
    .required("Please tell your story")
    .min(10, "Minimum of 10 characters"),
  genre: Yup.string().required("Please select a genre"),
  storyId: Yup.string().optional(), // optional field to group episodes
  episodeNumber: Yup.number()
    .positive("Must be positive")
    .integer("Must be an integer")
    .optional(),
});

const UploadStory = ({ session }) => {
  const [processing, setProcessing] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);

  const userId = session?.user?.id;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setProcessing(true);

      const storyDoc = {
        title: values.title,
        body: values.body,
        genre: values.genre,
        author: session?.user?.name,
        timestamp: new Date().toLocaleDateString(),
        userId,
        likes: 0,
        storyId: values.storyId || null,
        episodeNumber: values.episodeNumber || null,
      };

      const storyRef = await addDoc(collection(db, "stories"), storyDoc);
      console.log("Story uploaded with ID:", storyRef.id);
      resetForm();
      setModalVisibility(true);
    } catch (error) {
      console.error("Error uploading story", error);
      alert("Error uploading story. Try again!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Upload Your Story
        </h2>
        <Formik
          initialValues={{
            title: "",
            body: "",
            genre: "",
            storyId: "",
            episodeNumber: "",
          }}
          validationSchema={valSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <Field
                name="title"
                type="text"
                placeholder="Title..."
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="title"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <Field
                name="body"
                as="textarea"
                rows="5"
                placeholder="Tell your story..."
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="body"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <Field
                name="genre"
                as="select"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a genre
                </option>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="romance">Romance</option>
                <option value="scifi">Sci-Fi</option>
                <option value="horror">Horror</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
              </Field>
              <ErrorMessage
                name="genre"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <Field
                name="storyId"
                type="text"
                placeholder="Optional: Story ID (e.g. against-all-odds)"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <ErrorMessage
                name="storyId"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <Field
                name="episodeNumber"
                type="number"
                placeholder="Optional: Episode number (e.g. 1)"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <ErrorMessage
                name="episodeNumber"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <button
              disabled={processing}
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              {processing ? (
                <span className="w-full flex items-center justify-center">
                  <BiLoaderCircle className="animate-spin text-2xl" />
                </span>
              ) : (
                "Upload Story"
              )}
            </button>
          </Form>
        </Formik>
      </div>

      <div
        className={`absolute h-screen w-full bg-black/20 p-2 items-center justify-center ${
          modalVisibility ? "flex" : "hidden"
        }`}
      >
        <div className="md:w-[20rem] w-full h-[30vh] flex flex-col gap-5 items-center justify-center shadow-lg rounded-lg bg-white p-3">
          <h1 className="text-black md:text-2xl text-lg">
            Story Upload Successful
          </h1>
          <FaRegCheckCircle className="text-6xl text-green-500" />
          <button onClick={() => setModalVisibility(false)}>Close</button>
        </div>
      </div>
    </main>
  );
};

export default UploadStory;