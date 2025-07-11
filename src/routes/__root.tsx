import * as React from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import appCss from '@/styles/app.css?url'
import { Container } from '@/components/atoms/container'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'LincType',
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Container width="narrow">
        <Outlet />
      </Container>
      <TanStackRouterDevtools />
    </RootDocument>
  )
}

function NotFound() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">404 - Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link 
        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200" 
        to="/"
      >
        Go to Home
      </Link>
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
