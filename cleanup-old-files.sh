#!/bin/bash

# Cleanup Script for Nexus Learn Dynamic Routes Migration
# Run this AFTER testing the new dynamic routes to remove old files

echo "🧹 Nexus Learn - Cleanup Old Files"
echo "===================================="
echo ""
echo "⚠️  WARNING: This will delete old page files!"
echo "Make sure you've tested the new dynamic routes first."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Cancelled."
    exit 1
fi

cd /Users/tariqmahmood/Projects/nexus-learn

echo ""
echo "📁 Deleting old individual page files..."

# Delete old A Level page files
if [ -f "src/app/home/Alevel/CS/page.js" ]; then
    rm src/app/home/Alevel/CS/page.js
    echo "  ✅ Deleted CS/page.js"
fi

if [ -f "src/app/home/Alevel/Physics/page.js" ]; then
    rm src/app/home/Alevel/Physics/page.js
    echo "  ✅ Deleted Physics/page.js"
fi

if [ -f "src/app/home/Alevel/IT/page.js" ]; then
    rm src/app/home/Alevel/IT/page.js
    echo "  ✅ Deleted IT/page.js"
fi

if [ -f "src/app/home/Alevel/FM/page.js" ]; then
    rm src/app/home/Alevel/FM/page.js
    echo "  ✅ Deleted FM/page.js"
fi

if [ -f "src/app/home/Alevel/Maths/page.js" ]; then
    rm src/app/home/Alevel/Maths/page.js
    echo "  ✅ Deleted Maths/page.js"
fi

# Delete old SAT page file
if [ -f "src/app/home/SAT/page.js" ]; then
    rm src/app/home/SAT/page.js
    echo "  ✅ Deleted SAT/page.js"
fi

echo ""
echo "📁 Deleting temporary page_new.js files..."

# Delete page_new.js files
find src/app/home/Alevel -name "page_new.js" -delete 2>/dev/null && echo "  ✅ Deleted Alevel page_new.js files"
find src/app/home/SAT -name "page_new.js" -delete 2>/dev/null && echo "  ✅ Deleted SAT page_new.js files"

echo ""
echo "📁 Deleting old config.json files (moved to [subject]/data/)..."

# Delete old A Level config files
if [ -f "src/app/home/Alevel/CS/config.json" ]; then
    rm src/app/home/Alevel/CS/config.json
    echo "  ✅ Deleted CS/config.json"
fi

if [ -f "src/app/home/Alevel/Physics/config.json" ]; then
    rm src/app/home/Alevel/Physics/config.json
    echo "  ✅ Deleted Physics/config.json"
fi

if [ -f "src/app/home/Alevel/IT/config.json" ]; then
    rm src/app/home/Alevel/IT/config.json
    echo "  ✅ Deleted IT/config.json"
fi

if [ -f "src/app/home/Alevel/FM/config.json" ]; then
    rm src/app/home/Alevel/FM/config.json
    echo "  ✅ Deleted FM/config.json"
fi

if [ -f "src/app/home/Alevel/Maths/config.json" ]; then
    rm src/app/home/Alevel/Maths/config.json
    echo "  ✅ Deleted Maths/config.json"
fi

# Delete old SAT config file
if [ -f "src/app/home/SAT/config.json" ]; then
    rm src/app/home/SAT/config.json
    echo "  ✅ Deleted SAT/config.json"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  • Deleted old individual page.js files"
echo "  • Deleted temporary page_new.js files"
echo "  • Deleted old config.json files"
echo "  • Kept all data JSON files (Books, Yearly, Topicals, SAT.json)"
echo "  • Kept new [subject] dynamic route folders"
echo ""
echo "🎉 Your codebase is now clean and using dynamic routes!"
