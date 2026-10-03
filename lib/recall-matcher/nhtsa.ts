import { client } from '@/lib/db';

export interface DecodedVin {
  vin: string;
  make: string;
  model: string;
  modelYear: string;
}

export interface NhtsaCampaign {
  recall_id: string;
  agency: 'NHTSA';
  products: string[];
  identifiers: {
    brand: string;
    model: string;
    model_years: string[];
  };
  hazard: string;
  remedy: string;
  dates: {
    announced: string;
    expanded: string[];
  };
  status: string;
}

/**
 * Intermediary Step: Decode VIN via vPIC API with strict SQLite caching.
 * Resolves the v0.1 -> v0.2 pivot (No VIN ranges in NHTSA bulk feed).
 */
export async function decodeVin(vin: string): Promise<DecodedVin | null> {
  // 1. Check local cache (Never decode the same VIN twice)
  const cached = await client.execute({
    sql: 'SELECT make, model, model_year FROM vin_decode_cache WHERE vin = ?',
    args: [vin],
  });

  if (cached.rows.length > 0) {
    return {
      vin,
      make: cached.rows[0].make as string,
      model: cached.rows[0].model as string,
      modelYear: cached.rows[0].model_year as string,
    };
  }

  // 2. Fetch from vPIC (Unauthenticated, public)
  const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`);
  if (!res.ok) throw new Error('vPIC decode failed');
  
  const data = await res.json();
  if (!data.Results || data.Results.length === 0) return null;

  const result = data.Results[0];
  const decoded = {
    vin,
    make: result.Make || '',
    model: result.Model || '',
    modelYear: result.ModelYear || '',
  };

  // 3. Save to cache
  await client.execute({
    sql: 'INSERT INTO vin_decode_cache (vin, make, model, model_year) VALUES (?, ?, ?, ?)',
    args: [decoded.vin, decoded.make, decoded.model, decoded.modelYear],
  });

  return decoded;
}

/**
 * Fetch and Normalize Recalls by decoded Make/Model/Year
 */
export async function fetchCampaignsForVehicle(make: string, model: string, year: string): Promise<NhtsaCampaign[]> {
  const res = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${make}&model=${model}&modelYear=${year}&format=json`);
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.results) return [];

  // Dedup and normalize
  const campaigns = new Map<string, NhtsaCampaign>();

  for (const r of data.results) {
    const recallId = r.NHTSACampaignNumber;
    
    if (!campaigns.has(recallId)) {
      campaigns.set(recallId, {
        recall_id: recallId,
        agency: 'NHTSA',
        products: [r.Component],
        identifiers: {
          brand: r.Make,
          model: r.Model,
          model_years: [r.ModelYear],
        },
        hazard: `${r.Summary} - ${r.Consequence}`,
        remedy: r.Remedy,
        dates: {
          announced: r.ReportReceivedDate,
          expanded: [],
        },
        status: 'active'
      });
    }
  }

  return Array.from(campaigns.values());
}
