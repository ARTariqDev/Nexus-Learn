'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ExpandableSection from '@/components/ExpandableSection'
import { Monoton } from 'next/font/google'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function DynamicSubjectPage({ config, dataFiles }) {
  const [filters, setFilters] = useState({})
  const [filteredData, setFilteredData] = useState({})
  const [dbResources, setDbResources] = useState([])
  const [loading, setLoading] = useState(false) // Start as false since we load from localStorage first

  // Cache key for localStorage
  const getCacheKey = useCallback((type, subject) => {
    return `nexus_db_resources_${type}_${subject || 'all'}`
  }, [])

  // Get stored resources from localStorage
  const getStoredResources = useCallback((type, subject) => {
    if (typeof window === 'undefined') return []
    try {
      const key = getCacheKey(type, subject)
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (e) {
      console.error('Error reading localStorage:', e)
    }
    return []
  }, [getCacheKey])

  // Save resources to localStorage
  const saveStoredResources = useCallback((type, subject, resources) => {
    if (typeof window === 'undefined') return
    try {
      const key = getCacheKey(type, subject)
      localStorage.setItem(key, JSON.stringify(resources))
    } catch (e) {
      console.error('Error saving to localStorage:', e)
    }
  }, [getCacheKey])

  // Fetch resources from database
  useEffect(() => {
    const fetchDbResources = async () => {
      try {
        // Determine the type based on config
        const type = config.code?.includes('9') ? 'alevel' : 
                     config.subject?.toLowerCase().includes('sat') ? 'sat' : 'alevel'
        
        // Extract subject from config
        const subject = config.subject?.split(' - ')[1] || 
                       config.subject?.split('  ')[0] || 
                       config.subject

        // STEP 1: Load from localStorage immediately
        const storedResources = getStoredResources(type, subject?.toLowerCase().trim())
        setDbResources(storedResources)

        // STEP 2: Fetch from database in background
        const params = new URLSearchParams({ type })
        // For SAT, don't filter by subject since it uses dataKey for differentiation
        if (subject && type !== 'sat') {
          params.append('subject', subject.toLowerCase().trim())
        }

        const response = await fetch(`/api/resources?${params.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          const freshResources = data.data || []
          
          // STEP 3: Merge - only add resources that aren't already in localStorage
          const storedIds = new Set(storedResources.map(r => r._id || r.id))
          const newResources = freshResources.filter(r => !storedIds.has(r._id || r.id))
          
          if (newResources.length > 0) {
            const combined = [...storedResources, ...newResources]
            
            // STEP 4: Update state and localStorage
            setDbResources(combined)
            saveStoredResources(type, subject?.toLowerCase().trim(), combined)
          }
        } else {
          console.error('Failed to fetch DB resources:', response.status)
        }
      } catch (error) {
        console.error('Error fetching DB resources:', error)
      }
    }

    fetchDbResources()
  }, [config, getStoredResources, saveStoredResources])

  // Initialize filters from config
  useEffect(() => {
    const initialFilters = {}
    config.sections.forEach(section => {
      if (section.filters) {
        initialFilters[section.id] = {
          year: section.filters.defaultYear,
          session: section.filters.defaultSession,
          paperGroup: section.filters.defaultPaperGroup
        }
      }
    })
    setFilters(initialFilters)
  }, [config])

  // Combine JSON and DB data, then filter
  useEffect(() => {
    const newFilteredData = {}
    
    config.sections.forEach(section => {
      // Get data from JSON files
      let jsonData = dataFiles[section.id]
      if (section.dataKey && jsonData) {
        jsonData = jsonData[section.dataKey]
      }
      jsonData = Array.isArray(jsonData) ? jsonData : []
      
      // Get data from database matching this section
      const dbData = dbResources.filter(resource => {
        // Match section type
        const sectionMatch = resource.section === section.id || 
                           resource.section === section.type ||
                           (section.dataKey && resource.dataKey === section.dataKey)
        
        return sectionMatch
      }).map(resource => {
        // Transform DB resource to match JSON structure
        // Support both PDF component (link1/link2) and Yearly component (qp/ms/sf)
        return {
          id: resource.id || resource._id,
          name: resource.name,
          // For PDF component (books/topical)
          link1: resource.link1 || resource.qp,
          link2: resource.link2 || resource.ms,
          // For Yearly component (yearly papers)
          qp: resource.qp || resource.link1,
          ms: resource.ms || resource.link2,
          sf: resource.sf,
          // Button texts
          text1: resource.text1 || (section.type === 'yearly' ? 'View Question Paper' : 'View'),
          text2: resource.text2 || (resource.ms || resource.link2 ? (section.type === 'yearly' ? 'View Mark Scheme' : 'Mark Scheme') : ''),
          text3: resource.text3 || (resource.sf ? 'View Source Files' : ''),
          size: resource.size || '3',
          session: resource.session,
          year: resource.year,
          paperCode: resource.paperCode,
          _source: 'database' // Mark as from DB for debugging
        }
      })

      // Combine JSON and DB data (DB data takes priority with its order field)
      const combinedData = [
        ...dbData.sort((a, b) => (a.order || 0) - (b.order || 0)),
        ...jsonData
      ]
      
      // Apply yearly filters if applicable
      if (section.type === 'yearly' && filters[section.id] && combinedData.length > 0) {
        const sectionFilters = filters[section.id]
        const filtered = combinedData.filter(item => {
          if (!item.id) return true // Include items without ID
          const [sess, yr, code] = item.id.split('_')
          const matches = (
            sess === sectionFilters.session.toLowerCase() &&
            yr === sectionFilters.year &&
            code?.startsWith(sectionFilters.paperGroup)
          )
          
          return matches
        })
        
        newFilteredData[section.id] = filtered
      } else {
        newFilteredData[section.id] = combinedData
      }
    })
    
    setFilteredData(newFilteredData)
  }, [filters, dataFiles, config, dbResources])

  const handleFilterChange = (sectionId, newFilters) => {
    setFilters(prev => ({
      ...prev,
      [sectionId]: newFilters
    }))
  }

  // Extract unique years from yearly data for filters
  const getYearFilters = (section) => {
    if (section.type !== 'yearly') return null
    
    // Get combined data for section
    let sectionData = dataFiles[section.id]
    if (section.dataKey && sectionData) {
      sectionData = sectionData[section.dataKey]
    }
    sectionData = Array.isArray(sectionData) ? sectionData : []

    // Add DB resources for this section
    const dbSectionData = dbResources.filter(resource => {
      const sectionMatch = resource.section === section.id || 
                         resource.section === section.type ||
                         (section.dataKey && resource.dataKey === section.dataKey)
      return sectionMatch && resource.year
    })

    const combinedData = [...sectionData, ...dbSectionData]
    if (combinedData.length === 0) return null

    const allYears = [...new Set(combinedData.map(item => {
      if (item.year) return String(item.year)
      if (item.id) return item.id.split('_')[1]
      return null
    }).filter(Boolean))].sort((a, b) => b - a) // Sort numerically in descending order

    return {
      years: allYears,
      sessions: section.filters?.sessions || ['June', 'November'],
      paperGroups: section.filters?.paperGroups || ['1', '2', '3', '4', '5']
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* Page Title */}
        <div className="text-center">
          <h1 className={`${monoton.className} text-4xl md:text-5xl text-white mb-2`}>
            {config.subject}
          </h1>
          {config.code && (
            <p className="text-gray-400 text-lg">
              {config.code}
            </p>
          )}
          {loading && (
            <p className="text-gray-500 text-sm mt-2">Loading additional resources...</p>
          )}
        </div>

        {/* Render all sections */}
        {config.sections.map(section => (
          <ExpandableSection
            key={section.id}
            title={section.title}
            type={section.type}
            data={filteredData[section.id]}
            gridCols={section.gridCols}
            yearFilters={getYearFilters(section)}
            onFilterChange={(newFilters) => handleFilterChange(section.id, newFilters)}
            currentFilters={filters[section.id]}
          />
        ))}
      </div>

      <Footer />
    </div>
  )
}
