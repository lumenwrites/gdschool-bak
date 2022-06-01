# GDQuest Learning Platform

- [Prototype deployed on Vercel](https://gdschool.vercel.app/)
- [Figma Designs](https://www.figma.com/file/haA0u7nyXLwSWTLRLJzDNv/GDSchool)
- [Roadmap](https://coda.io/d/_dlfrTqoWiuw/Roadmap_suh6W)

# Authentication
- [Using Supabase with Next and Stripe | egghead.io](https://egghead.io/lessons/supabase-query-data-from-supabase-using-next-js)
- [Supabase Auth Helpers](https://github.com/supabase-community/supabase-auth-helpers/blob/main/src/nextjs/README.md)

Auth helpers simplify using Supabase with Next SSR and routes. They:
- Auomatically set a cookie when the user logs in, and access this cookie in api routes and `getServerSideProps`, which is required for being able to use Supabase on server side with Next.js.
- `withPageAuth` wrapper around `getServerSideProps` helps you fetch the logged in user (with `getUser`) and run supabase queries on server side (with `supabaseServerClient`).
- `withApiAuth` wrapper around api handlers does the same for API routes.

AuthContext fetches additional user data I have defined in my own `profile` table.
