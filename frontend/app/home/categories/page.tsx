"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = {
  id: number
  name: string
  description: string
  assetCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Photography",
      description: "Cameras, lenses and photography gear",
      assetCount: 15,
    },
    {
      id: 2,
      name: "Audio",
      description: "Microphones, mixers and speakers",
      assetCount: 22,
    },
    {
      id: 3,
      name: "Lighting",
      description: "Studio and event lighting equipment",
      assetCount: 12,
    },
    {
      id: 4,
      name: "Costumes",
      description: "Performance and event costumes",
      assetCount: 35,
    },
    {
      id: 5,
      name: "Infrastructure",
      description: "Stage props and event infrastructure",
      assetCount: 18,
    },
  ])

  const [newCategory, setNewCategory] = useState("")
  const [description, setDescription] = useState("")

  const addCategory = () => {
    if (!newCategory.trim()) return

    const category: Category = {
      id: Date.now(),
      name: newCategory,
      description,
      assetCount: 0,
    }

    setCategories((prev) => [...prev, category])

    setNewCategory("")
    setDescription("")
  }

  const deleteCategory = (id: number) => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    )
  }

  const totalAssets = categories.reduce(
    (sum, category) => sum + category.assetCount,
    0
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Category Management
        </h1>

        <p className="text-muted-foreground">
          Organize assets into categories for easier
          inventory management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {categories.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {totalAssets}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Largest Category</CardTitle>
          </CardHeader>

          <CardContent className="text-xl font-bold">
            {
              [...categories].sort(
                (a, b) => b.assetCount - a.assetCount
              )[0]?.name
            }
          </CardContent>
        </Card>
      </div>

      {/* Add Category */}
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) =>
              setNewCategory(e.target.value)
            }
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <Button onClick={addCategory}>
            Add Category
          </Button>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {category.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>

                  <p className="text-sm mt-2">
                    Assets:{" "}
                    <span className="font-medium">
                      {category.assetCount}
                    </span>
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() =>
                    deleteCategory(category.id)
                  }
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}