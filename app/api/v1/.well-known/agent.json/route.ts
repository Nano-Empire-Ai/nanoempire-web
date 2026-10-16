import { NextRequest } from 'next/server';
import { GET as getBeacon } from '../../../../.well-known/agent.json/route';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return getBeacon(req);
}
