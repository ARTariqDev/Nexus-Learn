import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// GET: Fetch scores
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
    const subject = searchParams.get("subject")
    const paper = searchParams.get("paper")

    if (!username) {
      return new Response(JSON.stringify({ error: "Username required" }), { status: 400 })
    }

    try {
      await dbConnect()
    } catch (dbError) {
      // Silently fail DB connection, return empty score
      return new Response(JSON.stringify({}), { status: 200 })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return new Response(JSON.stringify({}), { status: 200 }) // Return empty instead of error
    }

    if (subject && paper) {
      const scoreEntry = user.scores.find(s => s.subject === subject && s.paper === paper)
      return new Response(JSON.stringify(scoreEntry || {}), { status: 200 })
    }

    // Return all scores
    return new Response(JSON.stringify(user.scores || []), { status: 200 })

  } catch (error) {
    console.error('Error fetching scores:', error.message)
    return new Response(JSON.stringify({}), { status: 200 }) // Return empty instead of error
  }
}

// POST: Save a new score
export async function POST(req) {
  try {
    const { username, subject, paper, score, date, scored, total } = await req.json()

    if (!username || !subject || !paper || score === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ username })
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    // Remove old entry if it exists
    user.scores = user.scores.filter(s => !(s.subject === subject && s.paper === paper))

    user.scores.push({ subject, paper, score, date, scored, total })
    await user.save()

    return new Response(JSON.stringify({ message: 'Score saved' }), { status: 200 })
  } catch (error) {
    console.error('POST Error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
