"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { visibleNavItems } from "./nav-items";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/auth";

export function TopNav() {
  const { user } = useUser();
  const pathname = usePathname();
  const role = (user?.role as UserRole) ?? "lender";
  const items = visibleNavItems(role);

  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center px-6">
        <Link href="/dashboard" className="mr-8 text-lg font-bold">
          BlockBima
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">{user?.name}</DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-muted-foreground">{user?.email}</DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/auth/logout">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
