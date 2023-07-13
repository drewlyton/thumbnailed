import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import { getUser } from '~/session.server'
import stylesheet from '~/tailwind.css'

export const metaTags = ({
  title = 'Thumbnailed',
  description = 'A Discord bot that allows creators to preview YouTube thumbnails.',
  coverImage = 'hero-image.png',
}) => {
  return {
    title,
    description,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': coverImage,
    'twitter:url': `https://thumbnailed.drewis.cool`,
    'twitter:creator': '@drewlyton',
    'twitter:site': '@drewlyton',
    'twitter:card': 'summary_large_image',
    'og:type': 'article',
    'og:title': title,
    'og:description': description,
    'og:image': coverImage,
    'og:url': `https://thumbnailed.drewis.cool`,
  }
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
  ...metaTags({}),
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) })
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="relative flex h-full min-h-screen w-full flex-col bg-gray-800 text-white">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
