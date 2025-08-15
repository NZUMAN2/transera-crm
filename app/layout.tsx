// 3. Update app/layout.tsx to wrap with AuthProvider
import { AuthProvider } from '@/lib/auth/auth-context'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}