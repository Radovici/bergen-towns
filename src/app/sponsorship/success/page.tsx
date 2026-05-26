import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You — Sponsorship Confirmed",
};

export default async function SuccessPage() {
  const { meta } = await getTownData();
  return (
    <article className="max-w-lg mx-auto text-center py-12">
      <div className="text-5xl mb-6">&#10003;</div>
      <h1 className="text-3xl font-bold text-primary">
        Welcome, Sponsor!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Thank you for sponsoring {meta.name}. Your subscription is now active.
        We&apos;ll be in touch shortly to set up your listing.
      </p>
      <div className="mt-8 space-y-3">
        <Link
          href="/sponsorship"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium no-underline hover:opacity-90 transition-opacity"
        >
          Back to Sponsorship
        </Link>
        <p className="text-sm text-gray-400">
          Questions? Email{" "}
          <a
            href={`mailto:${meta.slug}@radovici.com`}
            className="text-primary underline"
          >
            {meta.slug}@radovici.com
          </a>
        </p>
      </div>
    </article>
  );
}
