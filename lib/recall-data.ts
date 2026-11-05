import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface RecallRecord {
  RecallID: string;
  Source: string;
  Title: string;
  Brand: string;
  Firm: string;
  Severity: string;
  RecallDate: string;
  Hazard: string;
  URL: string;
}

let recallsCache: RecallRecord[] | null = null;

export function loadRecalls(): RecallRecord[] {
  if (recallsCache) return recallsCache;

  const csvPath = path.join(process.cwd(), 'distribution_products', 'official_recalls_cross_border_46k.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn('Recall CSV not found at', csvPath);
    return [];
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as RecallRecord[];

  recallsCache = records;
  return records;
}

export function getRetailers(): { name: string; count: number; recalls: RecallRecord[] }[] {
  const recalls = loadRecalls();
  const retailerMap = new Map<string, RecallRecord[]>();

  recalls.forEach(recall => {
    const brand = recall.Brand?.trim();
    if (!brand || brand === '""') return;
    
    // Clean brand name
    const cleanBrand = brand.replace(/^["']|["']$/g, '').trim();
    if (!cleanBrand) return;

    if (!retailerMap.has(cleanBrand)) {
      retailerMap.set(cleanBrand, []);
    }
    retailerMap.get(cleanBrand)!.push(recall);
  });

  return Array.from(retailerMap.entries())
    .map(([name, recalls]) => ({ name, count: recalls.length, recalls }))
    .sort((a, b) => b.count - a.count);
}

export function getCategories(): { name: string; count: number; recalls: RecallRecord[] }[] {
  const recalls = loadRecalls();
  const categoryMap = new Map<string, RecallRecord[]>();

  recalls.forEach(recall => {
    const hazard = recall.Hazard?.trim();
    if (!hazard) return;

    if (!categoryMap.has(hazard)) {
      categoryMap.set(hazard, []);
    }
    categoryMap.get(hazard)!.push(recall);
  });

  return Array.from(categoryMap.entries())
    .map(([name, recalls]) => ({ name, count: recalls.length, recalls }))
    .sort((a, b) => b.count - a.count);
}

export function getRecallById(recallId: string): RecallRecord | undefined {
  const recalls = loadRecalls();
  return recalls.find(r => r.RecallID === recallId);
}

export function getRecallsByRetailer(retailerSlug: string): RecallRecord[] {
  const recalls = loadRecalls();
  return recalls.filter(r => {
    const brand = r.Brand?.trim().replace(/^["']|["']$/g, '').toLowerCase();
    return brand === retailerSlug.toLowerCase();
  });
}

export function getRecallsByCategory(categorySlug: string): RecallRecord[] {
  const recalls = loadRecalls();
  return recalls.filter(r => {
    const hazard = r.Hazard?.trim().toLowerCase();
    return hazard === categorySlug.toLowerCase();
  });
}

export function getSeverityCounts(): Record<string, number> {
  const recalls = loadRecalls();
  const counts: Record<string, number> = {};
  recalls.forEach(r => {
    counts[r.Severity] = (counts[r.Severity] || 0) + 1;
  });
  return counts;
}

export function getSourceCounts(): Record<string, number> {
  const recalls = loadRecalls();
  const counts: Record<string, number> = {};
  recalls.forEach(r => {
    counts[r.Source] = (counts[r.Source] || 0) + 1;
  });
  return counts;
}

export const NAICS_DATA: Record<string, { title: string; description: string; keywords: string[]; typicalClauses: string[] }> = {
  '238220': {
    title: 'HVAC & Mechanical Contractors',
    description: 'Plumbing, heating, and air-conditioning contractors bidding on federal and municipal mechanical systems tenders.',
    keywords: ['HVAC', 'mechanical', 'plumbing', 'heating', 'air-conditioning', 'ventilation'],
    typicalClauses: ['mandatory-site-visit', 'liquidated-damages', 'performance-bond', 'warranty-period', 'energy-efficiency-standards'],
  },
  '561720': {
    title: 'Janitorial & Cleaning Services',
    description: 'Janitorial, custodial, and building cleaning services for federal facilities, military bases, and municipal buildings.',
    keywords: ['janitorial', 'cleaning', 'custodial', 'facility-maintenance', 'sanitization', 'waste-removal'],
    typicalClauses: ['background-checks', 'security-clearance', 'green-cleaning-standards', 'staffing-minimums', 'quality-control-inspections'],
  },
  '236220': {
    title: 'Commercial & Institutional Building Construction',
    description: 'General contractors for federal courthouses, hospitals, schools, and military construction projects.',
    keywords: ['construction', 'commercial', 'institutional', 'federal-building', 'renovation', 'new-construction'],
    typicalClauses: ['davis-bacon-wages', 'buy-american-act', 'leed-certification', 'schedule-milestones', 'change-order-procedures'],
  },
  '541330': {
    title: 'Engineering Services',
    description: 'Civil, mechanical, electrical, and structural engineering services for federal infrastructure and defense projects.',
    keywords: ['engineering', 'civil', 'mechanical', 'electrical', 'structural', 'design-build'],
    typicalClauses: ['professional-liability-insurance', 'errors-omissions', 'technical-data-rights', 'peer-review', 'licensure-verification'],
  },
  '561210': {
    title: 'Facilities Support Services',
    description: 'Integrated facilities management, operations, and maintenance for federal campuses and military installations.',
    keywords: ['facilities-management', 'operations', 'maintenance', 'base-operations', 'integrated-services'],
    typicalClauses: ['key-personnel', 'transition-plan', 'performance-metrics', 'government-furnished-property', 'security-requirements'],
  },
  '238210': {
    title: 'Electrical Contractors',
    description: 'Electrical and wiring contractors for federal buildings, military infrastructure, and utility projects.',
    keywords: ['electrical', 'wiring', 'lighting', 'power-distribution', 'controls', 'fire-alarm'],
    typicalClauses: ['licensed-electricians', 'permits-inspections', 'arc-flash-compliance', 'energy-codes', 'temporary-power'],
  },
  '562111': {
    title: 'Solid Waste Collection',
    description: 'Solid waste, recycling, and hazardous waste collection services for federal facilities and military bases.',
    keywords: ['waste-collection', 'recycling', 'hazardous-waste', 'disposal', 'environmental-compliance'],
    typicalClauses: ['epa-compliance', 'manifest-tracking', 'container-standards', 'spill-response', 'recycling-rates'],
  },
  '541512': {
    title: 'Computer Systems Design Services',
    description: 'IT systems integration, cybersecurity, and software development for federal agencies and defense systems.',
    keywords: ['cybersecurity', 'software-development', 'systems-integration', 'cloud-migration', 'devsecops'],
    typicalClauses: ['fisma-compliance', 'fedramp', 'security-clearance', 'data-rights', 'continuous-monitoring'],
  },
};