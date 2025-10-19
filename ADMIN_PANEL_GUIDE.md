# Admin Panel Implementation Guide

## Architecture: Hybrid Approach (Recommended)

### What Stays Static (Fast):
- Page structure (configs)
- Routing logic
- Components
- Filters configuration

### What Becomes Dynamic (Database):
- Books data
- Yearly papers data
- Topical papers data
- SAT resources

---

## Database Schema

### MongoDB Schema (using Mongoose):

```javascript
// /src/models/Resource.js
import mongoose from 'mongoose'

const ResourceSchema = new mongoose.Schema({
  // Classification
  type: {
    type: String,
    enum: ['alevel', 'sat', 'olevel', 'igcse'],
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    index: true
    // 'CS', 'Physics', 'Maths', 'IT', 'FM', 'SAT', etc.
  },
  section: {
    type: String,
    required: true,
    index: true
    // 'books', 'yearly', 'topical', 'sa_resources', etc.
  },
  
  // For nested sections (SAT, Maths)
  dataKey: {
    type: String,
    // 'english', 'maths', 'combined', 'p1', 'p3', 'S1'
  },
  
  // Resource details
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '3'
  },
  
  // Links
  link1: String,
  link2: String,
  qp: String,  // Question paper (for yearly)
  ms: String,  // Mark scheme (for yearly)
  
  // Link labels
  text1: {
    type: String,
    default: 'View'
  },
  text2: String,
  
  // For yearly papers - filtering
  session: {
    type: String,
    // 'june', 'november', 'march'
  },
  year: {
    type: String,
    // '2024', '2023', etc.
  },
  paperCode: {
    type: String,
    // '11', '12', '13', '21', etc.
  },
  
  // Auto-generated for yearly papers
  id: {
    type: String,
    // 'june_2024_11', 'november_2023_21', etc.
  },
  
  // Metadata
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Compound indexes for fast queries
ResourceSchema.index({ type: 1, subject: 1, section: 1 })
ResourceSchema.index({ type: 1, subject: 1, section: 1, dataKey: 1 })
ResourceSchema.index({ session: 1, year: 1, paperCode: 1 })

// Auto-generate ID for yearly papers
ResourceSchema.pre('save', function(next) {
  if (this.section === 'yearly' && this.session && this.year && this.paperCode) {
    this.id = \`\${this.session}_\${this.year}_\${this.paperCode}\`
  }
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema)
```

---

## API Routes

### 1. Get Resources by Subject/Section

```javascript
// /src/app/api/resources/[type]/[subject]/[section]/route.js
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Resource from '@/models/Resource'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    const { type, subject, section } = params
    const { searchParams } = new URL(request.url)
    const dataKey = searchParams.get('dataKey')
    
    const query = {
      type,
      subject,
      section,
      isActive: true
    }
    
    if (dataKey) {
      query.dataKey = dataKey
    }
    
    const resources = await Resource.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean()
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
```

### 2. Add Resource (Admin Only)

```javascript
// /src/app/api/admin/resources/route.js
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Resource from '@/models/Resource'
import { verifyAdmin } from '@/lib/auth'

export async function POST(request) {
  try {
    // Verify admin
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await dbConnect()
    
    const data = await request.json()
    
    const resource = await Resource.create({
      ...data,
      createdBy: user.username
    })
    
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await dbConnect()
    
    const { id, ...updates } = await request.json()
    
    const resource = await Resource.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )
    
    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // Soft delete
    await Resource.findByIdAndUpdate(id, { isActive: false })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
```

---

## Update DynamicSubjectPage to Fetch from API

```javascript
// /src/components/DynamicSubjectPage.js
'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ExpandableSection from '@/components/ExpandableSection'
import { Monoton } from 'next/font/google'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function DynamicSubjectPage({ config, type = 'alevel' }) {
  const [filters, setFilters] = useState({})
  const [filteredData, setFilteredData] = useState({})
  const [loading, setLoading] = useState(true)
  const [dataFiles, setDataFiles] = useState({})

  // Fetch data from API on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const newDataFiles = {}
      
      for (const section of config.sections) {
        try {
          const params = new URLSearchParams({
            type,
            subject: config.code || config.subject,
            section: section.id
          })
          
          if (section.dataKey) {
            params.append('dataKey', section.dataKey)
          }
          
          const response = await fetch(\`/api/resources?\${params}\`)
          const data = await response.json()
          
          newDataFiles[section.id] = data
        } catch (error) {
          console.error(\`Error fetching \${section.id}:\`, error)
          newDataFiles[section.id] = []
        }
      }
      
      setDataFiles(newDataFiles)
      setLoading(false)
    }
    
    fetchData()
  }, [config, type])

  // ... rest of the component stays the same
  
  // Initialize filters
  useEffect(() => {
    if (!loading) {
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
    }
  }, [config, loading])

  // Filter data
  useEffect(() => {
    if (!loading) {
      const newFilteredData = {}
      
      config.sections.forEach(section => {
        let sectionData = dataFiles[section.id] || []
        
        if (section.type === 'yearly' && filters[section.id]) {
          const sectionFilters = filters[section.id]
          newFilteredData[section.id] = sectionData.filter(item => {
            const [sess, yr, code] = item.id.split('_')
            return (
              sess === sectionFilters.session.toLowerCase() &&
              yr === sectionFilters.year &&
              code.startsWith(sectionFilters.paperGroup)
            )
          })
        } else {
          newFilteredData[section.id] = sectionData
        }
      })
      
      setFilteredData(newFilteredData)
    }
  }, [filters, dataFiles, config, loading])

  // ... rest of component (handleFilterChange, getYearFilters, render)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffaa00] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading resources...</p>
        </div>
      </div>
    )
  }
  
  // ... rest of render
}
```

---

## Admin Panel UI

### Admin Dashboard Page

```javascript
// /src/app/admin/resources/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'

export default function AdminResourcesPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    type: 'alevel',
    subject: 'CS',
    section: 'books',
    dataKey: '',
    name: '',
    link1: '',
    link2: '',
    qp: '',
    ms: '',
    text1: 'View',
    text2: '',
    size: '3',
    session: '',
    year: '',
    paperCode: ''
  })
  
  useEffect(() => {
    // Check admin auth
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    // Verify admin role (you need to implement this)
    // For now, assume authenticated user is admin
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Resource added successfully!')
        // Reset form
        setFormData({
          type: 'alevel',
          subject: 'CS',
          section: 'books',
          dataKey: '',
          name: '',
          link1: '',
          link2: '',
          qp: '',
          ms: '',
          text1: 'View',
          text2: '',
          size: '3',
          session: '',
          year: '',
          paperCode: ''
        })
      } else {
        alert('Failed to add resource')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding resource')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Add Resource</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
            >
              <option value="alevel">A Level</option>
              <option value="sat">SAT</option>
              <option value="olevel">O Level</option>
              <option value="igcse">IGCSE</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
            >
              {formData.type === 'alevel' && (
                <>
                  <option value="CS">Computer Science (9618)</option>
                  <option value="Physics">Physics (9702)</option>
                  <option value="Maths">Maths (9709)</option>
                  <option value="IT">Information Technology (9626)</option>
                  <option value="FM">Further Maths (9231)</option>
                </>
              )}
              {formData.type === 'sat' && (
                <>
                  <option value="SAT">SAT</option>
                </>
              )}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Section</label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({...formData, section: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
            >
              <option value="books">Books</option>
              <option value="yearly">Yearly Past Papers</option>
              <option value="topical">Topical Past Papers</option>
              <option value="sa_resources">Sir Amjad Resources</option>
            </select>
          </div>

          {/* Data Key (for SAT, Maths) */}
          {(formData.type === 'sat' || formData.subject === 'Maths') && (
            <div>
              <label className="block text-sm font-medium mb-2">Category (optional)</label>
              <select
                value={formData.dataKey}
                onChange={(e) => setFormData({...formData, dataKey: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              >
                <option value="">None</option>
                {formData.type === 'sat' && (
                  <>
                    <option value="english">English</option>
                    <option value="maths">Maths</option>
                    <option value="combined">Combined</option>
                  </>
                )}
                {formData.subject === 'Maths' && (
                  <>
                    <option value="p1">P1</option>
                    <option value="p3">P3</option>
                    <option value="S1">S1</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              required
              placeholder="e.g., Cambridge University Press 3rd Edition"
            />
          </div>

          {/* Conditional fields based on section type */}
          {formData.section === 'yearly' ? (
            <>
              {/* Year, Session, Paper Code for Yearly */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    placeholder="2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session *</label>
                  <select
                    value={formData.session}
                    onChange={(e) => setFormData({...formData, session: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="june">May/June</option>
                    <option value="november">Oct/Nov</option>
                    <option value="march">March</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Paper Code *</label>
                  <input
                    type="text"
                    value={formData.paperCode}
                    onChange={(e) => setFormData({...formData, paperCode: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    placeholder="11"
                    required
                  />
                </div>
              </div>

              {/* QP and MS links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Question Paper Link *</label>
                  <input
                    type="url"
                    value={formData.qp}
                    onChange={(e) => setFormData({...formData, qp: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mark Scheme Link *</label>
                  <input
                    type="url"
                    value={formData.ms}
                    onChange={(e) => setFormData({...formData, ms: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Regular links for books/topicals */}
              <div>
                <label className="block text-sm font-medium mb-2">Link 1 *</label>
                <input
                  type="url"
                  value={formData.link1}
                  onChange={(e) => setFormData({...formData, link1: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link 2 (optional)</label>
                <input
                  type="url"
                  value={formData.link2}
                  onChange={(e) => setFormData({...formData, link2: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button 1 Text</label>
                  <input
                    type="text"
                    value={formData.text1}
                    onChange={(e) => setFormData({...formData, text1: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    placeholder="View Book"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button 2 Text</label>
                  <input
                    type="text"
                    value={formData.text2}
                    onChange={(e) => setFormData({...formData, text2: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                    placeholder="Download"
                  />
                </div>
              </div>
            </>
          )}

          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Card Size</label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
            >
              <option value="2">Small (2)</option>
              <option value="3">Medium (3)</option>
              <option value="4">Large (4)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#ffaa00] text-black font-bold py-3 rounded hover:opacity-90 transition"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## Migration Strategy

### Phase 1: Keep Both Systems Running
1. Keep JSON files as fallback
2. Add database + API
3. Update components to try API first, fallback to JSON

### Phase 2: Migrate Data
1. Create migration script to import all JSON → MongoDB
2. Test thoroughly
3. Switch fully to database

### Phase 3: Remove JSON Files
1. Remove all JSON imports
2. Keep only config files (structure)
3. Clean up unused code

---

## Speed Comparison

| Approach | Initial Load | Subsequent Loads | Admin Updates |
|----------|--------------|------------------|---------------|
| **Current (JSON)** | 50-100ms | 50-100ms (cached) | ❌ Requires rebuild |
| **Database** | 150-200ms | 150-200ms | ✅ Instant |
| **Database + Cache** | 150-200ms | 50-100ms (cached) | ✅ Instant |

**Recommendation:** Use database with server-side caching (Redis/Vercel KV) for best of both worlds.

---

## Cost Estimation

### Free Tier (Good for start):
- **MongoDB Atlas**: 512MB free
- **Vercel**: Free hosting
- **Total**: $0/month

### Paid (When you scale):
- **MongoDB Atlas M10**: $0.08/hour (~$57/month)
- **Vercel Pro**: $20/month
- **Total**: ~$77/month

---

## Next Steps

1. Want me to implement the database schema and API routes?
2. Want me to create the admin panel UI?
3. Want me to add caching for better performance?
4. Want me to create a migration script from JSON to MongoDB?

Let me know which parts you want to implement first! 🚀
