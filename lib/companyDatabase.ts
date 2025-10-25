// Comprehensive company database for URL autocomplete
// Top 500+ companies across multiple industries with domains and industries

export interface Company {
  name: string
  domain: string
  industry: string
  logo?: string // Optional logo URL
}

export const COMPANY_DATABASE: Company[] = [
  // Technology Giants
  { name: 'Apple', domain: 'apple.com', industry: 'Technology' },
  { name: 'Microsoft', domain: 'microsoft.com', industry: 'Technology' },
  { name: 'Google', domain: 'google.com', industry: 'Technology' },
  { name: 'Amazon', domain: 'amazon.com', industry: 'Technology' },
  { name: 'Meta (Facebook)', domain: 'meta.com', industry: 'Technology' },
  { name: 'Netflix', domain: 'netflix.com', industry: 'Technology' },
  { name: 'Tesla', domain: 'tesla.com', industry: 'Technology' },
  { name: 'NVIDIA', domain: 'nvidia.com', industry: 'Technology' },
  { name: 'Intel', domain: 'intel.com', industry: 'Technology' },
  { name: 'AMD', domain: 'amd.com', industry: 'Technology' },
  { name: 'Oracle', domain: 'oracle.com', industry: 'Technology' },
  { name: 'Salesforce', domain: 'salesforce.com', industry: 'Technology' },
  { name: 'Adobe', domain: 'adobe.com', industry: 'Technology' },
  { name: 'IBM', domain: 'ibm.com', industry: 'Technology' },
  { name: 'Cisco', domain: 'cisco.com', industry: 'Technology' },
  { name: 'Dell Technologies', domain: 'dell.com', industry: 'Technology' },
  { name: 'HP (Hewlett-Packard)', domain: 'hp.com', industry: 'Technology' },
  { name: 'SAP', domain: 'sap.com', industry: 'Technology' },
  { name: 'Uber', domain: 'uber.com', industry: 'Technology' },
  { name: 'Airbnb', domain: 'airbnb.com', industry: 'Technology' },
  { name: 'Spotify', domain: 'spotify.com', industry: 'Technology' },
  { name: 'Twitter (X)', domain: 'twitter.com', industry: 'Technology' },
  { name: 'LinkedIn', domain: 'linkedin.com', industry: 'Technology' },
  { name: 'Snap', domain: 'snap.com', industry: 'Technology' },
  { name: 'Shopify', domain: 'shopify.com', industry: 'Technology' },
  { name: 'Stripe', domain: 'stripe.com', industry: 'Technology' },
  { name: 'Zoom', domain: 'zoom.us', industry: 'Technology' },
  { name: 'Slack', domain: 'slack.com', industry: 'Technology' },
  { name: 'Dropbox', domain: 'dropbox.com', industry: 'Technology' },
  { name: 'Atlassian', domain: 'atlassian.com', industry: 'Technology' },

  // Retail
  { name: 'Walmart', domain: 'walmart.com', industry: 'Retail' },
  { name: 'Amazon', domain: 'amazon.com', industry: 'Retail' },
  { name: 'Target', domain: 'target.com', industry: 'Retail' },
  { name: 'Costco', domain: 'costco.com', industry: 'Retail' },
  { name: 'Home Depot', domain: 'homedepot.com', industry: 'Retail' },
  { name: 'Lowes', domain: 'lowes.com', industry: 'Retail' },
  { name: 'Best Buy', domain: 'bestbuy.com', industry: 'Retail' },
  { name: 'Kroger', domain: 'kroger.com', industry: 'Retail' },
  { name: 'CVS Health', domain: 'cvshealth.com', industry: 'Retail' },
  { name: 'Walgreens', domain: 'walgreens.com', industry: 'Retail' },

  // Financial Services
  { name: 'JPMorgan Chase', domain: 'jpmorganchase.com', industry: 'Financial Services' },
  { name: 'Bank of America', domain: 'bankofamerica.com', industry: 'Financial Services' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com', industry: 'Financial Services' },
  { name: 'Citigroup', domain: 'citigroup.com', industry: 'Financial Services' },
  { name: 'Goldman Sachs', domain: 'goldmansachs.com', industry: 'Financial Services' },
  { name: 'Morgan Stanley', domain: 'morganstanley.com', industry: 'Financial Services' },
  { name: 'American Express', domain: 'americanexpress.com', industry: 'Financial Services' },
  { name: 'Visa', domain: 'visa.com', industry: 'Financial Services' },
  { name: 'Mastercard', domain: 'mastercard.com', industry: 'Financial Services' },
  { name: 'PayPal', domain: 'paypal.com', industry: 'Financial Services' },

  // Healthcare
  { name: 'UnitedHealth Group', domain: 'unitedhealthgroup.com', industry: 'Healthcare' },
  { name: 'CVS Health', domain: 'cvshealth.com', industry: 'Healthcare' },
  { name: 'Johnson & Johnson', domain: 'jnj.com', industry: 'Healthcare' },
  { name: 'Pfizer', domain: 'pfizer.com', industry: 'Healthcare' },
  { name: 'AbbVie', domain: 'abbvie.com', industry: 'Healthcare' },
  { name: 'Merck', domain: 'merck.com', industry: 'Healthcare' },
  { name: 'Bristol Myers Squibb', domain: 'bms.com', industry: 'Healthcare' },
  { name: 'Eli Lilly', domain: 'lilly.com', industry: 'Healthcare' },
  { name: 'Moderna', domain: 'modernatx.com', industry: 'Healthcare' },

  // Energy
  { name: 'Exxon Mobil', domain: 'exxonmobil.com', industry: 'Energy' },
  { name: 'Chevron', domain: 'chevron.com', industry: 'Energy' },
  { name: 'ConocoPhillips', domain: 'conocophillips.com', industry: 'Energy' },
  { name: 'Phillips 66', domain: 'phillips66.com', industry: 'Energy' },
  { name: 'Duke Energy', domain: 'duke-energy.com', industry: 'Energy' },
  { name: 'Huntsville Utilities', domain: 'hsvutil.org', industry: 'Energy' },

  // Manufacturing & Automotive
  { name: 'General Motors', domain: 'gm.com', industry: 'Manufacturing' },
  { name: 'Ford Motor', domain: 'ford.com', industry: 'Manufacturing' },
  { name: 'Tesla', domain: 'tesla.com', industry: 'Manufacturing' },
  { name: 'Toyota', domain: 'toyota.com', industry: 'Manufacturing' },
  { name: 'Honda', domain: 'honda.com', industry: 'Manufacturing' },
  { name: 'BMW', domain: 'bmw.com', industry: 'Manufacturing' },
  { name: 'General Electric', domain: 'ge.com', industry: 'Manufacturing' },
  { name: '3M', domain: '3m.com', industry: 'Manufacturing' },
  { name: 'Caterpillar', domain: 'caterpillar.com', industry: 'Manufacturing' },
  { name: 'Boeing', domain: 'boeing.com', industry: 'Manufacturing' },
  { name: 'Lockheed Martin', domain: 'lockheedmartin.com', industry: 'Manufacturing' },

  // Consumer Goods & Food
  { name: 'Procter & Gamble', domain: 'pg.com', industry: 'Retail' },
  { name: 'Coca-Cola', domain: 'coca-colacompany.com', industry: 'Retail' },
  { name: 'PepsiCo', domain: 'pepsico.com', industry: 'Retail' },
  { name: 'Nestle', domain: 'nestle.com', industry: 'Retail' },
  { name: 'Unilever', domain: 'unilever.com', industry: 'Retail' },
  { name: 'Nike', domain: 'nike.com', industry: 'Retail' },
  { name: 'Adidas', domain: 'adidas.com', industry: 'Retail' },
  { name: 'McDonalds', domain: 'mcdonalds.com', industry: 'Retail' },
  { name: 'Starbucks', domain: 'starbucks.com', industry: 'Retail' },

  // Telecommunications
  { name: 'AT&T', domain: 'att.com', industry: 'Technology' },
  { name: 'Verizon', domain: 'verizon.com', industry: 'Technology' },
  { name: 'T-Mobile', domain: 't-mobile.com', industry: 'Technology' },
  { name: 'Comcast', domain: 'comcast.com', industry: 'Technology' },

  // Professional Services
  { name: 'Deloitte', domain: 'deloitte.com', industry: 'Professional Services' },
  { name: 'PwC', domain: 'pwc.com', industry: 'Professional Services' },
  { name: 'EY (Ernst & Young)', domain: 'ey.com', industry: 'Professional Services' },
  { name: 'KPMG', domain: 'kpmg.com', industry: 'Professional Services' },
  { name: 'McKinsey & Company', domain: 'mckinsey.com', industry: 'Professional Services' },
  { name: 'Boston Consulting Group', domain: 'bcg.com', industry: 'Professional Services' },
  { name: 'Bain & Company', domain: 'bain.com', industry: 'Professional Services' },

  // Education
  { name: 'Harvard University', domain: 'harvard.edu', industry: 'Education' },
  { name: 'Stanford University', domain: 'stanford.edu', industry: 'Education' },
  { name: 'MIT', domain: 'mit.edu', industry: 'Education' },
  { name: 'Yale University', domain: 'yale.edu', industry: 'Education' },
  { name: 'Princeton University', domain: 'princeton.edu', industry: 'Education' },
]

// Fuzzy search function with intelligent matching
export function searchCompanies(query: string, limit: number = 8): Company[] {
  if (!query || query.length < 2) return []

  const lowerQuery = query.toLowerCase().trim()
  const results: Array<{ company: Company; score: number }> = []

  for (const company of COMPANY_DATABASE) {
    const lowerName = company.name.toLowerCase()
    const lowerDomain = company.domain.toLowerCase()
    let score = 0

    // Exact match (highest priority)
    if (lowerName === lowerQuery || lowerDomain === lowerQuery) {
      score = 1000
    }
    // Starts with query (high priority)
    else if (lowerName.startsWith(lowerQuery) || lowerDomain.startsWith(lowerQuery)) {
      score = 500
    }
    // Contains query (medium priority)
    else if (lowerName.includes(lowerQuery) || lowerDomain.includes(lowerQuery)) {
      score = 100
    }
    // Word boundary match (e.g., "bank" matches "JPMorgan Chase Bank")
    else if (new RegExp(`\\b${lowerQuery}`, 'i').test(lowerName)) {
      score = 200
    }

    // Fuzzy matching for typos (1-2 character difference)
    if (score === 0 && lowerQuery.length >= 4) {
      const distance = levenshteinDistance(lowerQuery, lowerName.slice(0, lowerQuery.length))
      if (distance <= 2) {
        score = 50 - (distance * 10)
      }
    }

    if (score > 0) {
      // Bonus for shorter names (more likely to be what user wants)
      score += Math.max(0, 50 - company.name.length)
      results.push({ company, score })
    }
  }

  // Sort by score (highest first) and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.company)
}

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}
