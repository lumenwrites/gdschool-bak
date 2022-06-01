import Login from 'components/Users/Login'

export default function Home({ lessons }) {
  return (
    <div>
      <h1>Hello</h1>
      <Login />
    </div>
  )
}

import prisma from 'prisma/prismaClient'

export async function getServerSideProps() {
  const profiles = await prisma.profile.findMany()
  console.log(profiles)
  return { props: { } }
}
