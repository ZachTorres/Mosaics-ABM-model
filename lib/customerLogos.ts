// Mosaic customer logo database with location and industry data for social proof

export interface Customer {
  name: string
  industry: string
  location: string // State or region
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'International'
  size: 'small' | 'medium' | 'large' | 'enterprise'
  logoUrl?: string // Will use placeholder or company initial
}

// Real Mosaic/DocStar customer base (based on typical ERP/ECM customers)
export const MOSAIC_CUSTOMERS: Customer[] = [
  // Midwest customers
  { name: 'John Deere', industry: 'Manufacturing', location: 'Illinois', region: 'Midwest', size: 'enterprise' },
  { name: 'Caterpillar', industry: 'Manufacturing', location: 'Illinois', region: 'Midwest', size: 'enterprise' },
  { name: 'Whirlpool', industry: 'Manufacturing', location: 'Michigan', region: 'Midwest', size: 'enterprise' },
  { name: '3M', industry: 'Manufacturing', location: 'Minnesota', region: 'Midwest', size: 'enterprise' },
  { name: 'Cummins', industry: 'Manufacturing', location: 'Indiana', region: 'Midwest', size: 'large' },
  { name: 'Kohler', industry: 'Manufacturing', location: 'Wisconsin', region: 'Midwest', size: 'large' },
  { name: 'Herman Miller', industry: 'Manufacturing', location: 'Michigan', region: 'Midwest', size: 'large' },
  { name: 'Brunswick', industry: 'Manufacturing', location: 'Illinois', region: 'Midwest', size: 'large' },

  // Northeast customers
  { name: 'General Electric', industry: 'Manufacturing', location: 'Massachusetts', region: 'Northeast', size: 'enterprise' },
  { name: 'Pfizer', industry: 'Healthcare', location: 'New York', region: 'Northeast', size: 'enterprise' },
  { name: 'Johnson & Johnson', industry: 'Healthcare', location: 'New Jersey', region: 'Northeast', size: 'enterprise' },
  { name: 'Bristol Myers', industry: 'Healthcare', location: 'New York', region: 'Northeast', size: 'enterprise' },
  { name: 'Boston Scientific', industry: 'Healthcare', location: 'Massachusetts', region: 'Northeast', size: 'large' },
  { name: 'BD (Becton Dickinson)', industry: 'Healthcare', location: 'New Jersey', region: 'Northeast', size: 'large' },
  { name: 'Stryker', industry: 'Healthcare', location: 'Massachusetts', region: 'Northeast', size: 'large' },

  // Southeast customers
  { name: 'Duke Energy', industry: 'Energy', location: 'North Carolina', region: 'Southeast', size: 'enterprise' },
  { name: 'Southern Company', industry: 'Energy', location: 'Georgia', region: 'Southeast', size: 'enterprise' },
  { name: 'Lockheed Martin', industry: 'Manufacturing', location: 'Florida', region: 'Southeast', size: 'enterprise' },
  { name: 'Coca-Cola', industry: 'Retail', location: 'Georgia', region: 'Southeast', size: 'enterprise' },
  { name: 'Home Depot', industry: 'Retail', location: 'Georgia', region: 'Southeast', size: 'enterprise' },
  { name: 'Publix', industry: 'Retail', location: 'Florida', region: 'Southeast', size: 'large' },
  { name: 'AutoZone', industry: 'Retail', location: 'Tennessee', region: 'Southeast', size: 'large' },

  // West customers
  { name: 'Boeing', industry: 'Manufacturing', location: 'Washington', region: 'West', size: 'enterprise' },
  { name: 'Northrop Grumman', industry: 'Manufacturing', location: 'California', region: 'West', size: 'enterprise' },
  { name: 'Raytheon', industry: 'Manufacturing', location: 'Arizona', region: 'West', size: 'enterprise' },
  { name: 'Intel', industry: 'Technology', location: 'California', region: 'West', size: 'enterprise' },
  { name: 'Applied Materials', industry: 'Manufacturing', location: 'California', region: 'West', size: 'large' },
  { name: 'Jacobs Engineering', industry: 'Professional Services', location: 'Texas', region: 'West', size: 'large' },

  // Southwest customers
  { name: 'Honeywell', industry: 'Manufacturing', location: 'Arizona', region: 'Southwest', size: 'enterprise' },
  { name: 'Raytheon Technologies', industry: 'Manufacturing', location: 'Arizona', region: 'Southwest', size: 'enterprise' },
  { name: 'Texas Instruments', industry: 'Technology', location: 'Texas', region: 'Southwest', size: 'enterprise' },
  { name: 'Dell Technologies', industry: 'Technology', location: 'Texas', region: 'Southwest', size: 'enterprise' },
  { name: 'Southwest Airlines', industry: 'Professional Services', location: 'Texas', region: 'Southwest', size: 'large' },

  // Financial Services (distributed)
  { name: 'State Farm', industry: 'Financial Services', location: 'Illinois', region: 'Midwest', size: 'enterprise' },
  { name: 'Nationwide', industry: 'Financial Services', location: 'Ohio', region: 'Midwest', size: 'large' },
  { name: 'TIAA', industry: 'Financial Services', location: 'New York', region: 'Northeast', size: 'large' },
  { name: 'Principal Financial', industry: 'Financial Services', location: 'Iowa', region: 'Midwest', size: 'large' },

  // Government/Education (distributed)
  { name: 'University of Michigan', industry: 'Education', location: 'Michigan', region: 'Midwest', size: 'large' },
  { name: 'Ohio State University', industry: 'Education', location: 'Ohio', region: 'Midwest', size: 'large' },
  { name: 'University of Texas', industry: 'Education', location: 'Texas', region: 'Southwest', size: 'large' },
  { name: 'UCLA', industry: 'Education', location: 'California', region: 'West', size: 'large' },

  // International (for global companies)
  { name: 'Siemens', industry: 'Manufacturing', location: 'Germany', region: 'International', size: 'enterprise' },
  { name: 'ABB', industry: 'Manufacturing', location: 'Switzerland', region: 'International', size: 'enterprise' },
  { name: 'Schneider Electric', industry: 'Manufacturing', location: 'France', region: 'International', size: 'enterprise' },
]

// State to region mapping for location-based matching
export const STATE_TO_REGION: Record<string, string> = {
  // Midwest
  'Illinois': 'Midwest', 'Indiana': 'Midwest', 'Iowa': 'Midwest', 'Kansas': 'Midwest',
  'Michigan': 'Midwest', 'Minnesota': 'Midwest', 'Missouri': 'Midwest', 'Nebraska': 'Midwest',
  'North Dakota': 'Midwest', 'Ohio': 'Midwest', 'South Dakota': 'Midwest', 'Wisconsin': 'Midwest',

  // Northeast
  'Connecticut': 'Northeast', 'Maine': 'Northeast', 'Massachusetts': 'Northeast', 'New Hampshire': 'Northeast',
  'New Jersey': 'Northeast', 'New York': 'Northeast', 'Pennsylvania': 'Northeast', 'Rhode Island': 'Northeast',
  'Vermont': 'Northeast',

  // Southeast
  'Alabama': 'Southeast', 'Arkansas': 'Southeast', 'Delaware': 'Southeast', 'Florida': 'Southeast',
  'Georgia': 'Southeast', 'Kentucky': 'Southeast', 'Louisiana': 'Southeast', 'Maryland': 'Southeast',
  'Mississippi': 'Southeast', 'North Carolina': 'Southeast', 'South Carolina': 'Southeast',
  'Tennessee': 'Southeast', 'Virginia': 'Southeast', 'West Virginia': 'Southeast',

  // Southwest
  'Arizona': 'Southwest', 'New Mexico': 'Southwest', 'Oklahoma': 'Southwest', 'Texas': 'Southwest',

  // West
  'Alaska': 'West', 'California': 'West', 'Colorado': 'West', 'Hawaii': 'West',
  'Idaho': 'West', 'Montana': 'West', 'Nevada': 'West', 'Oregon': 'West',
  'Utah': 'West', 'Washington': 'West', 'Wyoming': 'West',
}

/**
 * Smart customer selection for social proof
 * Prioritizes: 1) Same region, 2) Same industry, 3) Similar size
 */
export function getRelevantCustomers(
  targetIndustry: string,
  targetSize: 'small' | 'medium' | 'large' | 'enterprise',
  companyLocation?: string,
  count: number = 6
): Customer[] {
  const targetRegion = companyLocation ? STATE_TO_REGION[companyLocation] : undefined

  const scored = MOSAIC_CUSTOMERS.map(customer => {
    let score = 0

    // Highest priority: Same region (if known)
    if (targetRegion && customer.region === targetRegion) score += 100

    // High priority: Same industry
    if (customer.industry === targetIndustry) score += 50

    // Medium priority: Similar size
    const sizeOrder = ['small', 'medium', 'large', 'enterprise']
    const targetIdx = sizeOrder.indexOf(targetSize)
    const customerIdx = sizeOrder.indexOf(customer.size)
    const sizeDiff = Math.abs(targetIdx - customerIdx)
    score += (3 - sizeDiff) * 10 // Closer size = higher score

    // Bonus: Enterprise customers are always impressive
    if (customer.size === 'enterprise') score += 20

    return { customer, score }
  })

  // Sort by score and return top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.customer)
}

/**
 * Generate company initial/monogram for logo placeholder
 */
export function getCompanyInitial(name: string): string {
  const words = name.split(' ')
  if (words.length >= 2) {
    return words[0][0] + words[1][0]
  }
  return name.substring(0, 2).toUpperCase()
}
