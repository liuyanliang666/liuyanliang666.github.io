import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

// Required by `output: "export"` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

export default async function sitemap() {
  const today = new Date().toISOString().split("T")[0];

  // The site is a single page, so the only other URLs are the project pages.
  const projects = routesConfig["/work"]
    ? getPosts(["src", "app", "work", "projects"]).map((post) => ({
        url: `${baseURL}/work/${post.slug}`,
        lastModified: post.metadata.publishedAt,
      }))
    : [];

  return [{ url: baseURL, lastModified: today }, ...projects];
}
