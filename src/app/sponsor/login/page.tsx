import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSponsorByEmail } from "@/lib/sponsor-storage";
import GoogleSignIn from "./google-sign-in";

export const metadata: Metadata = {
  title: "Sponsor Sign In",
  robots: "noindex, nofollow",
};

export default async function SponsorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; token?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const profile = await getSponsorByEmail(user.email);
    if (profile) {
      redirect(`/sponsor/manage?token=${profile.managementToken}`);
    }
  }

  return (
    <article className="max-w-md mx-auto text-center py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Sponsor Sign In
      </h1>
      <p className="text-gray-500 mb-8">
        Sign in with the Google account you used during checkout to access your
        sponsor dashboard.
      </p>

      {params.error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {params.error === "no_sponsor"
            ? "No sponsorship found for this email. Make sure you sign in with the same email you used at checkout."
            : params.error === "auth_failed"
              ? "Authentication failed. Please try again."
              : "Something went wrong. Please try again."}
        </div>
      )}

      {user?.email && !params.error && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          No sponsorship found for <strong>{user.email}</strong>. If you just
          completed checkout, it may take a moment to activate.
        </div>
      )}

      <GoogleSignIn />

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-400 mb-3">Have a management link?</p>
        <a
          href="/sponsor/manage"
          className="text-sm text-primary underline hover:opacity-80"
        >
          Use token link instead
        </a>
      </div>
    </article>
  );
}
