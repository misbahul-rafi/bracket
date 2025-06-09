'use client'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar';

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOnRoutes = ['/signin', '/signup'];
  const shouldHideHeader = hideOnRoutes.includes(pathname);

  return (
    <>
      <SessionProvider>
        {!shouldHideHeader && <Navbar />}
        {children}
      </SessionProvider>
    </>
  )
}
