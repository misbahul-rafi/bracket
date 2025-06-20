'use client'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOnRoutes = ['/signin', '/signup'];
  const shouldHideHeader = hideOnRoutes.includes(pathname);

  return (
    <>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {!shouldHideHeader && <Navbar />}
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}
