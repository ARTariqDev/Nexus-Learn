'use client'

import { useState } from 'react'
import { Monoton } from 'next/font/google'
import PDF from './pdf'
import Yearly from './yearly'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function ExpandableSection({ 
  title, 
  type, // 'books', 'yearly', 'topical'
  data, 
  initiallyExpanded = false,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  // Yearly papers specific props
  yearFilters,
  onFilterChange,
  currentFilters
}) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)

  const renderContent = () => {
    switch (type) {
      case 'books':
      case 'topical':
        return (
          <div className={`grid ${gridCols} gap-y-7 gap-x-4`}>
            {data && data.map((item, index) => (
              <div key={index} className={`fade-in fade-delay-${Math.min(index + 1, 4)} mx-auto`}>
                <PDF {...item} />
              </div>
            ))}
          </div>
        )
      
      case 'yearly':
        return (
          <>
            {yearFilters && (
              <div className="flex gap-6 flex-wrap mb-6">
                {/* Year Filter */}
                {yearFilters.years && (
                  <select
                    value={currentFilters?.year || yearFilters.years[0]}
                    onChange={(e) => onFilterChange?.({ ...currentFilters, year: e.target.value })}
                    className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
                  >
                    {yearFilters.years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                )}

                {/* Session Filter */}
                {yearFilters.sessions && (
                  <select
                    value={currentFilters?.session || yearFilters.sessions[0].value}
                    onChange={(e) => onFilterChange?.({ ...currentFilters, session: e.target.value })}
                    className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
                  >
                    {yearFilters.sessions.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                )}

                {/* Paper Group Filter */}
                {yearFilters.paperGroups && (
                  <select
                    value={currentFilters?.paperGroup || yearFilters.paperGroups[0].value}
                    onChange={(e) => onFilterChange?.({ ...currentFilters, paperGroup: e.target.value })}
                    className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
                  >
                    {yearFilters.paperGroups.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {data && data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-8">
                {data.map((item) => (
                  <Yearly key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-6">No papers found for this selection.</p>
            )}
          </>
        )
      
      default:
        return null
    }
  }

  // For yearly sections with filters, show the section even if no data (to allow filter changes)
  // For other sections (books, topical), hide if empty
  if ((!data || (Array.isArray(data) && data.length === 0)) && type !== 'yearly') {
    return null // Don't render empty sections
  }

  return (
    <section className="bg-[#111111] rounded-xl p-6 container w-full max-w-[95rem] mx-auto transition-all duration-500 ease-in-out overflow-hidden fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className={`${monoton.className} text-white text-3xl`}>
          {title}
        </h1>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} ${title}`}
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {renderContent()}
      </div>
    </section>
  )
}
