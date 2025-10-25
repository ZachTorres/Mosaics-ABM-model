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

  return matrix[str2.length][str1.length

  // Imported from Apollo.io
  { name: 'Taylor Lubricants', domain: 'taylorlubricants.com', industry: 'Business Services' },
  { name: 'Nashville Electric Service', domain: 'nespower.com', industry: 'Business Services' },
  { name: 'Golden West Packaging Group', domain: 'goldenwestpackaging.com', industry: 'Business Services' },
  { name: 'PureSky Energy', domain: 'pureskyenergy.com', industry: 'Business Services' },
  { name: 'Dalton Utilities/OptiLink', domain: 'dutil.com', industry: 'Business Services' },
  { name: 'Morristown Utilities', domain: 'musfiber.net', industry: 'Business Services' },
  { name: 'PG LifeLink', domain: 'pglifelink.com', industry: 'Business Services' },
  { name: 'Austin Energy', domain: 'austinenergy.com', industry: 'Business Services' },
  { name: 'Corporate Cleaning Systems', domain: 'corpcontracting.com', industry: 'Business Services' },
  { name: 'Boisset Collection', domain: 'boissetcollection.com', industry: 'Business Services' },
  { name: 'Laurens Electric Cooperative', domain: 'laurenselectric.com', industry: 'Business Services' },
  { name: 'Marcus Jewish Community Center of Atlanta (MJCCA)', domain: 'atlantajcc.org', industry: 'Business Services' },
  { name: 'Compass Creek Consulting Inc', domain: 'compass-creek.com', industry: 'Business Services' },
  { name: 'US Power Partners', domain: 'usppllc.com', industry: 'Business Services' },
  { name: 'Philadelphia Gas Works', domain: 'pgworks.com', industry: 'Business Services' },
  { name: 'ClearSky Energy', domain: 'clearskyenergy.co', industry: 'Business Services' },
  { name: 'Greenville Water', domain: 'greenvillewater.com', industry: 'Business Services' },
  { name: 'Columbus Water Works', domain: 'cwwga.org', industry: 'Business Services' },
  { name: 'Cartel Properties', domain: 'cartelgroup.com', industry: 'Business Services' },
  { name: 'Fulton Electric System', domain: 'fulton-electric.com', industry: 'Business Services' },
  { name: 'American Reading Company', domain: 'americanreading.com', industry: 'Business Services' },
  { name: 'Pedernales Electric Cooperative Inc.', domain: 'peci.com', industry: 'Business Services' },
  { name: 'J Harlen Co', domain: 'jharlen.com', industry: 'Business Services' },
  { name: 'Shrout Tate Wilson Mechanical & Electrical Engineers', domain: 'stweng.com', industry: 'Business Services' },
  { name: 'Stony Brook University', domain: 'stonybrook.edu', industry: 'Business Services' },
  { name: 'Verra', domain: 'verra.org', industry: 'Business Services' },
  { name: 'Knoxville Orthopaedic Clinic', domain: 'kocortho.com', industry: 'Business Services' },
  { name: 'Hopkinsville Electric System', domain: 'hop-electric.com', industry: 'Business Services' },
  { name: 'ChemGroup', domain: 'chemgroup.com', industry: 'Business Services' },
  { name: 'Erwin Utilities', domain: 'e-u.cc', industry: 'Business Services' },
  { name: 'Enthalpy Analytical', domain: 'enthalpy.com', industry: 'Business Services' },
  { name: 'Allure Healthcare Services', domain: 'allurehcs.com', industry: 'Business Services' },
  { name: 'Carroll County Water Authority', domain: 'ccwageorgia.com', industry: 'Business Services' },
  { name: 'ONSLOW WATER & SEWER AUTHORITY', domain: 'onwasa.com', industry: 'Business Services' },
  { name: 'PQS Mission Critical', domain: 'pqsmc.com', industry: 'Business Services' },
  { name: 'mypec.com', domain: 'mypec.com', industry: 'Business Services' },
  { name: 'mchs.com', domain: 'mchs.com', industry: 'Business Services' },
  { name: 'Darcy Partners', domain: 'darcypartners.com', industry: 'Business Services' },
  { name: 'Coweta County Water and Sewerage Authority', domain: 'cowetawater.com', industry: 'Business Services' },
  { name: 'BitGo', domain: 'bitgo.com', industry: 'Business Services' },
  { name: 'Mewsbb', domain: 'mewsbb.com', industry: 'Business Services' },
  { name: 'Pogo Energy', domain: 'pogoenergy.com', industry: 'Business Services' },
  { name: 'Sentry Management Inc.', domain: 'sentrymgt.com', industry: 'Business Services' },
  { name: 'Curtis Stout', domain: 'chstout.com', industry: 'Business Services' },
  { name: 'Vistra Corp.', domain: 'vistraenergy.com', industry: 'Business Services' },
  { name: 'Marchex', domain: 'marchex.com', industry: 'Business Services' },
  { name: 'VitalCaring Group', domain: 'vitalcaring.com', industry: 'Business Services' },
  { name: 'mpwonline.com', domain: 'mpwonline.com', industry: 'Business Services' },
  { name: 'Lexington Farmers\' Market (Kentucky)', domain: 'lexingtonfarmersmarket.com', industry: 'Business Services' },
  { name: 'CENTRAL SERVICE ASSOCIATION', domain: 'csa1.com', industry: 'Business Services' },
  { name: 'Ampstun Corporation', domain: 'ampstun.com', industry: 'Business Services' },
  { name: 'EnerNex', domain: 'enernex.com', industry: 'Business Services' },
  { name: 'GroundHawk', domain: 'groundhawk.com', industry: 'Business Services' },
  { name: 'Cloverleaf Infrastructure', domain: 'cloverleafinfra.com', industry: 'Business Services' },
  { name: 'Hohmann & Barnard', domain: 'h-b.com', industry: 'Business Services' },
  { name: 'CLEAResult', domain: 'clearesult.com', industry: 'Business Services' },
  { name: 'Russellville (KY) Electric Plant Board', domain: 'epbnet.com', industry: 'Business Services' },
  { name: 'Beaver Water District', domain: 'bwdh2o.org', industry: 'Business Services' },
  { name: 'Philadelphia Utilities', domain: 'philutil.net', industry: 'Business Services' },
  { name: 'Alianza', domain: 'alianza.com', industry: 'Business Services' },
  { name: 'Dedicated IT', domain: 'dedicatedit.com', industry: 'Business Services' },
  { name: 'Public Service Commission of Yazoo City', domain: 'yazoopsc.com', industry: 'Business Services' },
  { name: 'GestiÃ³n Tributaria Territorial', domain: 'gtt.es', industry: 'Business Services' },
  { name: 'West Carolina Tel', domain: 'wctel.com', industry: 'Business Services' },
  { name: 'Magna International', domain: 'magna.com', industry: 'Business Services' },
  { name: 'Northwest Bank', domain: 'northwest.com', industry: 'Business Services' },
  { name: 'Clayton County Water Authority', domain: 'ccwa.us', industry: 'Business Services' },
  { name: 'Georgia System Operations', domain: 'gasoc.com', industry: 'Business Services' },
  { name: 'StepStone Group', domain: 'stepstonegroup.com', industry: 'Business Services' },
  { name: 'CDE Lightband', domain: 'cdelightband.com', industry: 'Business Services' },
  { name: 'Osmose', domain: 'osmose.com', industry: 'Business Services' },
  { name: 'Warren County Water District', domain: 'warrenwater.com', industry: 'Business Services' },
  { name: 'Jackson Electric Membership Corporation', domain: 'jacksonemc.com', industry: 'Business Services' },
  { name: 'Cool Air Mechanical - Atlanta', domain: '770coolair.com', industry: 'Business Services' },
  { name: 'Louis Dreyfus Company', domain: 'ldc.com', industry: 'Business Services' },
  { name: 'MPD Electric Cooperative', domain: 'mpd.coop', industry: 'Business Services' },
  { name: 'MacLean Power Systems', domain: 'macleanpower.com', industry: 'Business Services' },
  { name: 'West Pharmaceutical Services', domain: 'westpharma.com', industry: 'Business Services' },
  { name: 'Ansell', domain: 'ansell.com', industry: 'Business Services' },
  { name: 'Chester Metropolitan District', domain: 'chestermetrosc.com', industry: 'Business Services' },
  { name: 'fluent360', domain: 'fluent360.com', industry: 'Business Services' },
  { name: 'Balke Brown Transwestern', domain: 'balkebrown.com', industry: 'Business Services' },
  { name: 'North Baldwin Utilities', domain: 'northbaldwinutilities.com', industry: 'Business Services' },
  { name: 'EPB', domain: 'epb.net', industry: 'Business Services' },
  { name: 'Tracer', domain: 'tracerllc.com', industry: 'Business Services' },
  { name: 'Utility 2030 Leadership Collaborative (U2030)', domain: 'utility2030.org', industry: 'Business Services' },
  { name: 'suimail.com', domain: 'suimail.com', industry: 'Business Services' },
  { name: 'AMP Quality Energy Services', domain: 'ampqes.com', industry: 'Business Services' },
  { name: 'Navan', domain: 'navan.com', industry: 'Business Services' },
  { name: 'Union County Public Schools', domain: 'ucps.k12.nc.us', industry: 'Business Services' },
  { name: 'Congruex', domain: 'congruex.com', industry: 'Business Services' },
  { name: 'Maximus', domain: 'maximus.com', industry: 'Business Services' },
  { name: 'Zocdoc', domain: 'zocdoc.com', industry: 'Business Services' },
  { name: 'CareCloud', domain: 'carecloud.com', industry: 'Business Services' },
  { name: 'LHC Group', domain: 'lhcgroup.com', industry: 'Business Services' },
  { name: 'Sensible Care', domain: 'sensiblecare.com', industry: 'Business Services' },
  { name: 'Arora Engineers', domain: 'aroraengineers.com', industry: 'Business Services' },
  { name: 'PMPA', domain: 'pmpa.com', industry: 'Business Services' },
  { name: 'Frankfort Plant Board', domain: 'fewpb.com', industry: 'Business Services' },
  { name: 'California Hospital Association', domain: 'calhospital.org', industry: 'Business Services' },
  { name: 'Pike Corporation', domain: 'pike.com', industry: 'Business Services' },
  { name: 'Grand Strand Water & Sewer Authority', domain: 'gswsa.com', industry: 'Business Services' },
  { name: 'Intuit', domain: 'intuit.com', industry: 'Business Services' },
  { name: 'Utility Partners of America', domain: 'utilitypartners.com', industry: 'Business Services' },
  { name: 'Source Capital', domain: 'source-cap.com', industry: 'Business Services' },
  { name: 'Delaware State University', domain: 'desu.edu', industry: 'Business Services' },
  { name: 'lwcky.com', domain: 'lwcky.com', industry: 'Business Services' },
  { name: 'Northern Kentucky Water District', domain: 'nkywater.org', industry: 'Business Services' },
  { name: 'ACDI', domain: 'acd-inc.com', industry: 'Business Services' },
  { name: 'Texas Electric Cooperatives', domain: 'texas-ec.org', industry: 'Business Services' },
  { name: 'Kentucky Electric Cooperatives', domain: 'kyelectric.coop', industry: 'Business Services' },
  { name: 'Texas United Management Corporation', domain: 'tum.com', industry: 'Business Services' },
  { name: 'LCRA', domain: 'lcra.org', industry: 'Business Services' },
  { name: 'Tennessee Valley Authority Police', domain: 'tva.gov', industry: 'Business Services' },
  { name: 'BrandMuscle', domain: 'brandmuscle.com', industry: 'Business Services' },
  { name: 'Koppers Inc.', domain: 'koppers.com', industry: 'Business Services' },
  { name: 'Borton & Sons Inc.', domain: 'bortonfruit.com', industry: 'Business Services' },
  { name: 'Loftin Equipment Co.', domain: 'loftinequip.com', industry: 'Business Services' },
  { name: 'Property Medics of Georgia', domain: 'propertymedicsofga.com', industry: 'Business Services' },
  { name: 'Metropolitan Nashville Airport Authority', domain: 'flynashville.com', industry: 'Business Services' },
  { name: 'State of South Carolina', domain: 'sc.gov', industry: 'Business Services' },
  { name: 'Kinder Morgan', domain: 'kindermorgan.com', industry: 'Business Services' },
  { name: 'Tata Consultancy Services', domain: 'tcs.com', industry: 'Business Services' },
  { name: 'Relativity Space', domain: 'relativityspace.com', industry: 'Business Services' },
  { name: 'Citizen Home Solutions', domain: 'citizenhomesolutions.com', industry: 'Business Services' },
  { name: 'Cahaba Energy Solutions LLC', domain: 'cahabaenergysolutions.com', industry: 'Business Services' },
  { name: 'Current Edge Solutions', domain: 'currentedgesolutions.com', industry: 'Business Services' },
  { name: 'Alcorn County EPA', domain: 'ace-power.com', industry: 'Business Services' },
  { name: 'Madison Utilities', domain: 'madisonutilities.org', industry: 'Business Services' },
  { name: 'Southern Pine Electric', domain: 'southernpine.coop', industry: 'Business Services' },
  { name: 'Madison Suburban Utility District', domain: 'msud.net', industry: 'Business Services' },
  { name: 'SJWD Water District', domain: 'sjwd.com', industry: 'Business Services' },
  { name: 'Southern Electric Corporation of MS', domain: 'secofms.com', industry: 'Business Services' },
  { name: 'Sparus Holdings', domain: 'sparusholdings.com', industry: 'Business Services' },
  { name: 'Okefenoke REMC', domain: 'oremc.com', industry: 'Business Services' },
  { name: 'Farmers Rural Electric Cooperative Corporation', domain: 'farmersrecc.com', industry: 'Business Services' },
  { name: 'Black River Electric Cooperative', domain: 'blackriver.coop', industry: 'Business Services' },
  { name: 'City of Bentonville', domain: 'bentonvillear.com', industry: 'Business Services' },
  { name: 'Cooperative Energy', domain: 'cooperativeenergy.com', industry: 'Business Services' },
  { name: 'BEAM', domain: 'ctvbeam.com', industry: 'Business Services' },
  { name: 'U.S. Pipe', domain: 'uspipe.com', industry: 'Business Services' },
  { name: 'Infratech Corporation', domain: 'infratechcorp.com', industry: 'Business Services' },
  { name: 'Canoochee EMC', domain: 'canoocheeemc.com', industry: 'Business Services' },
  { name: 'Tree Pro Inc.', domain: 'treeproinc.com', industry: 'Business Services' },
  { name: 'UtiliQuest LLC', domain: 'utiliquest.com', industry: 'Business Services' },
  { name: 'AGL Resources', domain: 'aglresources.com', industry: 'Business Services' },
  { name: 'Tracer Electronics LLC', domain: 'tracerelectronicsllc.com', industry: 'Business Services' },
  { name: 're-wa.org', domain: 're-wa.org', industry: 'Business Services' },
  { name: 'RRC Polytech', domain: 'rrc.ca', industry: 'Business Services' },
  { name: 'Roche', domain: 'roche.com', industry: 'Business Services' },
  { name: 'Textron Inc.', domain: 'textron.com', industry: 'Business Services' },
  { name: 'Care Quality Commission', domain: 'cqc.org.uk', industry: 'Business Services' },
  { name: 'Telix Pharmaceuticals Limited', domain: 'telixpharma.com', industry: 'Business Services' },
  { name: 'Youngstown State University', domain: 'ysu.edu', industry: 'Business Services' },
  { name: 'Trine University', domain: 'trine.edu', industry: 'Business Services' },
  { name: 'Better', domain: 'better.com', industry: 'Business Services' },
  { name: 'ASTOUND Group', domain: 'astoundgroup.com', industry: 'Business Services' },
  { name: 'H.B. Fuller', domain: 'hbfuller.com', industry: 'Business Services' },
  { name: 'Veterinary Medicines Directorate', domain: 'jesushouse.org.uk', industry: 'Business Services' },
  { name: 'LICORbio', domain: 'licor.com', industry: 'Business Services' },
  { name: 'The University of Tennessee Health Science Center', domain: 'uthsc.edu', industry: 'Business Services' },
  { name: 'Limbach', domain: 'limbachinc.com', industry: 'Business Services' },
  { name: 'Pine Environmental Services LLC', domain: 'pine-environmental.com', industry: 'Business Services' },
  { name: 'Pacific Life Re', domain: 'pacificlifere.com', industry: 'Business Services' },
  { name: 'Solvay', domain: 'solvay.com', industry: 'Business Services' },
  { name: 'Kiewit Corporation', domain: 'kiewit.com', industry: 'Business Services' },
  { name: 'HDFC Bank', domain: 'hdfcbank.com', industry: 'Business Services' },
  { name: 'Heidelberg Materials Trading', domain: 'hmt-global.com', industry: 'Business Services' },
  { name: 'Tri Mor Corporation', domain: 'trimor.com', industry: 'Business Services' },
  { name: 'Chetu Inc', domain: 'chetu.com', industry: 'Business Services' },
  { name: 'HighRadius', domain: 'highradius.com', industry: 'Business Services' },
  { name: 'GCI Incorporated', domain: 'gci.tech', industry: 'Business Services' },
  { name: 'Chime', domain: 'chime.com', industry: 'Business Services' },
  { name: 'Confluent Strategies', domain: 'confluentstrategies.com', industry: 'Business Services' },
  { name: 'Faria Education Group', domain: 'fariaedu.com', industry: 'Business Services' },
  { name: 'Kim@eShopworld', domain: 'eshopworld.com', industry: 'Business Services' },
  { name: 'Michigan Freeze Pack Co', domain: 'michiganfreezepack.com', industry: 'Business Services' },
  { name: 'Sierra Space', domain: 'sierraspace.com', industry: 'Business Services' },
  { name: 'San Diego County Sheriff\'s Office', domain: 'sdsheriff.gov', industry: 'Business Services' },
  { name: 'BPL', domain: 'bpl.in', industry: 'Business Services' },
  { name: 'Bennett University', domain: 'bennett.edu.in', industry: 'Business Services' },
  { name: 'University of East London', domain: 'uel.ac.uk', industry: 'Business Services' },
  { name: 'Apex Service Partners', domain: 'apexservicepartners.com', industry: 'Business Services' },
  { name: 'Rhode Island School of Design', domain: 'risd.edu', industry: 'Business Services' },
  { name: 'BNP Media', domain: 'bnpmedia.com', industry: 'Business Services' },
  { name: 'EyeCare Partners', domain: 'eyecare-partners.com', industry: 'Business Services' },
  { name: 'Hamilton Lane', domain: 'hamiltonlane.com', industry: 'Business Services' },
  { name: 'Empower Pharmacy', domain: 'empowerpharmacy.com', industry: 'Business Services' },
  { name: 'BASIS Ed', domain: 'basised.com', industry: 'Business Services' },
  { name: 'Suitsupply', domain: 'suitsupply.com', industry: 'Business Services' },
  { name: 'mercymavericks.edu', domain: 'mercymavericks.edu', industry: 'Business Services' },
  { name: 'Denali Therapeutics', domain: 'dnli.com', industry: 'Business Services' },
  { name: 'University of Minnesota', domain: 'umn.edu', industry: 'Business Services' },
  { name: 'Lloyd Ltd', domain: 'lloyd.ltd.uk', industry: 'Business Services' },
  { name: 'Pliant Therapeutics', domain: 'pliantrx.com', industry: 'Business Services' },
  { name: 'Perry\'s Restaurants', domain: 'perrysrestaurants.com', industry: 'Business Services' },
  { name: 'Avery Dennison', domain: 'averydennison.com', industry: 'Business Services' },
  { name: 'Harbour Healthcare', domain: 'harbourhealthcare.co.uk', industry: 'Business Services' },
  { name: 'CARTERS', domain: 'carters.co.nz', industry: 'Business Services' },
  { name: 'Bottisham Village College', domain: 'bottishamvc.org', industry: 'Business Services' },
  { name: 'Florida Gulf Coast University', domain: 'fgcu.edu', industry: 'Business Services' },
  { name: 'WIN Energy REMC', domain: 'winenergyremc.com', industry: 'Business Services' },
  { name: 'Hendricks Power Cooperative', domain: 'hendrickspower.com', industry: 'Business Services' },
  { name: 'hepn.com', domain: 'hepn.com', industry: 'Business Services' },
  { name: 'Wabash Valley Power Alliance', domain: 'wvpa.com', industry: 'Business Services' },
  { name: 'Ohio Valley Gas Corporation', domain: 'ovgc.com', industry: 'Business Services' },
  { name: 'Citizens Energy Group', domain: 'citizensenergygroup.com', industry: 'Business Services' },
  { name: 'Evansville Water and Sewer Utility', domain: 'ewsu.com', industry: 'Business Services' },
  { name: 'Southeastern Indiana REMC', domain: 'seiremc.com', industry: 'Business Services' },
  { name: 'GridHawk LLC', domain: 'gridhawk.com', industry: 'Business Services' },
  { name: 'Alabama Cooperative Extension System', domain: 'aces.edu', industry: 'Business Services' },
  { name: 'TEAM MEDIA', domain: 'teammpl.com', industry: 'Business Services' },
  { name: 'Brown Equipment Company BEC', domain: 'brownequipment.net', industry: 'Business Services' },
  { name: 'Indiana Michigan Power', domain: 'indianamichiganpower.com', industry: 'Business Services' },
  { name: 'Hoosier Energy', domain: 'hoosierenergy.com', industry: 'Business Services' },
  { name: 'ACES', domain: 'acespower.com', industry: 'Business Services' },
  { name: 'Vectren', domain: 'vectren.com', industry: 'Business Services' },
  { name: 'Noble REMC', domain: 'nobleremc.com', industry: 'Business Services' },
  { name: 'Midcontinent Independent System Operator (MISO)', domain: 'misoenergy.org', industry: 'Business Services' },
  { name: 'Indiana Municipal Power Agency', domain: 'impa.com', industry: 'Business Services' },
  { name: 'City of Gary', domain: 'gary.gov', industry: 'Business Services' },
  { name: 'Berry IT', domain: 'berryit.net', industry: 'Business Services' },
  { name: 'South Central Indiana REMC', domain: 'sciremc.com', industry: 'Business Services' },
  { name: 'Blood Hound Underground Utility Locators', domain: 'bhug.com', industry: 'Business Services' },
  { name: 'Gary Sanitary District', domain: 'garysanitary.com', industry: 'Business Services' },
  { name: 'Carroll White REMC', domain: 'cwremc.coop', industry: 'Business Services' },
  { name: 'Jackson County REMC', domain: 'jacksonremc.com', industry: 'Business Services' },
  { name: 'Whitewater Valley REMC', domain: 'wwvremc.com', industry: 'Business Services' },
  { name: 'Bartholomew REMC', domain: 'bcremc.com', industry: 'Business Services' },
  { name: 'thetownsendcorp.com', domain: 'thetownsendcorp.com', industry: 'Business Services' },
  { name: 'Clark County REMC', domain: 'clarkremc.coop', industry: 'Business Services' },
  { name: 'Premier Power Maintenance', domain: 'premierpower.us', industry: 'Business Services' },
  { name: 'Grayson-Collin Electric Coop', domain: 'gcec.net', industry: 'Business Services' },
  { name: 'EUDS Consulting', domain: 'eudsconsulting.com', industry: 'Business Services' },
  { name: 'Hoffman Weber Construction', domain: 'hwconstruction.com', industry: 'Business Services' },
  { name: 'Novatech Utilities', domain: 'novatechutilities.com', industry: 'Business Services' },
  { name: 'South Alabama Electric Cooperative', domain: 'southaec.com', industry: 'Business Services' },
  { name: 'The Yacht Group', domain: 'theyachtgroup.com', industry: 'Business Services' },
  { name: 'Aqualung Group', domain: 'aqualung.com', industry: 'Business Services' },
  { name: 'Comanche Electric Cooperative - CECA', domain: 'ceca.coop', industry: 'Business Services' },
  { name: 'Oxford Water Works', domain: 'oxfordwater.com', industry: 'Business Services' },
  { name: 'The Office of Thierry W. Despont Ltd.', domain: 'despont.com', industry: 'Business Services' },
  { name: 'Acquia', domain: 'acquia.com', industry: 'Business Services' },
  { name: 'BrightRidge', domain: 'brightridge.com', industry: 'Business Services' },
  { name: 'AmeriTrace Damage Prevention', domain: 'ameritrace.net', industry: 'Business Services' },
  { name: 'Sharps Compliance Inc', domain: 'sharpsinc.com', industry: 'Business Services' },
  { name: 'BCI Technologies', domain: 'bcitech.com', industry: 'Business Services' },
  { name: 'Global Laser Enrichment', domain: 'gle-us.com', industry: 'Business Services' },
  { name: 'Wharton County Electric Cooperative', domain: 'mywcec.coop', industry: 'Business Services' },
  { name: '5-starelectricllc.com', domain: '5-starelectricllc.com', industry: 'Business Services' },
  { name: 'Kingsley Montessori School', domain: 'kingsley.org', industry: 'Business Services' },
  { name: 'Utilities Technology Council', domain: 'utc.org', industry: 'Business Services' },
  { name: 'Andersen Construction', domain: 'andersen-const.com', industry: 'Business Services' },
  { name: 'SGC Surveying', domain: 'sgcsurvey.com', industry: 'Business Services' },
  { name: 'ECF Engineering Consultants', domain: 'ecfconsultants.com', industry: 'Business Services' },
  { name: 'Dark Horse Electric', domain: 'darkhorseelectric.com', industry: 'Business Services' },
  { name: 'pdengineers.com', domain: 'pdengineers.com', industry: 'Business Services' },
  { name: 'MediGain', domain: 'medigain.com', industry: 'Business Services' },
  { name: 'Nucor Steel Texas', domain: 'nucor.com', industry: 'Business Services' },
  { name: 'Central Arkansas Water', domain: 'carkw.com', industry: 'Business Services' },
  { name: 'Greeneville Energy Authority - GLPS', domain: 'mygea.net', industry: 'Business Services' },
  { name: 'Rod Walker & Associates Consultancy', domain: 'rwalkerconsultancy.com', industry: 'Business Services' },
  { name: 'Aluma-Form', domain: 'alumaform.com', industry: 'Business Services' },
  { name: 'willowbridgepc.com', domain: 'willowbridgepc.com', industry: 'Business Services' },
  { name: 'Shorewood Packaging', domain: 'ipaper.com', industry: 'Business Services' },
  { name: 'Nashville', domain: 'nashville.gov', industry: 'Business Services' },
  { name: 'Epicor Software Corporation', domain: 'docstar.com', industry: 'Business Services' },
  { name: 'Marmon Utility', domain: 'marmonutility.com', industry: 'Business Services' },
  { name: 'CharlestonTurner LLC', domain: 'advisorycloud.com', industry: 'Business Services' },
  { name: 'From Future', domain: 'fromfuture.io', industry: 'Business Services' },
  { name: 'Birmingham Fastener', domain: 'bhamfast.com', industry: 'Business Services' },
  { name: 'Truted Support Team', domain: 'trustedsupportteam.com', industry: 'Business Services' },
  { name: 'Sherman + Reilly  Inc.', domain: 'sherman-reilly.com', industry: 'Business Services' },
  { name: 'coastalemc.com', domain: 'coastalemc.com', industry: 'Business Services' },
  { name: 'Iapetus Holdings', domain: 'iapetusllc.com', industry: 'Business Services' },
  { name: 'PipeView Technologies', domain: 'pipeviewtech.com', industry: 'Business Services' },
  { name: 'Rockaway River Country Club', domain: 'rockawayrivercc.com', industry: 'Business Services' },
  { name: 'beemac Trucking', domain: 'beemac.com', industry: 'Business Services' },
  { name: 'North American Electric Reliability Corporation', domain: 'nerc.net', industry: 'Business Services' },
  { name: 'Consolidated Utility District of Rutherford County', domain: 'cudrc.com', industry: 'Business Services' },
  { name: 'Knoxville Utilities Board', domain: 'kub.org', industry: 'Business Services' },
  { name: 'DSSI', domain: 'dssi.net', industry: 'Business Services' },
  { name: 'Cherokee Electric Cooperative', domain: 'cherokee.coop', industry: 'Business Services' },
  { name: 'Louisville MSD', domain: 'louisvillemsd.org', industry: 'Business Services' },
  { name: 'JM Search', domain: 'jmsearch.com', industry: 'Business Services' },
  { name: 'The Nightingale-Bamford School', domain: 'nightingale.org', industry: 'Business Services' },
  { name: 'Bristol Tennessee Essential Services', domain: 'btes.net', industry: 'Business Services' },
  { name: 'Wiregrass Electric Cooperative Inc.', domain: 'wiregrass.coop', industry: 'Business Services' },
  { name: 'wiregrasselectric.coop', domain: 'wiregrasselectric.coop', industry: 'Business Services' },
  { name: 'Braeburn Systems LLC', domain: 'braeburnonline.com', industry: 'Business Services' },
  { name: 'ECHO Power Engineering', domain: 'echopowerengineering.com', industry: 'Business Services' },
]
}
