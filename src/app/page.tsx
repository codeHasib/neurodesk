import Link from "next/link";

export default async function Home() {
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/user`);
  const data = await res.json();
  console.log(data[0]);
  return (
    <div>
      <Link href={"/auth/signup"}>SIGN UP</Link>
      <Link href={"/auth/signin"}>SIGN IN</Link>
    </div>
  );
}
