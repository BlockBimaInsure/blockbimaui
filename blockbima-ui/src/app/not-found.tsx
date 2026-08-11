import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
