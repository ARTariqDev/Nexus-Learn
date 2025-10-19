# 🎨 Architecture Visual Guide

## Complete Data Flow Diagram

```
User visits URL
     ↓
┌────────────────────────────────────────┐
│  http://localhost:3000/home/Alevel/CS  │
└────────────────────────────────────────┘
     ↓
     ↓ Next.js Routing
     ↓
┌─────────────────────────────────────────────┐
│  /src/app/home/Alevel/[subject]/page.js     │
│                                             │
│  export default function SubjectPage() {   │
│    const params = useParams()              │
│    const subjectKey = params.subject       │ ← "CS"
│    const data = subjects[subjectKey]       │
│    return <DynamicSubjectPage {...data} /> │
│  }                                          │
└─────────────────────────────────────────────┘
     ↓
     ↓ Load Config & Data
     ↓
┌──────────────────────────────────────────────┐
│  /src/app/home/Alevel/[subject]/            │
│  subjects-data.js                            │
│                                              │
│  export const subjects = {                  │
│    CS: {                                    │
│      config: csConfig ──────┐               │
│      dataFiles: {           │               │
│        books: csBooks ──┐   │               │
│        yearly: csYearly │   │               │
│      }                  │   │               │
│    }                    │   │               │
│  }                      │   │               │
└─────────────────────────┼───┼───────────────┘
                          │   │
        ┌─────────────────┘   └─────────────────┐
        │                                        │
        ↓                                        ↓
┌──────────────────────┐          ┌─────────────────────────────┐
│  ../CS/CS_Books.json │          │  data/cs-config.json        │
│                      │          │                             │
│  [                   │          │  {                          │
│    {                 │          │    "subject": "CS",         │
│      "name": "...",  │          │    "code": "9618",          │
│      "link1": "..." }│          │    "sections": [            │
│  ]                   │          │      {                      │
└──────────────────────┘          │        "id": "books",       │
                                  │        "type": "books",     │
┌──────────────────────┐          │        "dataFile": "..."    │
│  ../CS/CS_Yearly.json│          │      },                     │
│                      │          │      {                      │
│  [                   │          │        "id": "yearly",      │
│    {                 │          │        "type": "yearly",    │
│      "id": "...",    │          │        "filters": {...}     │
│      "name": "..." } │          │      }                      │
│  ]                   │          │    ]                        │
└──────────────────────┘          │  }                          │
                                  └─────────────────────────────┘
        │                                        │
        │                                        │
        └─────────────┬──────────────────────────┘
                      ↓
           ┌──────────────────────────┐
           │  DynamicSubjectPage      │
           │  /src/components/        │
           │                          │
           │  • Manages filter state  │
           │  • Filters yearly data   │
           │  • Renders sections      │
           └──────────────────────────┘
                      ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
┌────────────────────┐    ┌────────────────────┐
│  Books Section     │    │  Yearly Section    │
│                    │    │                    │
│  ExpandableSection │    │  ExpandableSection │
│  type="books"      │    │  type="yearly"     │
│                    │    │                    │
│  ┌──────────────┐ │    │  ┌──────────────┐ │
│  │ PDF Component│ │    │  │Year Filter   │ │
│  │ PDF Component│ │    │  │Session Filter│ │
│  │ PDF Component│ │    │  │Paper Filter  │ │
│  └──────────────┘ │    │  └──────────────┘ │
└────────────────────┘    │  ┌──────────────┐ │
                          │  │Yearly Card   │ │
                          │  │Yearly Card   │ │
                          │  └──────────────┘ │
                          └────────────────────┘
                      ↓
        ┌──────────────────────────┐
        │   Rendered Page          │
        │                          │
        │  ╔════════════════════╗  │
        │  ║  Computer Science  ║  │
        │  ║       9618         ║  │
        │  ╚════════════════════╝  │
        │                          │
        │  ┌──────────────────┐   │
        │  │ Books       [Hide]│   │
        │  ├──────────────────┤   │
        │  │ 📚 Book 1        │   │
        │  │ 📚 Book 2        │   │
        │  └──────────────────┘   │
        │                          │
        │  ┌──────────────────┐   │
        │  │ Yearly Past      │   │
        │  │ Papers     [Show]│   │
        │  └──────────────────┘   │
        │                          │
        └──────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Layout
│   └── Header (with Login/Logout)
│
└── Page: /home/Alevel/[subject]
    │
    ├── DynamicSubjectPage
    │   │
    │   ├── Header
    │   │
    │   ├── Subject Title & Code
    │   │
    │   ├── ExpandableSection (Books)
    │   │   ├── Section Header
    │   │   ├── Show/Hide Button
    │   │   └── Content Grid
    │   │       ├── PDF Component
    │   │       ├── PDF Component
    │   │       └── PDF Component
    │   │
    │   ├── ExpandableSection (Yearly)
    │   │   ├── Section Header
    │   │   ├── Show/Hide Button
    │   │   ├── Filter Controls
    │   │   │   ├── Year Dropdown
    │   │   │   ├── Session Dropdown
    │   │   │   └── Paper Group Dropdown
    │   │   └── Content Grid
    │   │       ├── Yearly Component
    │   │       ├── Yearly Component
    │   │       └── Yearly Component
    │   │
    │   └── Footer
    │
    └── Error Boundary (Subject Not Found)
```

---

## File Relationship Map

```
[subject]/page.js
    ↓ imports
[subject]/subjects-data.js
    ↓ imports (config)
[subject]/data/cs-config.json
[subject]/data/physics-config.json
[subject]/data/it-config.json
[subject]/data/fm-config.json
[subject]/data/maths-config.json
    ↓ imports (data)
../CS/CS_Books.json
../CS/CS_Yearly.json
../Physics/Physics_Books.json
../IT/IT_Books.json
../IT/IT_Yearly.json
../FM/FM_Books.json
../FM/FM_SA.json
../FM/FM_Yearly.json
../Maths/Maths_Topicals.json
    ↓ passes to
DynamicSubjectPage
    ↓ uses
ExpandableSection
    ↓ renders
PDF / Yearly Components
```

---

## Configuration Flow

```
config.json
    {
      "subject": "Computer Science",
      "sections": [
        {
          "id": "books",
          "type": "books",
          "dataFile": "CS_Books.json"
        }
      ]
    }
        ↓
    DynamicSubjectPage reads config
        ↓
    For each section in config.sections:
        ↓
        ┌─────────────────────┐
        │ id: "books"         │ ──→ dataFiles["books"] = CS_Books.json
        │ type: "books"       │ ──→ ExpandableSection type="books"
        │ title: "Books"      │ ──→ Section heading
        │ gridCols: "..."    │ ──→ Grid layout classes
        └─────────────────────┘
        ↓
    ExpandableSection renders based on type
        ↓
    If type === "books":
        data.map(item => <PDF {...item} />)
        
    If type === "yearly":
        Show filters
        data.map(item => <Yearly {...item} />)
        
    If type === "topical":
        data.map(item => <PDF {...item} />)
```

---

## State Management Flow

```
User clicks "Show/Hide" button
        ↓
    ExpandableSection state changes
        ↓
    isExpanded = !isExpanded
        ↓
    Re-render with animation
        ↓
    max-h-0 → max-h-[500rem]
    opacity-0 → opacity-100
        ↓
    Content smoothly expands


User changes Year filter
        ↓
    DynamicSubjectPage.handleFilterChange()
        ↓
    setFilters({ ...filters, year: newYear })
        ↓
    useEffect triggers
        ↓
    Filter yearly data:
        data.filter(item => {
          const [sess, yr, code] = item.id.split('_')
          return yr === newYear
        })
        ↓
    setFilteredData({ ...filteredData, yearly: filtered })
        ↓
    ExpandableSection receives new data prop
        ↓
    Re-renders with filtered papers
```

---

## URL → Component → Render Path

```
Step 1: URL Request
┌──────────────────────────────────┐
│ GET /home/Alevel/CS              │
└──────────────────────────────────┘

Step 2: Next.js Routing
┌──────────────────────────────────┐
│ Match: [subject] = "CS"          │
│ Load: [subject]/page.js          │
└──────────────────────────────────┘

Step 3: Extract Params
┌──────────────────────────────────┐
│ const params = useParams()       │
│ subjectKey = params.subject      │
│ → "CS"                           │
└──────────────────────────────────┘

Step 4: Load Configuration
┌──────────────────────────────────┐
│ subjects["CS"]                   │
│ → config: cs-config.json         │
│ → dataFiles: { books, yearly }   │
└──────────────────────────────────┘

Step 5: Initialize DynamicSubjectPage
┌──────────────────────────────────┐
│ Set up filter state              │
│ Load data from dataFiles         │
│ Apply dataKey if needed          │
└──────────────────────────────────┘

Step 6: Render Sections
┌──────────────────────────────────┐
│ config.sections.map(section =>   │
│   <ExpandableSection             │
│     title={section.title}        │
│     type={section.type}          │
│     data={filteredData[id]}      │
│   />                             │
│ )                                │
└──────────────────────────────────┘

Step 7: Render Content
┌──────────────────────────────────┐
│ Based on section.type:           │
│                                  │
│ "books" → <PDF /> components     │
│ "yearly" → <Yearly /> components │
│ "topical" → <PDF /> components   │
└──────────────────────────────────┘

Step 8: HTML Response
┌──────────────────────────────────┐
│ <div class="min-h-screen">       │
│   <Header />                     │
│   <h1>Computer Science 9618</h1> │
│   <section>Books</section>       │
│   <section>Yearly Papers</section>│
│   <Footer />                     │
│ </div>                           │
└──────────────────────────────────┘
```

---

## Summary

This architecture provides:

✅ **Clean Separation**: URLs → Routes → Config → Data → Components  
✅ **Single Source of Truth**: One route handler per category  
✅ **Config-Driven**: JSON defines structure, not code  
✅ **Reusable Components**: ExpandableSection handles all types  
✅ **Scalable**: Add subjects by updating config only  
✅ **Maintainable**: Change component → affects all pages  

**The flow is simple, clean, and professional.** 🎉
