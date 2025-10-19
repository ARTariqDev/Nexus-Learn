'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import { Monoton } from 'next/font/google'
import Footer from '@/components/footer'
import resources from './SAT.json' // Import JSON data

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function HomePage() {
  const [showBooks, setShowBooks] = useState(false)
  const [showMath, setShowMath] = useState(false)
  const [showCombined, setShowCombined] = useState(false)
  const [dbResources, setDbResources] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch SAT resources from database
  useEffect(() => {
    const CACHE_KEY = 'nexus_resources_sat_all'
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
    
    const fetchDbResources = async () => {
      try {
        // Try to get cached data first
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(CACHE_KEY)
          if (cached) {
            try {
              const { data, timestamp } = JSON.parse(cached)
              if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('✅ Using cached SAT resources')
                setDbResources(data || [])
                setLoading(false)
                return
              } else {
                console.log('⏰ SAT cache expired')
              }
            } catch (e) {
              console.error('Error parsing SAT cache:', e)
            }
          }
        }

        console.log('🔄 Fetching fresh SAT resources')
        const response = await fetch('/api/resources?type=sat')
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Fetched SAT resources:', data.data)
          setDbResources(data.data || [])
          
          // Cache the results
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: data.data,
                timestamp: Date.now()
              }))
              console.log('💾 Cached SAT resources')
            } catch (e) {
              console.error('Error caching SAT data:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching SAT resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDbResources()
  }, [])

  // Combine DB and JSON data for a specific dataKey
  const getCombinedData = (dataKey) => {
    const jsonData = resources[dataKey] || []
    
    // Filter DB resources by dataKey
    const dbData = dbResources
      .filter(resource => resource.dataKey === dataKey)
      .map(resource => ({
        id: resource.id || resource._id,
        name: resource.name,
        link1: resource.link1 || resource.qp,
        link2: resource.link2 || resource.ms,
        text1: resource.text1 || 'View',
        text2: resource.text2 || '',
        size: resource.size || '3',
        _source: 'database'
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // DB resources first, then JSON
    return [...dbData, ...jsonData]
  }

  const renderSection = (title, showState, toggleFn, dataKey) => {
    const data = getCombinedData(dataKey)
    
    return (
      <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`${monoton.className} text-white text-3xl`}>{title}</h1>
          <button
            onClick={toggleFn}
            className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
          >
            {showState ? 'Hide' : 'Show'}
          </button>
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
            showState ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {data.map((item, idx) => (
            <div key={item.id || idx} className={`fade-in fade-delay-${Math.min(idx + 1, 4)} mx-auto`}>
              <PDF {...item} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">
        <div className="text-center pt-8">
          <h1 className={`${monoton.className} text-4xl md:text-5xl text-white mb-2`}>
            SAT Preparation
          </h1>
          {loading && (
            <p className="text-gray-500 text-sm mt-2">Loading resources...</p>
          )}
        </div>

        {renderSection('SAT - English', showBooks, () => setShowBooks(!showBooks), 'english')}
        {renderSection('SAT - Maths', showMath, () => setShowMath(!showMath), 'maths')}
        {renderSection('SAT - Combined Resources', showCombined, () => setShowCombined(!showCombined), 'combined')}
      </div>

      <Footer />
    </div>
  )
}
