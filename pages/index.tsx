import Login from 'components/Users/Login'

export default function Home({ lessons }) {
  return (
    <div>
      <h1>Hello!</h1>
      <Login />
    </div>
  )
}

import prisma from 'prisma/prismaClient'
import courses from 'backend/json/courses/courses.json'

export async function getServerSideProps() {
  const profiles = await prisma.profile.findMany()
  // console.log("Fetching profile info", profiles)
  console.log("Generated courses", courses);
  return { props: { } }
}
