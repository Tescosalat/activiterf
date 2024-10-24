import { Roboto, Bebas_Neue } from "next/font/google"
import "./globals.css"
import "./styles/index.css"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--roboto-font",
})
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--bebas-font",
})

export const metadata = {
  title: "Activiter",
  description: "Generated by create next app",
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico', 
    shortcut: '/favicon.ico', 
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${bebas.variable}`}>{children}</body>
    </html>
  )
}
