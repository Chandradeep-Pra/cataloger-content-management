import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Category Hub',
  description: 'Manage your Categories',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased ` }>
        <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
          {/* <header className="flex justify-end items-center ">
            
            <SignedIn>
              <div className='flex items-center space-x-8'>
              <ThemeToggle />
              <UserButton />
              </div>
           
            </SignedIn>
          </header> */}
          {children}
          <Toaster />
    </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}