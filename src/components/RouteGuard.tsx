"use client";

import { usePathname } from "next/navigation";
import { routes } from "@/resources";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

function isRouteEnabled(pathname: string): boolean {
  if (!pathname) return false;

  // `trailingSlash: true` makes the pathname "/work/", but the route keys have
  // no trailing slash. Normalize before looking anything up.
  const path = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;

  if (path in routes) {
    return routes[path as keyof typeof routes];
  }

  const dynamicRoutes = ["/blog", "/work"] as const;
  for (const route of dynamicRoutes) {
    if (path.startsWith(`${route}/`) && routes[route]) {
      return true;
    }
  }

  return false;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname() ?? "";

  // Decided during render rather than in an effect, so the prerendered HTML
  // carries the real content instead of a loading spinner.
  if (!isRouteEnabled(pathname)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
