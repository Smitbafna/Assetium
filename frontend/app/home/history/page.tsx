"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HistoryItem = {
  id: number
  asset: string
  user: string
  status: "RETURNED" | "OVERDUE"
  issueDate: string
  returnDate: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/history")
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        console.error("Failed to fetch history:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return <div className="p-6">Loading history...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Borrowing History</h1>
        <p className="text-muted-foreground">
          View all past asset transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Borrowing Records</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{item.asset}</h3>
                    <p className="text-sm text-muted-foreground">
                      Borrowed By: {item.user}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-white text-sm ${
                      item.status === "RETURNED"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 text-sm">
                  <p>Issue Date: {item.issueDate}</p>
                  <p>Return Date: {item.returnDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}