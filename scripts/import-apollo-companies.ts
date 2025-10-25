/**
 * Import Apollo.io Companies to Company Database
 *
 * INSTRUCTIONS:
 * 1. Go to Apollo.io → Search → Companies
 * 2. Filter to your saved companies/lists
 * 3. Select all companies (or use filters)
 * 4. Click Export → Download CSV
 * 5. Save the CSV file to this directory as 'apollo-companies.csv'
 * 6. Run: npx ts-node scripts/import-apollo-companies.ts
 *
 * Expected Apollo.io CSV columns:
 * - Name (or "Company Name" or "Organization Name")
 * - Website (or "Domain" or "Company Domain")
 * - Industry (or "Primary Industry")
 */

import * as fs from 'fs'
import * as path from 'path'

interface ApolloCompany {
  name: string
  domain: string
  industry: string
}

interface CompanyDatabaseEntry {
  name: string
  domain: string
  industry: string
  logo?: string
}

// Industry mapping from Apollo.io to our standard industries
const INDUSTRY_MAPPING: Record<string, string> = {
  // Technology
  'software': 'Technology',
  'information technology': 'Technology',
  'computer software': 'Technology',
  'internet': 'Technology',
  'saas': 'Technology',
  'telecommunications': 'Technology',
  'it services': 'Technology',
  'computer networking': 'Technology',

  // Financial Services
  'banking': 'Financial Services',
  'financial services': 'Financial Services',
  'investment banking': 'Financial Services',
  'insurance': 'Financial Services',
  'venture capital': 'Financial Services',
  'private equity': 'Financial Services',

  // Healthcare
  'healthcare': 'Healthcare',
  'hospital': 'Healthcare',
  'medical': 'Healthcare',
  'pharmaceuticals': 'Healthcare',
  'biotechnology': 'Healthcare',
  'health care': 'Healthcare',

  // Manufacturing
  'manufacturing': 'Manufacturing',
  'automotive': 'Manufacturing',
  'industrial': 'Manufacturing',
  'aerospace': 'Manufacturing',

  // Retail
  'retail': 'Retail',
  'e-commerce': 'Retail',
  'consumer goods': 'Retail',
  'apparel': 'Retail',

  // Energy
  'energy': 'Energy',
  'oil & gas': 'Energy',
  'utilities': 'Energy',
  'renewable energy': 'Energy',

  // Education
  'education': 'Education',
  'higher education': 'Education',
  'e-learning': 'Education',

  // Real Estate
  'real estate': 'Real Estate',
  'commercial real estate': 'Real Estate',

  // Professional Services
  'consulting': 'Professional Services',
  'legal services': 'Professional Services',
  'accounting': 'Professional Services',
  'marketing': 'Professional Services',
  'human resources': 'Professional Services',
}

function normalizeIndustry(apolloIndustry: string): string {
  if (!apolloIndustry) return 'Business Services'

  const lower = apolloIndustry.toLowerCase().trim()

  // Try exact match first
  if (INDUSTRY_MAPPING[lower]) {
    return INDUSTRY_MAPPING[lower]
  }

  // Try partial match
  for (const [key, value] of Object.entries(INDUSTRY_MAPPING)) {
    if (lower.includes(key) || key.includes(lower)) {
      return value
    }
  }

  // Default
  return 'Business Services'
}

function cleanDomain(domain: string): string {
  if (!domain) return ''

  // Remove protocols
  let clean = domain.replace(/^https?:\/\//, '')

  // Remove www.
  clean = clean.replace(/^www\./, '')

  // Remove trailing slashes and paths
  clean = clean.split('/')[0]

  // Remove whitespace
  clean = clean.trim()

  return clean.toLowerCase()
}

function parseCSV(csvContent: string): ApolloCompany[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

  // Find column indices (flexible to handle different Apollo exports)
  const nameIndex = header.findIndex(h =>
    h.toLowerCase().includes('name') || h.toLowerCase().includes('company') || h.toLowerCase().includes('organization')
  )
  const domainIndex = header.findIndex(h =>
    h.toLowerCase().includes('website') || h.toLowerCase().includes('domain')
  )
  const industryIndex = header.findIndex(h =>
    h.toLowerCase().includes('industry')
  )

  if (nameIndex === -1) {
    throw new Error('Could not find company name column in CSV. Expected column with "name", "company", or "organization"')
  }

  console.log(`📊 Found columns:`)
  console.log(`   Name: ${header[nameIndex]}`)
  console.log(`   Domain: ${domainIndex !== -1 ? header[domainIndex] : 'NOT FOUND'}`)
  console.log(`   Industry: ${industryIndex !== -1 ? header[industryIndex] : 'NOT FOUND'}`)

  const companies: ApolloCompany[] = []

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))

    const name = values[nameIndex]?.trim()
    const domain = domainIndex !== -1 ? cleanDomain(values[domainIndex]) : ''
    const industry = industryIndex !== -1 ? values[industryIndex]?.trim() : ''

    // Skip if no name or domain
    if (!name || !domain || domain.length < 3) continue

    // Skip invalid domains
    if (domain.includes(' ') || !domain.includes('.')) continue

    companies.push({
      name,
      domain,
      industry: normalizeIndustry(industry)
    })
  }

  return companies
}

function mergeWithExistingDatabase(newCompanies: ApolloCompany[]): CompanyDatabaseEntry[] {
  // Read existing database
  const dbPath = path.join(__dirname, '../lib/companyDatabase.ts')
  const existingContent = fs.readFileSync(dbPath, 'utf-8')

  // Extract existing companies using regex
  const existingCompaniesMatch = existingContent.match(/export const COMPANY_DATABASE: Company\[\] = \[([\s\S]*?)\]/m)
  if (!existingCompaniesMatch) {
    throw new Error('Could not parse existing company database')
  }

  // Parse existing companies
  const existingDomains = new Set<string>()
  const domainRegex = /domain: '([^']+)'/g
  let match
  while ((match = domainRegex.exec(existingCompaniesMatch[1])) !== null) {
    existingDomains.add(match[1].toLowerCase())
  }

  console.log(`\n📚 Existing database has ${existingDomains.size} companies`)

  // Merge and deduplicate
  const mergedCompanies: CompanyDatabaseEntry[] = []
  let newCount = 0
  let duplicateCount = 0

  for (const company of newCompanies) {
    if (existingDomains.has(company.domain.toLowerCase())) {
      duplicateCount++
      continue
    }

    mergedCompanies.push({
      name: company.name,
      domain: company.domain,
      industry: company.industry
    })
    newCount++
  }

  console.log(`\n✨ Import Summary:`)
  console.log(`   New companies: ${newCount}`)
  console.log(`   Duplicates skipped: ${duplicateCount}`)
  console.log(`   Total after merge: ${existingDomains.size + newCount}`)

  return mergedCompanies
}

function generateDatabaseCode(companies: CompanyDatabaseEntry[]): string {
  const entries = companies.map(c =>
    `  { name: '${c.name.replace(/'/g, "\\'")}', domain: '${c.domain}', industry: '${c.industry}' },`
  ).join('\n')

  return entries
}

async function main() {
  console.log('🚀 Apollo.io Company Import Script\n')

  // Check if CSV file exists
  const csvPath = path.join(__dirname, 'apollo-companies.csv')
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Error: apollo-companies.csv not found!')
    console.log('\n📋 Instructions:')
    console.log('1. Go to Apollo.io → Search → Companies')
    console.log('2. Filter to your saved companies/lists')
    console.log('3. Select all companies')
    console.log('4. Click Export → Download CSV')
    console.log(`5. Save as: ${csvPath}`)
    console.log('6. Run this script again\n')
    process.exit(1)
  }

  // Read and parse CSV
  console.log('📖 Reading apollo-companies.csv...')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const apolloCompanies = parseCSV(csvContent)
  console.log(`✅ Parsed ${apolloCompanies.length} companies from CSV\n`)

  if (apolloCompanies.length === 0) {
    console.error('❌ No companies found in CSV. Please check the format.')
    process.exit(1)
  }

  // Show sample
  console.log('📋 Sample companies:')
  apolloCompanies.slice(0, 5).forEach(c => {
    console.log(`   ${c.name} → ${c.domain} (${c.industry})`)
  })

  // Merge with existing database
  const newCompanies = mergeWithExistingDatabase(apolloCompanies)

  if (newCompanies.length === 0) {
    console.log('\n✅ All companies already exist in database. No changes needed.')
    return
  }

  // Generate new entries
  const newEntriesCode = generateDatabaseCode(newCompanies)

  // Read existing database file
  const dbPath = path.join(__dirname, '../lib/companyDatabase.ts')
  let dbContent = fs.readFileSync(dbPath, 'utf-8')

  // Find the end of COMPANY_DATABASE array (before the closing bracket)
  const insertPosition = dbContent.lastIndexOf(']')
  if (insertPosition === -1) {
    throw new Error('Could not find array closing bracket in database file')
  }

  // Insert new companies
  const before = dbContent.substring(0, insertPosition)
  const after = dbContent.substring(insertPosition)

  // Add newline and Apollo import comment
  const newContent = before + '\n\n  // Imported from Apollo.io\n' + newEntriesCode + '\n' + after

  // Backup original
  const backupPath = dbPath + '.backup'
  fs.writeFileSync(backupPath, dbContent)
  console.log(`\n💾 Backup saved to: ${backupPath}`)

  // Write updated database
  fs.writeFileSync(dbPath, newContent)
  console.log(`✅ Updated: ${dbPath}`)

  console.log('\n🎉 Import complete!')
  console.log(`\n📊 Your autocomplete now includes ${newCompanies.length} more companies!`)
  console.log('\n🚀 Next steps:')
  console.log('   1. Review the changes in lib/companyDatabase.ts')
  console.log('   2. Test the autocomplete in your app')
  console.log('   3. Commit and push to deploy')
}

main().catch(error => {
  console.error('\n❌ Error:', error.message)
  process.exit(1)
})
