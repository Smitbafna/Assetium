import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Smart Asset Management Platform
      </h1>

      <p className="text-muted-foreground">
        Manage assets, bookings and approvals efficiently
      </p>

      <div className="flex gap-4">
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>

        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  )
}