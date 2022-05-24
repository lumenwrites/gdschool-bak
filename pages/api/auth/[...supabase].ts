import { handleAuth } from '@supabase/supabase-auth-helpers/nextjs';

// https://github.com/supabase-community/supabase-auth-helpers/blob/main/src/nextjs/README.md
// -   `/api/auth/callback`: The `UserProvider` forwards the session details here every time `onAuthStateChange` fires on the client side. This is needed to set up the cookies for your application so that SSR works seamlessly.
// -   `/api/auth/user`: You can fetch user profile information in JSON format.
// -   `/api/auth/logout`: Your Next.js application logs out the user. You can optionally pass a `returnTo` parameter to return to a custom relative URL after logout, eg `/api/auth/logout?returnTo=/login`. This will overwrite the logout `returnTo` option specified `handleAuth()`
export default handleAuth({ logout: { returnTo: '/' } });
