import { cssBundleHref } from '@remix-run/css-bundle'
import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from '@remix-run/node'
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

export const meta: V2_MetaFunction = () => {
  const title = 'Thumbnailed'
  const description =
    'A Discord bot that allows creators to preview YouTube thumbnails.'
  const image = 'hero-image.png'
  return [
    { title: 'Thumbnailed' },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'twitter:image',
      content: image,
    },
    {
      property: 'og:url',
      content: 'https://thumbnailed.drewis.cool',
    },
    {
      property: 'twitter:url',
      content: 'https://thumbnailed.drewis.cool',
    },
  ]
}

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
