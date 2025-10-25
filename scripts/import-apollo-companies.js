/**
 * Import Apollo.io Companies to Company Database
 * Simple JavaScript version - no TypeScript needed
 */

const fs = require('fs')
const path = require('path')

// Industry mapping from Apollo.io to our standard industries
const INDUSTRY_MAPPING = {
  'software': 'Technology',
  'information technology': 'Technology',
  'computer software': 'Technology',
  'internet': 'Technology',
  'saas': 'Technology',
  'telecommunications': 'Technology',
  'it services': 'Technology',
  'banking': 'Financial Services',
  'financial services': 'Financial Services',
  'insurance': 'Financial Services',
  'healthcare': 'Healthcare',
  'hospital': 'Healthcare',
  'medical': 'Healthcare',
  'pharmaceuticals': 'Healthcare',
  'manufacturing': 'Manufacturing',
  'automotive': 'Manufacturing',
  'retail': 'Retail',
  'e-commerce': 'Retail',
  'energy': 'Energy',
  'oil & gas': 'Energy',
  'utilities': 'Energy',
  'education': 'Education',
  'real estate': 'Real Estate',
  'consulting': 'Professional Services',
  'legal services': 'Professional Services',
}

function normalizeIndustry(apolloIndustry) {
  if (!apolloIndustry) return 'Business Services'
  const lower = apolloIndustry.toLowerCase().trim()
  if (INDUSTRY_MAPPING[lower]) return INDUSTRY_MAPPING[lower]
  for (const [key, value] of Object.entries(INDUSTRY_MAPPING)) {
    if (lower.includes(key)) return value
  }
  return 'Business Services'
}

function cleanDomain(domain) {
  if (!domain) return ''
  let clean = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim()
  return clean.toLowerCase()
}

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []

  const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

  const companyIndex = header.findIndex(h => h.toLowerCase() === 'company' || h.toLowerCase().includes('company name'))
  const websiteIndex = header.findIndex(h => h.toLowerCase() === 'website' || h.toLowerCase() === 'domain')
  const industryIndex = header.findIndex(h => h.toLowerCase() === 'industry')

  console.log(`📊 Found columns:`)
  console.log(`   Company: ${header[companyIndex]} (index ${companyIndex})`)
  console.log(`   Website: ${header[websiteIndex]} (index ${websiteIndex})`)
  console.log(`   Industry: ${industryIndex !== -1 ? header[industryIndex] : 'NOT FOUND'}`)

  const companies = []
  const seenDomains = new Set()

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parsing (handles basic cases)
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))

    const name = values[companyIndex]?.trim()
    const rawDomain = values[websiteIndex]?.trim()
    const industry = industryIndex !== -1 ? values[industryIndex]?.trim() : ''

    if (!name || !rawDomain) continue

    const domain = cleanDomain(rawDomain)
    if (!domain || domain.length < 3 || domain.includes(' ') || !domain.includes('.')) continue

    // Deduplicate within the CSV itself
    if (seenDomains.has(domain)) continue
    seenDomains.add(domain)

    companies.push({
      name,
      domain,
      industry: normalizeIndustry(industry)
    })
  }

  return companies
}

async function main() {
  console.log('🚀 Apollo.io Company Import Script\n')

  const csvPath = path.join(__dirname, 'apollo-companies.csv')
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Error: apollo-companies.csv not found!')
    console.log('\n📋 Place your Apollo export CSV in scripts/apollo-companies.csv')
    process.exit(1)
  }

  console.log('📖 Reading apollo-companies.csv...')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const apolloCompanies = parseCSV(csvContent)
  console.log(`✅ Parsed ${apolloCompanies.length} unique companies from CSV\n`)

  if (apolloCompanies.length === 0) {
    console.error('❌ No valid companies found')
    process.exit(1)
  }

  console.log('📋 Sample companies:')
  apolloCompanies.slice(0, 5).forEach(c => {
    console.log(`   ${c.name} → ${c.domain} (${c.industry})`)
  })

  // Read existing database
  const dbPath = path.join(__dirname, '../lib/companyDatabase.ts')
  let dbContent = fs.readFileSync(dbPath, 'utf-8')

  // Extract existing domains
  const domainRegex = /domain: '([^']+)'/g
  const existingDomains = new Set()
  let match
  while ((match = domainRegex.exec(dbContent)) !== null) {
    existingDomains.add(match[1].toLowerCase())
  }

  console.log(`\n📚 Existing database has ${existingDomains.size} companies`)

  // Filter out duplicates
  const newCompanies = apolloCompanies.filter(c => !existingDomains.has(c.domain.toLowerCase()))

  console.log(`\n✨ Import Summary:`)
  console.log(`   New companies: ${newCompanies.length}`)
  console.log(`   Duplicates skipped: ${apolloCompanies.length - newCompanies.length}`)
  console.log(`   Total after merge: ${existingDomains.size + newCompanies.length}`)

  if (newCompanies.length === 0) {
    console.log('\n✅ All companies already exist. No changes needed.')
    return
  }

  // Generate new entries
  const newEntries = newCompanies.map(c =>
    `  { name: '${c.name.replace(/'/g, "\\'")}', domain: '${c.domain}', industry: '${c.industry}' },`
  ).join('\n')

  // Insert into database
  const insertPosition = dbContent.lastIndexOf(']')
  const before = dbContent.substring(0, insertPosition)
  const after = dbContent.substring(insertPosition)
  const newContent = before + '\n\n  // Imported from Apollo.io\n' + newEntries + '\n' + after

  // Backup
  const backupPath = dbPath + '.backup'
  fs.writeFileSync(backupPath, dbContent)
  console.log(`\n💾 Backup saved to: ${backupPath}`)

  // Write
  fs.writeFileSync(dbPath, newContent)
  console.log(`✅ Updated: ${dbPath}`)

  console.log('\n🎉 Import complete!')
  console.log(`📊 Your autocomplete now includes ${newCompanies.length} more companies!`)
}

main().catch(error => {
  console.error('\n❌ Error:', error.message)
  process.exit(1)
})
