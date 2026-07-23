import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You don't have permission to access this page.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
