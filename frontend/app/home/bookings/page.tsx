"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Booking = {
  id: number
  status: string
  startDate: string
  endDate: string
  asset: {
    id: number
    name: string
  }
  user?: {
    name: string
    email: string
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      status: "PENDING",
      startDate: "2026-06-15",
      endDate: "2026-06-18",
      asset: {
        id: 101,
        name: "Canon DSLR Camera",
      },
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
    },
    {
      id: 2,
      status: "APPROVED",
      startDate: "2026-06-10",
      endDate: "2026-06-14",
      asset: {
        id: 102,
        name: "Studio Light Kit",
      },
      user: {
        name: "Jane Smith",
        email: "jane@example.com",
      },
    },
    {
      id: 3,
      status: "ISSUED",
      startDate: "2026-06-01",
      endDate: "2026-06-12",
      asset: {
        id: 103,
        name: "Audio Mixer",
      },
      user: {
        name: "Alex Brown",
        email: "alex@example.com",
      },
    },
    {
      id: 4,
      status: "OVERDUE",
      startDate: "2026-05-25",
      endDate: "2026-06-05",
      asset: {
        id: 104,
        name: "Wireless Microphone",
      },
      user: {
        name: "Sarah Wilson",
        email: "sarah@example.com",
      },
    },
    {
      id: 5,
      status: "RETURNED",
      startDate: "2026-05-01",
      endDate: "2026-05-04",
      asset: {
        id: 105,
        name: "Tripod Stand",
      },
      user: {
        name: "Mike Ross",
        email: "mike@example.com",
      },
    },
  ])

  const [filter, setFilter] = useState("ALL")

  const [selectedAsset, setSelectedAsset] =
    useState("")

  const [startDate, setStartDate] =
    useState("")

  const [endDate, setEndDate] = useState("")

  const createBooking = () => {
    if (
      !selectedAsset ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill all fields")
      return
    }

    const newBooking: Booking = {
      id: Date.now(),
      status: "PENDING",
      startDate,
      endDate,
      asset: {
        id: Date.now(),
        name: selectedAsset,
      },
      user: {
        name: "Current User",
        email: "user@example.com",
      },
    }

    setBookings((prev) => [
      newBooking,
      ...prev,
    ])

    setSelectedAsset("")
    setStartDate("")
    setEndDate("")
  }

  const updateStatus = (
    bookingId: number,
    status: string
  ) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status }
          : booking
      )
    )
  }

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500"
      case "APPROVED":
        return "bg-blue-500"
      case "ISSUED":
        return "bg-green-500"
      case "RETURNED":
        return "bg-gray-500"
      case "OVERDUE":
        return "bg-red-500"
      case "REJECTED":
        return "bg-red-700"
      default:
        return "bg-gray-400"
    }
  }

  const pendingCount = bookings.filter(
    (b) => b.status === "PENDING"
  ).length

  const activeCount = bookings.filter(
    (b) => b.status === "ISSUED"
  ).length

  const overdueCount = bookings.filter(
    (b) => b.status === "OVERDUE"
  ).length

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter(
          (booking) =>
            booking.status === filter
        )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Booking Management
        </h1>

        <p className="text-muted-foreground">
          Track and manage asset bookings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              Pending Requests
            </CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {pendingCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Active Bookings
            </CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {activeCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Overdue Returns
            </CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold text-red-500">
            {overdueCount}
          </CardContent>
        </Card>
      </div>

      {/* Create Booking */}
      <Card>
        <CardHeader>
          <CardTitle>
            Create Booking Request
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <select
              className="border rounded-md p-2"
              value={selectedAsset}
              onChange={(e) =>
                setSelectedAsset(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Asset
              </option>

              <option>
                Canon DSLR Camera
              </option>

              <option>
                Studio Light Kit
              </option>

              <option>
                Audio Mixer
              </option>

              <option>
                Wireless Microphone
              </option>

              <option>
                Tripod Stand
              </option>
            </select>

            <input
              type="date"
              className="border rounded-md p-2"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              className="border rounded-md p-2"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
            />

            <Button
              onClick={createBooking}
            >
              Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>
            Filter Bookings
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "ALL",
              "PENDING",
              "APPROVED",
              "ISSUED",
              "OVERDUE",
              "RETURNED",
              "REJECTED",
            ].map((status) => (
              <Button
                key={status}
                variant={
                  filter === status
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setFilter(status)
                }
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Bookings (
            {filteredBookings.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {filteredBookings.length ===
          0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(
                (booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {
                            booking.asset
                              .name
                          }
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            booking.startDate
                          ).toLocaleDateString()}
                          {" - "}
                          {new Date(
                            booking.endDate
                          ).toLocaleDateString()}
                        </p>

                        {booking.user && (
                          <p className="text-sm mt-1">
                            Borrower:{" "}
                            {
                              booking.user
                                .name
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className={`px-3 py-1 rounded text-white text-sm ${getBadgeColor(
                          booking.status
                        )}`}
                      >
                        {
                          booking.status
                        }
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {booking.status ===
                        "PENDING" && (
                        <>
                          <Button
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "APPROVED"
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            variant="destructive"
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {booking.status ===
                        "APPROVED" && (
                        <Button
                          onClick={() =>
                            updateStatus(
                              booking.id,
                              "ISSUED"
                            )
                          }
                        >
                          Issue Asset
                        </Button>
                      )}

                      {(booking.status ===
                        "ISSUED" ||
                        booking.status ===
                          "OVERDUE") && (
                        <Button
                          onClick={() =>
                            updateStatus(
                              booking.id,
                              "RETURNED"
                            )
                          }
                        >
                          Mark Returned
                        </Button>
                      )}

                      {booking.status ===
                        "RETURNED" && (
                        <Button
                          variant="outline"
                          disabled
                        >
                          Completed
                        </Button>
                      )}

                      {booking.status ===
                        "REJECTED" && (
                        <Button
                          variant="outline"
                          disabled
                        >
                          Rejected
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}