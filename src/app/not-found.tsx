import Link from "next/link";
import Fog from "@/components/fx/Fog";
import SplitText from "@/components/fx/SplitText";
import Magnetic from "@/components/fx/Magnetic";

export default function NotFound() {
  return (
    <div className="relative bleed-header flex min-h-[80svh] flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-70">
        <Fog />
      </div>
      <div className="mx-auto w-full max-w-page px-5 sm:px-8">
        <SplitText as="h1" text="This place doesn’t exist." className="display block text-[44px] sm:text-[72px]" />
        <p className="mt-6 max-w-[46ch] text-[18px] text-faded" data-reveal style={{ ["--d" as string]: "300ms" }}>
          You can&rsquo;t reach that. The page you were after has moved or never was.
        </p>
        <div className="mt-10" data-reveal style={{ ["--d" as string]: "450ms" }}>
          <Magnetic>
            <Link href="/" className="btn-ghost">
              Back to the shop
            </Link>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
