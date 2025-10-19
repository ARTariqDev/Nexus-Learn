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
    default: true,
    index: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Compound indexes for fast queries (optimized for free tier)
ResourceSchema.index({ type: 1, subject: 1, section: 1 })
ResourceSchema.index({ type: 1, subject: 1, section: 1, dataKey: 1 })
ResourceSchema.index({ isActive: 1, createdAt: -1 })

// Auto-generate ID for yearly papers
ResourceSchema.pre('save', function(next) {
  if (this.section === 'yearly' && this.session && this.year && this.paperCode) {
    this.id = `${this.session}_${this.year}_${this.paperCode}`
  }
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema)
