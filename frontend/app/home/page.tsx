"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    activeBookings: 0,
    pendingRequests: 0,
    overdueReturns: 0,
  })

  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        const assetRes = await fetch(
          "http://localhost:3001/api/assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (assetRes.ok) {
          const assetData = await assetRes.json()

          if (Array.isArray(assetData)) {
            setAssets(assetData)

            setStats((prev) => ({
              ...prev,
              totalAssets: assetData.length,
              availableAssets: assetData.filter(
                (a) => a.availableQuantity > 0
              ).length,
            }))
          }
        }

        const bookingRes = await fetch(
          "http://localhost:3001/api/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (bookingRes.ok) {
          const bookings = await bookingRes.json()

          if (Array.isArray(bookings)) {
            setStats((prev) => ({
              ...prev,
              activeBookings: bookings.filter(
                (b) => b.status === "ISSUED"
              ).length,

              pendingRequests: bookings.filter(
                (b) => b.status === "PENDING"
              ).length,

              overdueReturns: bookings.filter(
                (b) => b.status === "OVERDUE"
              ).length,
            }))
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const lowStockAssets = assets.filter(
    (asset) => asset.availableQuantity <= 2
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Smart Asset Management Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor inventory, bookings and resource utilization.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.totalAssets}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.availableAssets}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.activeBookings}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.pendingRequests}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">
            {stats.overdueReturns}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Assets</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : lowStockAssets.length === 0 ? (
              <p>No low stock assets.</p>
            ) : (
              <div className="space-y-2">
                {lowStockAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex justify-between border rounded p-2"
                  >
                    <span>{asset.name}</span>
                    <span>{asset.availableQuantity}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2">
                {assets.slice(0, 5).map((asset) => (
                  <div
                    key={asset.id}
                    className="flex justify-between border rounded p-2"
                  >
                    <span>{asset.name}</span>
                    <span>{asset.category?.name || "Uncategorized"}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}