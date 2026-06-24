'use client'

import { Toaster } from 'react-hot-toast'

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--color-card))',
          color: 'hsl(var(--color-card-foreground))',
          border: '1px solid hsl(var(--color-border))',
        },
      }}
    />
  )
}
