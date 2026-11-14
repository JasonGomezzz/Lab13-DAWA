import { withAuth } from "next-auth/middleware";

// Next.js 16 renombró "middleware" a "proxy": misma función, nuevo nombre de archivo.
export default withAuth({
  pages: { signIn: "/signIn" },
});

export const config = { matcher: ["/dashboard", "/profile"] };
