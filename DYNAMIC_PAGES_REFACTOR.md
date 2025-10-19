# Dynamic Subject Pages Refactor - Documentation

## 🎯 Overview

Refactored the repetitive subject pages into a reusable component system. This dramatically reduces code duplication and makes it easier to add new subjects.

## 📦 New Components

### 1. **ExpandableSection** (`/src/components/ExpandableSection.js`)

A reusable component for expandable sections with show/hide toggle.

**Props:**
- `title` - Section title (e.g., "Books", "Yearly Past Papers")
- `type` - Section type: `'books'`, `'yearly'`, or `'topical'`
- `data` - Array of items to display
- `initiallyExpanded` - Whether section starts expanded (default: false)
- `gridCols` - Grid column classes (default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
- `yearFilters` - Filter configuration for yearly papers
- `onFilterChange` - Callback when filters change
- `currentFilters` - Current filter values

**Features:**
- Automatic rendering based on type (PDF components for books, Yearly components for papers)
- Smooth expand/collapse animation
- Filter dropdowns for yearly papers (year, session, paper group)
- Empty state handling (doesn't render if no data)
- Accessibility attributes

### 2. **DynamicSubjectPage** (`/src/components/DynamicSubjectPage.js`)

The main page component that reads configuration and renders sections dynamically.

**Props:**
- `config` - Configuration object (from config.json)
- `dataFiles` - Object mapping section IDs to their data

**Features:**
- Reads config.json to determine page structure
- Manages filter state for all sections
- Filters yearly data based on year/session/paper selections
- Auto-generates year filters from data
- Renders Header, Footer, and all sections

## 📄 Config JSON Structure

Each subject has a `config.json` file that defines its page structure:

```json
{
  "subject": "Computer Science",
  "code": "9618",
  "sections": [
    {
      "id": "books",
      "title": "Books",
      "type": "books",
      "dataFile": "CS_Books.json",
      "gridCols": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    },
    {
      "id": "yearly",
      "title": "Yearly Past Papers",
      "type": "yearly",
      "dataFile": "CS_Yearly.json",
      "filters": {
        "defaultYear": "2024",
        "defaultSession": "november",
        "defaultPaperGroup": "1",
        "sessions": [
          { "value": "may", "label": "May/June" },
          { "value": "november", "label": "October/November" }
        ],
        "paperGroups": [
          { "value": "1", "label": "Paper 1 (11, 12, 13)" },
          { "value": "2", "label": "Paper 2 (21, 22, 23)" }
        ]
      }
    }
  ]
}
```

**Config Fields:**
- `subject` - Subject name displayed at top of page
- `code` - Subject code (e.g., "9618")
- `sections` - Array of section configurations

**Section Config:**
- `id` - Unique identifier
- `title` - Section heading
- `type` - Section type: 'books', 'yearly', or 'topical'
- `dataFile` - Name of JSON file containing data
- `gridCols` - (Optional) Custom grid column classes
- `filters` - (For yearly sections) Filter configuration

## 🔄 Page Structure

Each subject page now looks like this:

```javascript
'use client'

import DynamicSubjectPage from '@/components/DynamicSubjectPage'
import config from './config.json'
import booksData from './CS_Books.json'
import yearlyData from './CS_Yearly.json'

export default function CSPage() {
  const dataFiles = {
    books: booksData,
    yearly: yearlyData
  }

  return <DynamicSubjectPage config={config} dataFiles={dataFiles} />
}
```

**Only 13 lines per subject!** (vs 120-150 lines before)

## 📊 Benefits

### Before:
- ❌ 120-150 lines per subject page
- ❌ Repeated toggle logic in every page
- ❌ Repeated filter logic in every page
- ❌ Hard to maintain consistency
- ❌ Tedious to add new subjects

### After:
- ✅ 13 lines per subject page (90% reduction!)
- ✅ Single source of truth for section behavior
- ✅ Easy to add new sections via JSON
- ✅ Consistent UI across all subjects
- ✅ Easy to add new subjects (just add config + data)

## 🎨 UI Consistency

The refactor maintains **exact** UI appearance:
- Same expandable sections
- Same show/hide buttons
- Same grid layouts
- Same filter dropdowns for yearly papers
- Same animations and transitions

## 📝 How to Add a New Subject

### Step 1: Create config.json
```json
{
  "subject": "Your Subject",
  "code": "XXXX",
  "sections": [
    {
      "id": "books",
      "title": "Books",
      "type": "books",
      "dataFile": "YourSubject_Books.json"
    }
  ]
}
```

### Step 2: Create page.js
```javascript
'use client'

import DynamicSubjectPage from '@/components/DynamicSubjectPage'
import config from './config.json'
import booksData from './YourSubject_Books.json'

export default function YourSubjectPage() {
  const dataFiles = {
    books: booksData
  }

  return <DynamicSubjectPage config={config} dataFiles={dataFiles} />
}
```

### Step 3: Add your data JSON files
- Follow existing format for books/yearly data
- Place in same directory as page.js

**Done!** Your new subject page is ready.

## 🔧 Migration Status

### Completed:
- ✅ ExpandableSection component created
- ✅ DynamicSubjectPage component created
- ✅ Computer Science config.json created
- ✅ Computer Science migrated to new system

### To Migrate:
- [ ] Physics
- [ ] Maths
- [ ] IT
- [ ] Further Maths
- [ ] SAT

## 📚 Example Configs

### Simple Subject (Books Only):
```json
{
  "subject": "Physics",
  "code": "9702",
  "sections": [
    {
      "id": "books",
      "title": "Books",
      "type": "books",
      "dataFile": "Physics_Books.json"
    }
  ]
}
```

### Subject with Multiple Sections:
```json
{
  "subject": "Maths",
  "code": "9709",
  "sections": [
    {
      "id": "p1_topicals",
      "title": "P1 Topical Past Papers",
      "type": "topical",
      "dataFile": "Maths_P1_Topicals.json",
      "gridCols": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    },
    {
      "id": "p3_topicals",
      "title": "P3 Topical Past Papers",
      "type": "topical",
      "dataFile": "Maths_P3_Topicals.json"
    }
  ]
}
```

### SAT (Multiple Categories):
```json
{
  "subject": "SAT Preparation",
  "sections": [
    {
      "id": "english",
      "title": "SAT - English",
      "type": "books",
      "dataFile": "SAT_English.json",
      "gridCols": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    },
    {
      "id": "maths",
      "title": "SAT - Maths",
      "type": "books",
      "dataFile": "SAT_Maths.json",
      "gridCols": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    }
  ]
}
```

## 🎯 Key Features

### Filter Intelligence
- Automatically extracts unique years from yearly data
- Filters data in real-time as user changes selections
- Handles edge cases (no data matches filters)

### Performance
- Efficient filtering with useMemo-like behavior
- Only re-renders affected sections
- Lazy loading of data (could be added easily)

### Extensibility
- Easy to add new section types
- Easy to add new filter types
- Easy to customize grid layouts per section

## 🚀 Future Enhancements

Potential improvements (optional):
- [ ] Add search functionality across sections
- [ ] Add favorites/bookmarks for papers
- [ ] Add recently viewed papers
- [ ] Add lazy loading for large datasets
- [ ] Add skeleton loaders for sections
- [ ] Add download all button for sections
- [ ] Add print functionality

---

**Result:** Clean, maintainable, DRY code that's easy to extend! 🎉
