"use server";
import { auth } from '@/auth';
import UploadStory from '@/components/UploadStory'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await auth()
  console.log(session);

  if (!session) {
    redirect("/auth/signin")
  }
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return (
    <main>
      <UploadStory session={session}/>
    </main>
  )
}

export default page
