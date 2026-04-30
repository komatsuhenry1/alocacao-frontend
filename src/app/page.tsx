"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter()

  return (
    <>
    <h2>Hello world!</h2>
    <h1>Main Page</h1>
    <button onClick={() => router.push('/login')}> Login </button>
    </>
  );
}