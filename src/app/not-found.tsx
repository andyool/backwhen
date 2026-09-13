import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-page px-5 pt-6 sm:px-8">
      <h1 className="display text-[44px] sm:text-[60px]">This place doesn&rsquo;t exist.</h1>
      <p className="mt-6 max-w-[46ch] text-[18px] text-faded">Which is on brand, but not helpful. The page you were after has moved or never was.</p>
      <Link href="/" className="btn-ghost mt-10">
        Back to the shop
      </Link>
    </div>
  );
}
