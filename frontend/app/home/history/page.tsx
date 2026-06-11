"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const history = [
  {
    id: 1,
    asset: "Canon DSLR Camera",
    user: "John Doe",
    status: "RETURNED",
    issueDate: "01 Jun 2026",
    returnDate: "05 Jun 2026",
  },
  {
    id: 2,
    asset: "Studio Light Kit",
    user: "Jane Smith",
    status: "RETURNED",
    issueDate: "10 May 2026",
    returnDate: "13 May 2026",
  },
  {
    id: 3,
    asset: "Wireless Microphone",
    user: "Sarah Wilson",
    status: "OVERDUE",
    issueDate: "20 May 2026",
    returnDate: "-",
  },
  {
    id: 4,
    asset: "Audio Mixer",
    user: "Alex Brown",
    status: "RETURNED",
    issueDate: "15 Apr 2026",
    returnDate: "18 Apr 2026",
  },
]

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Borrowing History
        </h1>

        <p className="text-muted-foreground">
          View all past asset transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Asset Borrowing Records
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {item.asset}
                    </h3>

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
                  <p>
                    Issue Date: {item.issueDate}
                  </p>
                  <p>
                    Return Date: {item.returnDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}