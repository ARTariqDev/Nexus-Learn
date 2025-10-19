import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resource from '@/models/Resource';
import { requireAdmin } from '@/middleware/auth';

/**
 * GET /api/admin/resources
 * List all resources with filters (admin only)
 */
export async function GET(request) {
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, message: authResult.message },
      { status: authResult.status }
    );
  }
  
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Build query
    const query = {};
    const type = searchParams.get('type');
    if (type) query.type = type;
    
    const subject = searchParams.get('subject');
    if (subject) query.subject = subject;
    
    const section = searchParams.get('section');
    if (section) query.section = section;
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    
    // Fetch resources with pagination
    const [resources, total] = await Promise.all([
      Resource.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Resource.countDocuments(query)
    ]);
    
    return NextResponse.json({
      success: true,
      data: resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/resources
 * Create a new resource (admin only)
 */
export async function POST(request) {
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, message: authResult.message },
      { status: authResult.status }
    );
  }
  
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const { type, subject, section, name } = body;
    if (!type || !subject || !section || !name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: type, subject, section, name' },
        { status: 400 }
      );
    }
    
    // Validate type
    if (!['alevel', 'sat', 'olevel', 'igcse'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Must be: alevel, sat, olevel, or igcse' },
        { status: 400 }
      );
    }
    
    // Additional validation for yearly papers
    if (section === 'yearly') {
      const { session, year, paperCode } = body;
      if (!session || !year || !paperCode) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Yearly papers require: session, year, paperCode' 
          },
          { status: 400 }
        );
      }
    }
    
    // Add createdBy from authenticated user
    body.createdBy = authResult.user.username;
    
    // Create resource
    const resource = new Resource(body);
    await resource.save();
    
    return NextResponse.json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating resource:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Resource with this ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/resources
 * Update an existing resource (admin only)
 */
export async function PUT(request) {
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, message: authResult.message },
      { status: authResult.status }
    );
  }
  
  try {
    await dbConnect();
    
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Resource ID required' },
        { status: 400 }
      );
    }
    
    // Find and update resource
    const resource = await Resource.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Resource updated successfully',
      data: resource
    });
    
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/resources
 * Delete a resource (admin only)
 */
export async function DELETE(request) {
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, message: authResult.message },
      { status: authResult.status }
    );
  }
  
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Resource ID required' },
        { status: 400 }
      );
    }
    
    const resource = await Resource.findByIdAndDelete(id);
    
    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
      data: resource
    });
    
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
