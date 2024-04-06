import { Html, Head, Main, NextScript } from 'next/document'
import { cn } from '@faris/utils/tailwindHelper'

export default function Document() {

  return (
    <Html>
      <Head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
      )}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
