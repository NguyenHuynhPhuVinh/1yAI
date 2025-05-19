/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { StoryCard } from "@/components/story-card"
import { BookOpenText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { searchStoriesWithAI } from '@/lib/gemini'

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  tags: string[]
  view_count: number
  favorite_count: number
  updated_at: string
}

interface Category {
  id: number
  name: string
  description: string
}

interface Tag {
  id: number
  name: string
  description: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mainCategories, setMainCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags") 
      ? decodeURIComponent(searchParams.get("tags")!).split(",").filter(Boolean)
      : []
  )
  const [timeRange, setTimeRange] = useState<string>(searchParams.get("timeRange") || "all")
  const [fromDate, setFromDate] = useState<Date | undefined>(
    searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : undefined
  )
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "updated")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc")
  const [minViews, setMinViews] = useState(searchParams.get("minViews") || "")
  const [minFavorites, setMinFavorites] = useState(searchParams.get("minFavorites") || "")
  const [useAI, setUseAI] = useState(searchParams.get('useAI') === 'true')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (response.ok) {
          setMainCategories(data.mainCategories)
          setTags(data.tags)
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách thể loại:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchParams.get("category") || searchParams.get("tags")) {
      handleSearch()
    }
  }, [])

  const updateURL = (params: URLSearchParams) => {
    const url = new URL(window.location.href)
    url.search = params.toString()
    window.history.pushState({}, '', url)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("q", searchQuery)
      if (selectedCategory) params.set("category", selectedCategory)
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))
      
      if (timeRange !== "all") params.set("timeRange", timeRange)
      if (fromDate) params.set("fromDate", fromDate.toISOString().split('T')[0])
      if (toDate) params.set("toDate", toDate.toISOString().split('T')[0])
      if (sortBy !== "updated") params.set("sortBy", sortBy)
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder)
      if (minViews) params.set("minViews", minViews)
      if (minFavorites) params.set("minFavorites", minFavorites)
      if (useAI) params.set("useAI", "true")
      
      updateURL(params)
      
      const response = await fetch(`/api/library/search?${params.toString()}`)
      const data = await response.json()
      
      if (useAI && searchQuery) {
        const storiesForAI = data.stories.map((story: any) => ({
          story_id: story.story_id,
          title: story.title,
          description: story.description,
          main_category: story.main_category,
          tags: typeof story.tags === 'string' 
            ? story.tags.split(',').filter(Boolean)
            : Array.isArray(story.tags) 
              ? story.tags 
              : []
        }))

        const aiResults = await searchStoriesWithAI(searchQuery, storiesForAI)
        
        const storiesWithAI = data.stories.map((story: any) => {
          const aiResult = aiResults.find(r => r.story_id === story.story_id)
          return {
            ...story,
            relevance_score: aiResult?.relevance_score || 0,
            match_reason: aiResult?.reason || '',
            tags: typeof story.tags === 'string' 
              ? story.tags.split(',').filter(Boolean)
              : Array.isArray(story.tags) 
                ? story.tags 
                : []
          }
        }).sort((a: any, b: any) => b.relevance_score - a.relevance_score)

        setStories(storiesWithAI)
      } else {
        setStories(data.stories.map((story: any) => ({
          ...story,
          tags: typeof story.tags === 'string' 
            ? story.tags.split(',').filter(Boolean)
            : Array.isArray(story.tags) 
              ? story.tags 
              : []
        })))
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tìm Kiếm Nâng Cao</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="search">
              <AccordionTrigger>Tìm kiếm</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Từ khóa</h3>
                    <Input
                      placeholder="Nhập từ khóa tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Thể loại</h3>
                    <div className="flex flex-wrap gap-2">
                      {mainCategories.map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedCategory === category.name ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(
                            selectedCategory === category.name ? null : category.name
                          )}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag.name)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="useAI"
                      checked={useAI}
                      onCheckedChange={setUseAI}
                    />
                    <Label htmlFor="useAI" className="text-sm">
                      Tìm kiếm thông minh với AI
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="time">
              <AccordionTrigger>Thời gian</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Khoảng thời gian</h3>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khoảng thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="year">Năm nay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Hoặc chọn khoảng ngày</h3>
                    <div className="flex gap-2">
                      <DatePicker
                        value={fromDate}
                        onChange={setFromDate}
                        placeholder="Từ ngày"
                      />
                      <DatePicker
                        value={toDate}
                        onChange={setToDate}
                        placeholder="Đến ngày"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stats">
              <AccordionTrigger>Thống kê</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Sắp xếp theo</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tiêu chí sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="updated">Mới cập nhật</SelectItem>
                        <SelectItem value="views">Lượt xem</SelectItem>
                        <SelectItem value="favorites">Lượt thích</SelectItem>
                        <SelectItem value="views_today">Lượt xem hôm nay</SelectItem>
                        <SelectItem value="favorites_today">Lượt thích hôm nay</SelectItem>
                        <SelectItem value="views_week">Lượt xem tuần này</SelectItem>
                        <SelectItem value="favorites_week">Lượt thích tuần này</SelectItem>
                        <SelectItem value="views_month">Lượt xem tháng này</SelectItem>
                        <SelectItem value="favorites_month">Lượt thích tháng này</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Thứ tự</h3>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thứ tự sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Giảm dần</SelectItem>
                        <SelectItem value="asc">Tăng dần</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Lọc số liệu</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Tối thiểu lượt xem"
                        value={minViews}
                        onChange={(e) => setMinViews(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Tối thiểu lượt thích"
                        value={minFavorites}
                        onChange={(e) => setMinFavorites(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button 
            className="w-full mt-6"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col">
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-3">
                    <Skeleton height="100%" />
                  </div>
                  <Skeleton width="70%" height={24} className="mb-2" />
                  <Skeleton width="40%" height={20} className="mb-2" />
                  <Skeleton width="30%" height={16} />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Không tìm thấy truyện nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard 
                  key={story.story_id} 
                  story={story}
                  showRelevance={useAI} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-6">
            <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col">
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-3">
                    <div className="w-full h-full bg-gray-100 animate-pulse" />
                  </div>
                  <div className="h-6 bg-gray-100 animate-pulse mb-2 w-3/4" />
                  <div className="h-4 bg-gray-100 animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}