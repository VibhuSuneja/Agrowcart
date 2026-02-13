
import { POST as updateMetadataPost } from '../update-metadata/route';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    return updateMetadataPost(req);
}

export async function GET(req: NextRequest) {
    return new Response(JSON.stringify({ message: "This endpoint is an alias for /update-metadata" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
