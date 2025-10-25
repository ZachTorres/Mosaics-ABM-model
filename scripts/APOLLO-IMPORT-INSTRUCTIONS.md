# Import Apollo.io Companies to Autocomplete

This script allows you to import ALL your saved companies from Apollo.io into the autocomplete dropdown.

## Step-by-Step Instructions

### 1. Export Companies from Apollo.io

1. Log into [Apollo.io](https://app.apollo.io)
2. Go to **Search** → **Companies**
3. Apply filters to find your companies:
   - Option A: Use "Saved" filter to get all saved companies
   - Option B: Select a specific List
   - Option C: Use any custom filters
4. Select companies:
   - Click the checkbox at the top to select all on page
   - OR click "Select All [number] accounts"
5. Click **Export** button (top right)
6. Click **Download** when export is ready

### 2. Save the CSV File

1. Download the CSV file from Apollo.io
2. Rename it to: `apollo-companies.csv`
3. Move it to the `scripts` folder in this project:
   ```
   Mosaics-ABM-model/
     scripts/
       apollo-companies.csv  <-- Put it here
       import-apollo-companies.ts
   ```

### 3. Run the Import Script

Open terminal in the project root and run:

```bash
npx ts-node scripts/import-apollo-companies.ts
```

The script will:
- ✅ Parse your Apollo.io CSV
- ✅ Extract company names, domains, and industries
- ✅ Automatically deduplicate (skip companies already in database)
- ✅ Normalize industry names to match our categories
- ✅ Clean and validate domains
- ✅ Create backup of existing database
- ✅ Add new companies to the autocomplete

### 4. Review and Deploy

1. Check the output summary:
   ```
   ✨ Import Summary:
      New companies: 523
      Duplicates skipped: 47
      Total after merge: 673
   ```

2. Review changes in `lib/companyDatabase.ts`

3. Test locally:
   ```bash
   npm run dev
   ```

4. Try the autocomplete - search for your companies!

5. Commit and push:
   ```bash
   git add lib/companyDatabase.ts
   git commit -m "Import companies from Apollo.io"
   git push
   ```

## Expected CSV Format

The script automatically detects Apollo.io CSV columns. It looks for:

- **Company Name**: Columns like "Name", "Company Name", "Organization Name"
- **Domain**: Columns like "Website", "Domain", "Company Domain"
- **Industry**: Columns like "Industry", "Primary Industry"

## Industry Mapping

Apollo.io industries are automatically mapped to our standard categories:

| Apollo.io Industry | Our Category |
|---|---|
| Software, Information Technology, SaaS | Technology |
| Banking, Financial Services, Insurance | Financial Services |
| Healthcare, Medical, Pharmaceuticals | Healthcare |
| Manufacturing, Automotive, Industrial | Manufacturing |
| Retail, E-commerce, Consumer Goods | Retail |
| Energy, Oil & Gas, Utilities | Energy |
| Education, Higher Education | Education |
| Consulting, Legal, Accounting | Professional Services |

## Troubleshooting

**"CSV file not found"**
- Make sure the file is named exactly `apollo-companies.csv`
- Make sure it's in the `scripts` folder

**"Could not find company name column"**
- Check that your CSV has a column with company names
- The column name should include "name", "company", or "organization"

**"No companies found in CSV"**
- Make sure the CSV has data rows (not just headers)
- Check that the domain/website column has valid URLs

**Want to restore original database?**
- A backup is automatically created: `lib/companyDatabase.ts.backup`
- Just copy it back if needed

## How Many Companies Can I Import?

- ✅ **Unlimited!** Import as many as you want
- The autocomplete shows top 8 matches based on search relevance
- Larger databases work great - fuzzy search keeps it fast
- Typical import: 500-2000 companies

## Re-importing / Updating

You can run the import script multiple times:
- It automatically skips duplicates (based on domain)
- Only NEW companies are added
- Safe to re-run after adding more companies to Apollo.io

## Example Output

```
🚀 Apollo.io Company Import Script

📖 Reading apollo-companies.csv...
✅ Parsed 856 companies from CSV

📋 Sample companies:
   Acme Corporation → acme.com (Technology)
   Global Industries → globalind.com (Manufacturing)
   TechStart Inc → techstart.io (Technology)

📚 Existing database has 150 companies

✨ Import Summary:
   New companies: 706
   Duplicates skipped: 150
   Total after merge: 856

💾 Backup saved to: lib/companyDatabase.ts.backup
✅ Updated: lib/companyDatabase.ts

🎉 Import complete!
📊 Your autocomplete now includes 706 more companies!
```

## Need Help?

- Check that your Apollo.io export includes company names and domains
- Make sure the CSV file is properly formatted
- Review the console output for specific errors
