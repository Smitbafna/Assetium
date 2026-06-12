"use client"

import { useEffect, useState } from "react"

type Asset = {
  id: number
  name: string
  category: string
  available: number
  total: number
  status: "Available" | "In Use" | "Low Stock" | "Maintenance"
  condition: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/assets")
        const data = await res.json()
        setAssets(data)
      } catch (err) {
        console.error("Failed to fetch assets:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  if (loading) {
    return <div className="p-6">Loading assets...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Asset Inventory</h1>
        <p className="text-muted-foreground">
          Manage and track organizational resources.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left">Asset</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Available</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Condition</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="border-b hover:bg-muted/30"
              >
                <td className="p-4 font-medium">{asset.name}</td>
                <td className="p-4">{asset.category}</td>
                <td className="p-4">{asset.available}</td>
                <td className="p-4">{asset.total}</td>
                <td className="p-4">{asset.condition}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      asset.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : asset.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : asset.status === "In Use"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}