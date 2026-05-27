"use client";

export default function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="text-sm text-gray-400 hover:text-gray-600 underline"
      >
        Sign out
      </button>
    </form>
  );
}
