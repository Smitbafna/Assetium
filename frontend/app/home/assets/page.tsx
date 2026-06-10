"use client"

const assets = [
  {
    id: 1,
    name: "Canon EOS 90D",
    category: "Camera",
    available: 3,
    total: 5,
    status: "Available",
    condition: "Good",
  },
  {
    id: 2,
    name: "Sony A7 III",
    category: "Camera",
    available: 0,
    total: 2,
    status: "In Use",
    condition: "Excellent",
  },
  {
    id: 3,
    name: "Studio Light Kit",
    category: "Lighting",
    available: 1,
    total: 4,
    status: "Low Stock",
    condition: "Good",
  },
  {
    id: 4,
    name: "Wireless Microphone",
    category: "Audio",
    available: 8,
    total: 10,
    status: "Available",
    condition: "Excellent",
  },
  {
    id: 5,
    name: "Stage Prop Set",
    category: "Props",
    available: 2,
    total: 6,
    status: "Maintenance",
    condition: "Needs Repair",
  },
]

export default function AssetsPage() {
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
                <td className="p-4 font-medium">
                  {asset.name}
                </td>

                <td className="p-4">
                  {asset.category}
                </td>

                <td className="p-4">
                  {asset.available}
                </td>

                <td className="p-4">
                  {asset.total}
                </td>

                <td className="p-4">
                  {asset.condition}
                </td>

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