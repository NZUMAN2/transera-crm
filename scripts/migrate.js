// scripts/migrate.js
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bzlxvjxlqguwpzwplkcm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateExcelData() {
  try {
    console.log('Starting data migration...\n');

    // Read the Excel file
    const filePath = path.join(__dirname, '..', 'TransEra Solutions Recruitment Tracker  2025 3.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error('Excel file not found! Please ensure the file is in the project root.');
      return;
    }

    const workbook = XLSX.readFile(filePath);
    
    // Migrate Live Roles to Jobs table
    console.log('📋 Migrating Live Roles...');
    const liveRolesSheet = workbook.Sheets['Live roles'];
    const liveRoles = XLSX.utils.sheet_to_json(liveRolesSheet);
    
    let jobsCount = 0;
    for (const role of liveRoles) {
      if (role['Vacancy'] && role['Client']) {
        const jobData = {
          title: role['Vacancy'],
          description: `${role['Vacancy']} position at ${role['Client']}`,
          status: role['Status'] === 'Open' ? 'open' : 'closed',
          location: role['Location'] || 'South Africa',
          salary_range: role['CTC'] || 'Competitive',
          urgency: 'medium',
          assigned_to: role['Assigned to'] || null,
          date_opened: role['Date Opened'] ? new Date(role['Date Opened']).toISOString() : new Date().toISOString(),
          submission_deadline: role['Submission Deadline'] ? new Date(role['Submission Deadline']).toISOString() : null,
          notes: role['Notes'] || '',
          role_stage: role['Role Stage'] || 'Sourcing',
          telephone_screened: parseInt(role['Telephone Screened']) || 0,
          cvs_submitted: parseInt(role["CV's submitted to client"]) || 0,
          client_interviews: parseInt(role['Client interviews conducted']) || 0,
          filled_positions: parseInt(role['Filled positions']) || 0
        };

        const { error } = await supabase
          .from('jobs')
          .insert(jobData);

        if (!error) {
          jobsCount++;
          console.log(`  ✅ Added job: ${role['Vacancy']}`);
        } else {
          console.log(`  ❌ Error adding job: ${error.message}`);
        }
      }
    }
    console.log(`✅ Migrated ${jobsCount} jobs\n`);

    // Migrate Placements
    console.log('💼 Migrating Placements...');
    const placementsSheet = workbook.Sheets['Placements'];
    const placements = XLSX.utils.sheet_to_json(placementsSheet);
    
    let placementsCount = 0;
    for (const placement of placements) {
      if (placement['CANDIDATE'] && placement['CLIENT']) {
        const placementData = {
          client_name: placement['CLIENT'],
          candidate_name: placement['CANDIDATE'],
          position: placement['POSITION'] || '',
          placement_amount: parseFloat(placement['PLACEMENT AMOUNT']?.toString().replace(/[^0-9.-]+/g, '')) || 0,
          start_date: placement['START DATE'] ? new Date(placement['START DATE']).toISOString().split('T')[0] : null,
          consultant: placement['CONSULTANT'] || '',
          commission_percentage: 12,
          commission_amount: (parseFloat(placement['PLACEMENT AMOUNT']?.toString().replace(/[^0-9.-]+/g, '')) || 0) * 0.12,
          typed_by: placement['TYPED BY'] || ''
        };

        const { error } = await supabase
          .from('placements')
          .insert(placementData);

        if (!error) {
          placementsCount++;
          if (placementsCount % 50 === 0) {
            console.log(`  ✅ Processed ${placementsCount} placements...`);
          }
        } else {
          console.log(`  ❌ Error adding placement: ${error.message}`);
        }
      }
    }
    console.log(`✅ Migrated ${placementsCount} placements\n`);

    // Migrate Clients from various sheets
    console.log('🏢 Extracting Unique Clients...');
    const clientSet = new Set();
    
    // Get clients from Live Roles
    liveRoles.forEach(role => {
      if (role['Client']) clientSet.add(role['Client']);
    });
    
    // Get clients from Placements
    placements.forEach(placement => {
      if (placement['CLIENT']) clientSet.add(placement['CLIENT']);
    });

    // Add known clients from sheet names
    const knownClients = ['PMI', 'Toyota', 'Woolworths', 'Jagemiester', 'Astron Enegry', 
                          'Motus', 'Coty', 'NFVF', 'AVATAR', 'Marriot', 'VYE', 'Exxaro'];
    knownClients.forEach(client => clientSet.add(client));

    let clientsCount = 0;
    for (const clientName of clientSet) {
      const clientData = {
        company_name: clientName,
        industry: getIndustry(clientName),
        status: 'active',
        contact_name: 'TBD',
        contact_email: `contact@${clientName.toLowerCase().replace(/\s+/g, '')}.com`,
        contact_phone: 'TBD',
        company_size: 'medium'
      };

      const { error } = await supabase
        .from('clients')
        .insert(clientData);

      if (!error) {
        clientsCount++;
        console.log(`  ✅ Added client: ${clientName}`);
      } else if (!error.message.includes('duplicate')) {
        console.log(`  ❌ Error adding client: ${error.message}`);
      }
    }
    console.log(`✅ Migrated ${clientsCount} unique clients\n`);

    // Process client-specific sheets for pipeline data
    console.log('🔄 Processing Client Pipeline Data...');
    const clientSheets = ['PMI', 'Toyota', 'Woolworths - WC', 'Woolworths - KZN', 
                          'Woolworths - EC', 'Coty', 'Astron Enegry', 'Motus'];
    
    let pipelineCount = 0;
    for (const sheetName of clientSheets) {
      if (workbook.Sheets[sheetName]) {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        
        for (const candidate of data) {
          if (candidate['Name and Surname']) {
            const pipelineData = {
              submitted_by: candidate['Submitted by'] || 'TransEra',
              cv_submitted: candidate['Date'] ? new Date(candidate['Date']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              cv_accepted: candidate['Accepted'] === 'Yes' || candidate['CV']?.includes('Accept'),
              cv_declined: candidate['Declined'] === 'Yes',
              first_round: candidate['1st round'] ? new Date(candidate['1st round']).toISOString().split('T')[0] : null,
              testing_date: candidate['Testing'] ? new Date(candidate['Testing']).toISOString().split('T')[0] : null,
              second_round: candidate['2nd  round'] ? new Date(candidate['2nd  round']).toISOString().split('T')[0] : null,
              third_round: candidate['3rd round NA'] ? new Date(candidate['3rd round NA']).toISOString().split('T')[0] : null,
              role_play: candidate['Role Play'] ? new Date(candidate['Role Play']).toISOString().split('T')[0] : null,
              offered_date: candidate['Offered'] ? new Date(candidate['Offered']).toISOString().split('T')[0] : null,
              placement_fee: parseFloat(candidate['Fee']?.toString().replace(/[^0-9.-]+/g, '')) || 0,
              start_date: candidate['Start Date'] ? new Date(candidate['Start Date']).toISOString().split('T')[0] : null,
              current_stage: determineStage(candidate),
              notes: `Imported from ${sheetName} sheet`
            };

            // Note: You'll need to create candidates and link them properly
            // This is a simplified version
            pipelineCount++;
          }
        }
      }
    }
    console.log(`✅ Processed ${pipelineCount} pipeline entries\n`);

    console.log('🎉 Migration Complete!');
    console.log(`
Summary:
- Jobs: ${jobsCount}
- Placements: ${placementsCount}
- Clients: ${clientsCount}
- Pipeline Entries: ${pipelineCount}
    `);

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Helper function to determine industry
function getIndustry(clientName) {
  const industries = {
    'Woolworths': 'Retail',
    'Toyota': 'Automotive',
    'PMI': 'FMCG',
    'Coty': 'Cosmetics',
    'Marriot': 'Hospitality',
    'Astron': 'Energy',
    'Motus': 'Automotive',
    'NFVF': 'Entertainment',
    'Exxaro': 'Mining'
  };
  
  for (const [key, value] of Object.entries(industries)) {
    if (clientName.includes(key)) return value;
  }
  return 'Other';
}

// Helper function to determine current stage
function determineStage(candidate) {
  if (candidate['Start Date']) return 'Placed';
  if (candidate['Offered']) return 'Offer Stage';
  if (candidate['Role Play']) return 'Role Play';
  if (candidate['3rd round NA']) return '3rd Round';
  if (candidate['2nd  round']) return '2nd Round';
  if (candidate['Testing']) return 'Testing';
  if (candidate['1st round']) return '1st Round';
  if (candidate['Accepted']) return 'CV Accepted';
  if (candidate['Submitted CV']) return 'CV Submitted';
  return 'Sourcing';
}

// Run the migration
migrateExcelData();