import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resource from '@/models/Resource';

/**
 * GET /api/resources
 * Fetch resources with optional filters (public)
 * Query params: type, subject, section, dataKey
 */
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Build query from search params
    const query = { isActive: true }; // Only return active resources
    
    const type = searchParams.get('type');
    if (type) query.type = type;
    
    const subject = searchParams.get('subject');
    if (subject) {
      // Case-insensitive regex match for subject
      query.subject = { $regex: new RegExp(`^${subject}$`, 'i') };
    }
    
    const section = searchParams.get('section');
    if (section) query.section = section;
    
    const dataKey = searchParams.get('dataKey');
    if (dataKey) query.dataKey = dataKey;
    
    // Fetch resources with query
    const resources = await Resource.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      count: resources.length,
      data: resources
    });
    
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch resources',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
