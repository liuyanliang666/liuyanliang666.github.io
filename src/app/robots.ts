import { baseURL } from "@/resources";

// Required by `output: "export"` — emit a static robots.txt at build time.
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
