import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type * as React from 'react';

import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import { Toaster } from '~/components/ui/sonner';
import { appUrl } from '~/env';
import type { Context } from '~/router-context';
import { seo } from '~/utils/seo';
import { WrapComponent } from '~/WrapComponent';

import jotaiDevtoolStyle from 'jotai-devtools/styles.css?url';
import appCss from '~/styles/app.css?url';

export const Route = createRootRouteWithContext<Context>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'RWD Demo',
        description: 'A demo for the RWD preview feature',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: jotaiDevtoolStyle },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: appUrl('/apple-touch-icon.png'),
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: appUrl('/favicon-32x32.png'),
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: appUrl('/favicon-16x16.png'),
      },
      { rel: 'manifest', href: appUrl('/site.webmanifest'), color: '#fffff' },
      { rel: 'icon', href: appUrl('/favicon.ico') },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

const EmptyComponent = () => null;

EmptyComponent.displayName = 'EmptyComponent';

function RootComponent() {
  const ctx = Route.useRouteContext();

  return (
    <RootDocument>
      <WrapComponent context={ctx}>
        <Outlet />
      </WrapComponent>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // biome-ignore lint/a11y/useHtmlLang: <explanation>
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
