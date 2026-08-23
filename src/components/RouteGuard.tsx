"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/resources";
import { Flex, Spinner } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRouteEnabled = () => {
      if (!pathname) return false;

      // `trailingSlash: true` makes the pathname "/about/", but the route keys
      // have no trailing slash. Normalize before looking anything up.
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
    };

    setIsRouteEnabled(checkRouteEnabled());
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
