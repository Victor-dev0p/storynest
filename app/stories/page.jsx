"use server"
import { auth } from '@/auth'
import StoriesComponent from '@/components/StoriesComponent'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }
  return (
    <div>
      <StoriesComponent session={session}/>
    </div>
  )
}

export default page
