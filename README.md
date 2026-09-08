# liuyanliang666.github.io

Personal portfolio for Yanliang Liu — open-source projects and research,
built with [Next.js](https://nextjs.org) and [Once UI](https://once-ui.com),
deployed as a static site on GitHub Pages.

## Getting started

```bash
pnpm install
pnpm dev
```

## Editing content

- Site config (theme, routes, fonts): [`src/resources/once-ui.config.ts`](src/resources/once-ui.config.ts)
- Page content (about, publications, education, social links): [`src/resources/content.tsx`](src/resources/content.tsx)
- Projects: add an `.mdx` file to `src/app/work/projects`

## Deployment

Pushing to `main` builds a static export (`next build`) and publishes it to
GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## License

Distributed under the CC BY-NC 4.0 License — see [`LICENSE`](LICENSE).
