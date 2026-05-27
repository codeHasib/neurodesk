import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  if (token) {
    // Use this token for authenticated requests to external services
    const res = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/test-protected`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    console.log(data);
  }
  return (
    <div>
      <Link href={"/auth/signup"}>SIGN UP</Link>
      <Link href={"/auth/signin"}>SIGN IN</Link>
    </div>
  );
}
