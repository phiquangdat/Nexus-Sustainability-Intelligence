const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

// Test configuration
const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    url: '/api/health',
    expectedStatus: 200
  },
  {
    name: 'Root Endpoint',
    method: 'GET',
    url: '/',
    expectedStatus: 200
  },
  {
    name: 'Get Power Plant Data',
    method: 'GET',
    url: '/api/data',
    expectedStatus: 200
  },
  {
    name: 'Get Power Plant Data with Limit',
    method: 'GET',
    url: '/api/data?limit=5',
    expectedStatus: 200
  },
  {
    name: 'Get Power Plants Summary',
    method: 'GET',
    url: '/api/plants/summary',
    expectedStatus: [200, 503] // 503 if Supabase not configured
  },
  {
    name: 'Get Recent Emissions',
    method: 'GET',
    url: '/api/emissions/recent',
    expectedStatus: [200, 503] // 503 if Supabase not configured
  },
  {
    name: 'Generate EU ETS Report (POST)',
    method: 'POST',
    url: '/api/reports/eu-ets',
    data: {
      startDate: '2024-07-01',
      endDate: '2024-10-01'
    },
    expectedStatus: 200
  },
  {
    name: 'Get EU ETS Reports',
    method: 'GET',
    url: '/api/reports/eu-ets',
    expectedStatus: [200, 503] // 503 if Supabase not configured
  },
  {
    name: 'Legacy Health Check',
    method: 'GET',
    url: '/health',
    expectedStatus: 200
  }
];

async function runTests() {
  console.log('🧪 Starting Veridi OS Backend API Tests\n');
  
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        timeout: 5000
      };

      if (test.data) {
        config.data = test.data;
        config.headers = { 'Content-Type': 'application/json' };
      }

      const response = await axios(config);
      
      const expectedStatuses = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus 
        : [test.expectedStatus];
      
      if (expectedStatuses.includes(response.status)) {
        console.log(`✅ PASS - Status: ${response.status}`);
        passed++;
        
        // Log response data for key endpoints
        if (test.url === '/' || test.url === '/api/health') {
          console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        }
      } else {
        console.log(`❌ FAIL - Expected status ${test.expectedStatus}, got ${response.status}`);
        failed++;
      }
    } catch (error) {
      const expectedStatuses = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus 
        : [test.expectedStatus];
      
      if (expectedStatuses.includes(error.response?.status)) {
        console.log(`✅ PASS - Expected error status: ${error.response.status}`);
        passed++;
      } else {
        console.log(`❌ FAIL - ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        failed++;
      }
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Test database connection specifically
async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('Database Status:', response.data.database);
    
    if (response.data.database.connected) {
      console.log('✅ Database connection successful!');
      
      // Test a few database-dependent endpoints
      try {
        const dataResponse = await axios.get(`${BASE_URL}/api/data?limit=1`);
        console.log('✅ Power plant data endpoint working');
        console.log(`   Sample record: ${JSON.stringify(dataResponse.data[0], null, 2)}`);
      } catch (error) {
        console.log('⚠️  Power plant data endpoint issue:', error.message);
      }
    } else {
      console.log('⚠️  Database not configured - using mock data fallback');
    }
  } catch (error) {
    console.log('❌ Database connection test failed:', error.message);
  }
}

// Main execution
async function main() {
  try {
    await runTests();
    await testDatabaseConnection();
  } catch (error) {
    console.error('Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { runTests, testDatabaseConnection };
