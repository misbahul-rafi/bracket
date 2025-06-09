'use client'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar';
import { useEffect, useState } from 'react';

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOnRoutes = ['/signin', '/signup'];
  const shouldHideHeader = hideOnRoutes.includes(pathname);
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  useEffect(() => {
    setPreviousPath(pathname)
  }, [pathname])

  return (
    <>
      <SessionProvider>
        {!shouldHideHeader && <Navbar />}
        {children}
      </SessionProvider>
    </>
  )
}
