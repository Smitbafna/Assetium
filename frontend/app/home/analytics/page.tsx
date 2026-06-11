"use client"

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

const utilizationData = [
  {
    asset: "Camera",
    bookings: 45,
  },
  {
    asset: "Mic",
    bookings: 62,
  },
  {
    asset: "Lights",
    bookings: 38,
  },
  {
    asset: "Mixer",
    bookings: 22,
  },
]

const categoryData = [
  {
    name: "Photography",
    value: 35,
  },
  {
    name: "Audio",
    value: 40,
  },
  {
    name: "Lighting",
    value: 15,
  },
  {
    name: "Costumes",
    value: 10,
  },
]

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#eab308",
  "#dc2626",
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <p className="text-muted-foreground">
          Resource utilization and inventory insights.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            92
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            18
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            74%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold text-red-500">
            3
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Most Utilized Assets
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={utilizationData}>
                <XAxis dataKey="asset" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Category Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {categoryData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Top Performing Assets
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {utilizationData
              .sort(
                (a, b) =>
                  b.bookings - a.bookings
              )
              .map((asset, index) => (
                <div
                  key={asset.asset}
                  className="flex justify-between border rounded p-3"
                >
                  <span>
                    #{index + 1} {asset.asset}
                  </span>

                  <span>
                    {asset.bookings} bookings
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}