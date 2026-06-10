"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "Assets", href: "/home/assets" },
    { name: "Bookings", href: "/home/bookings" },
  ]

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 border-r p-4 space-y-4">
        <h2 className="font-bold text-lg">Smart Assets</h2>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-2 rounded ${
                pathname === item.href
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}