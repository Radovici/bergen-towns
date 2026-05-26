import Link from "next/link";

export default function SponsorPreviewBanner({ token }: { token: string }) {
  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
      You are previewing your sponsor content.{" "}
      <Link
        href={`/sponsor/manage?token=${token}`}
        className="underline font-semibold"
      >
        Back to Dashboard
      </Link>
      {" "}to edit or approve.
    </div>
  );
}
