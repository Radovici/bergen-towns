import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import Stripe from "stripe";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You — Sponsorship Confirmed",
};

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { meta } = await getTownData();
  const params = await searchParams;
  const sessionId = params.session_id;

  let manageToken: string | null = null;
  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      manageToken = session.metadata?.management_token || null;
    } catch {
      // session may have expired
    }
  }

  return (
    <article className="max-w-lg mx-auto text-center py-12">
      <div className="text-5xl mb-6">&#10003;</div>
      <h1 className="text-3xl font-bold text-primary">Welcome, Sponsor!</h1>
      <p className="mt-4 text-lg text-gray-600">
        Thank you for sponsoring {meta.name}. Your subscription is now active.
      </p>

      {manageToken && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-left">
          <h2 className="font-semibold text-blue-900 mb-2">
            Your Sponsor Dashboard
          </h2>
          <p className="text-sm text-blue-700 mb-4">
            Use this link to manage your listing — update your business info,
            upload logos, and use our AI assistant to craft your profile.
            Bookmark it!
          </p>
          <Link
            href={`/sponsor/manage?token=${manageToken}`}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium no-underline hover:opacity-90 transition-opacity"
          >
            Open Sponsor Dashboard &rarr;
          </Link>
          <p className="text-xs text-blue-500 mt-3">
            This is your private management link. Don&apos;t share it publicly.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <Link
          href="/sponsorship"
          className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium no-underline hover:bg-gray-200 transition-colors"
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
