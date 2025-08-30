import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CLICKS_FILE = path.join(process.cwd(), 'data', 'clicks.json');

// In-memory storage for production environments where filesystem is read-only
let memoryStore = { total: 0, lastUpdated: new Date().toISOString() };
let useMemoryStore = false;

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(CLICKS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read clicks from file or memory
function readClicks(): { total: number; lastUpdated: string } {
  // If we're already using memory store, return it
  if (useMemoryStore) {
    return memoryStore;
  }
  
  ensureDataDir();
  
  if (!fs.existsSync(CLICKS_FILE)) {
    const initialData = { total: 0, lastUpdated: new Date().toISOString() };
    try {
      fs.writeFileSync(CLICKS_FILE, JSON.stringify(initialData, null, 2));
    } catch (error) {
      console.log('File system is read-only, switching to memory storage');
      useMemoryStore = true;
      memoryStore = initialData;
      return initialData;
    }
    return initialData;
  }
  
  try {
    const data = fs.readFileSync(CLICKS_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    // Initialize memory store with file data
    memoryStore = parsedData;
    return parsedData;
  } catch (error) {
    console.error('Error reading clicks file:', error);
    useMemoryStore = true;
    return memoryStore;
  }
}

// Write clicks to file or memory
function writeClicks(data: { total: number; lastUpdated: string }) {
  // Update memory store first
  memoryStore = data;
  
  // If we're using memory store only, don't try to write to file
  if (useMemoryStore) {
    return;
  }
  
  ensureDataDir();
  
  try {
    fs.writeFileSync(CLICKS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Cannot write to file system, switching to memory-only storage');
    useMemoryStore = true;
  }
}

// GET: Retrieve current click count
export async function GET() {
  try {
    const clickData = readClicks();
    
    return NextResponse.json({
      success: true,
      data: {
        totalClicks: clickData.total,
        lastUpdated: clickData.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error in GET /api/clicks:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch click count' },
      { status: 500 }
    );
  }
}

// POST: Increment click count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { increment = 1 } = body;
    
    // Validate increment value
    if (!Number.isInteger(increment) || increment < 0 || increment > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid increment value' },
        { status: 400 }
      );
    }
    
    const clickData = readClicks();
    const newTotal = clickData.total + increment;
    const updatedData = {
      total: newTotal,
      lastUpdated: new Date().toISOString()
    };
    
    writeClicks(updatedData);
    
    return NextResponse.json({
      success: true,
      data: {
        totalClicks: newTotal,
        increment: increment,
        lastUpdated: updatedData.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error in POST /api/clicks:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to increment click count' },
      { status: 500 }
    );
  }
}

// PUT: Reset click count (admin function)
export async function PUT() {
  try {
    const resetData = {
      total: 0,
      lastUpdated: new Date().toISOString()
    };
    
    writeClicks(resetData);
    
    return NextResponse.json({
      success: true,
      data: {
        totalClicks: 0,
        lastUpdated: resetData.lastUpdated,
        message: 'Click count reset successfully'
      }
    });
  } catch (error) {
    console.error('Error in PUT /api/clicks:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to reset click count' },
      { status: 500 }
    );
  }
}