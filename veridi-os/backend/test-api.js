const http = require("http");

const BASE_URL = "http://localhost:4000";
const ENDPOINTS = [
  { path: "/health", method: "GET", name: "Health Check" },
  { path: "/", method: "GET", name: "Root Endpoint" },
  { path: "/api/data", method: "GET", name: "Power Plant Data" },
  { path: "/api/reports/eu-ets", method: "GET", name: "EU ETS Report" },
];

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

async function testEndpoint(endpoint) {
  const options = {
    hostname: "localhost",
    port: 4000,
    path: endpoint.path,
    method: endpoint.method,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Veridi-OS-API-Test/1.0",
    },
  };

  try {
    console.log(`${colors.cyan}Testing ${endpoint.name}...${colors.reset}`);
    console.log(
      `${colors.blue}${endpoint.method} ${endpoint.path}${colors.reset}`
    );

    const response = await makeRequest(options);

    if (response.statusCode === 200) {
      console.log(
        `${colors.green}✓ Success (${response.statusCode})${colors.reset}`
      );

      // Display response data for key endpoints
      if (endpoint.path === "/api/data") {
        console.log(
          `${colors.yellow}Data points: ${response.data.length}${colors.reset}`
        );
        if (response.data.length > 0) {
          console.log(`${colors.yellow}Sample data:${colors.reset}`);
          console.log(JSON.stringify(response.data[0], null, 2));
        }
      } else if (endpoint.path === "/api/reports/eu-ets") {
        console.log(`${colors.yellow}Report data:${colors.reset}`);
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        console.log(`${colors.yellow}Response:${colors.reset}`);
        console.log(JSON.stringify(response.data, null, 2));
      }
    } else {
      console.log(
        `${colors.red}✗ Failed (${response.statusCode})${colors.reset}`
      );
      console.log(
        `${colors.red}Response: ${JSON.stringify(response.data)}${colors.reset}`
      );
    }

    return response.statusCode === 200;
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function runTests() {
  console.log(
    `${colors.bright}${colors.magenta}Veridi OS API Test Suite${colors.reset}`
  );
  console.log(`${colors.blue}Base URL: ${BASE_URL}${colors.reset}`);
  console.log(
    `${colors.blue}Testing ${ENDPOINTS.length} endpoints...${colors.reset}\n`
  );

  const results = [];

  for (const endpoint of ENDPOINTS) {
    const success = await testEndpoint(endpoint);
    results.push({ endpoint: endpoint.name, success });
    console.log(""); // Empty line for readability
  }

  // Summary
  console.log(`${colors.bright}${colors.magenta}Test Summary${colors.reset}`);
  console.log(`${colors.blue}${"=".repeat(50)}${colors.reset}`);

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  results.forEach((result) => {
    const status = result.success
      ? `${colors.green}✓ PASS${colors.reset}`
      : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(`${result.endpoint}: ${status}`);
  });

  console.log(`${colors.blue}${"=".repeat(50)}${colors.reset}`);
  console.log(
    `${colors.bright}Total: ${passed} passed, ${failed} failed${colors.reset}`
  );

  if (failed === 0) {
    console.log(
      `${colors.green}${colors.bright}All tests passed! 🎉${colors.reset}`
    );
    process.exit(0);
  } else {
    console.log(
      `${colors.red}${colors.bright}Some tests failed! ❌${colors.reset}`
    );
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await makeRequest({
      hostname: "localhost",
      port: 4000,
      path: "/health",
      method: "GET",
    });

    if (response.statusCode === 200) {
      console.log(`${colors.green}Server is running!${colors.reset}\n`);
      return true;
    }
  } catch (error) {
    console.log(
      `${colors.red}Server is not running or not accessible.${colors.reset}`
    );
    console.log(
      `${colors.yellow}Please start the server with: npm run dev${colors.reset}`
    );
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();

  if (serverRunning) {
    await runTests();
  } else {
    process.exit(1);
  }
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error(
    `${colors.red}Uncaught Exception: ${error.message}${colors.reset}`
  );
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `${colors.red}Unhandled Rejection at: ${promise}, reason: ${reason}${colors.reset}`
  );
  process.exit(1);
});

// Run the tests
main();
