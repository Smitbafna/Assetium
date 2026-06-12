"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#2563eb", "#16a34a", "#eab308", "#dc2626"]

type Utilization = {
  asset: string
  bookings: number
}

type Category = {
  name: string
  value: number
}

type Overview = {
  totalAssets: number
  activeBookings: number
  utilization: number
  overdue: number
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [utilizationData, setUtilizationData] = useState<Utilization[]>([])
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, utilRes, catRes] = await Promise.all([
          fetch("http://localhost:3001/api/analytics/overview"),
          fetch("http://localhost:3001/api/analytics/utilization"),
          fetch("http://localhost:3001/api/analytics/categories"),
        ])

        const overviewData = await overviewRes.json()
        const utilData = await utilRes.json()
        const catData = await catRes.json()

        setOverview(overviewData)
        setUtilizationData(utilData)
        setCategoryData(catData)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !overview) {
    return <div className="p-6">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Resource utilization and inventory insights.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {overview.totalAssets}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {overview.activeBookings}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {overview.utilization}%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">
            {overview.overdue}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Utilized Assets</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData}>
                <XAxis dataKey="asset" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Assets</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {[...utilizationData]
              .sort((a, b) => b.bookings - a.bookings)
              .map((asset, index) => (
                <div
                  key={asset.asset}
                  className="flex justify-between border rounded p-3"
                >
                  <span>
                    #{index + 1} {asset.asset}
                  </span>
                  <span>{asset.bookings} bookings</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}