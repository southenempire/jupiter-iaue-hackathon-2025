// Jupiter Arbitrage Bot - Hackathon Starter Template
// Fork this repo and find profitable arbitrage opportunities!

// ============================================
// CONFIGURATION
// ============================================
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const CHECK_INTERVAL = 10000; // Check every 10 seconds
const MIN_PROFIT_PERCENTAGE = 1.0; // Minimum 1% profit to alert

// Token pairs to monitor (add more as needed)
const TOKEN_PAIRS = [
  {
    name: 'SOL/USDC',
    tokenA: 'So11111111111111111111111111111111111112', // SOL
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'  // USDC
  },
  {
    name: 'SOL/USDT',
    tokenA: 'So11111111111111111111111111111111111112', // SOL
    tokenB: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'  // USDT
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get price data from Jupiter Price API
 * @param {string} tokenAddress - Token mint address
 */
async function getPrice(tokenAddress) {
  try {
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${tokenAddress}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }

    return data.data[tokenAddress];
  } catch (error) {
    console.error(`Error fetching price for ${tokenAddress}:`, error.message);
    return null;
  }
}

/**
 * Calculate potential arbitrage profit
 * @param {number} priceA - Price on exchange A
 * @param {number} priceB - Price on exchange B
 */
function calculateProfit(priceA, priceB) {
  const difference = Math.abs(priceA - priceB);
  const lowerPrice = Math.min(priceA, priceB);
  const profitPercentage = (difference / lowerPrice) * 100;

  return {
    difference,
    profitPercentage: profitPercentage.toFixed(2),
    buyFrom: priceA < priceB ? 'Exchange A' : 'Exchange B',
    sellTo: priceA < priceB ? 'Exchange B' : 'Exchange A'
  };
}

/**
 * Display opportunity in a formatted way
 */
function displayOpportunity(pair, priceA, priceB, profit) {
  const timestamp = new Date().toLocaleTimeString();
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log(`║  🚨 ARBITRAGE OPPORTUNITY DETECTED!   ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`💱 Pair: ${pair.name}`);
  console.log(`📊 Price A: $${priceA.toFixed(4)}`);
  console.log(`📊 Price B: $${priceB.toFixed(4)}`);
  console.log(`💰 Profit: ${profit.profitPercentage}%`);
  console.log(`🔄 Strategy: Buy from ${profit.buyFrom}, Sell to ${profit.sellTo}`);
  console.log('─────────────────────────────────────────\n');
}

/**
 * Monitor a single token pair for arbitrage opportunities
 */
async function monitorPair(pair) {
  try {
    // Fetch prices for both tokens
    const priceDataA = await getPrice(pair.tokenA);
    const priceDataB = await getPrice(pair.tokenB);

    if (!priceDataA || !priceDataB) {
      console.log(`⚠️  Could not fetch prices for ${pair.name}`);
      return;
    }

    const priceA = priceDataA.price;
    const priceB = priceDataB.price;

    // Calculate potential profit
    const profit = calculateProfit(priceA, priceB);

    // Alert if profit exceeds minimum threshold
    if (parseFloat(profit.profitPercentage) >= MIN_PROFIT_PERCENTAGE) {
      displayOpportunity(pair, priceA, priceB, profit);
    } else {
      // Show status update
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ${pair.name}: No opportunity (${profit.profitPercentage}% profit)`);
    }

  } catch (error) {
    console.error(`Error monitoring ${pair.name}:`, error.message);
  }
}

/**
 * Monitor all token pairs continuously
 */
async function monitorAllPairs() {
  console.log('🔍 Starting arbitrage monitoring...\n');
  console.log(`📊 Monitoring ${TOKEN_PAIRS.length} pairs`);
  console.log(`⏱️  Check interval: ${CHECK_INTERVAL / 1000} seconds`);
  console.log(`💰 Min profit threshold: ${MIN_PROFIT_PERCENTAGE}%\n`);
  console.log('─────────────────────────────────────────\n');

  // Check all pairs immediately
  for (const pair of TOKEN_PAIRS) {
    await monitorPair(pair);
  }

  // Then check periodically
  setInterval(async () => {
    console.log('\n🔄 Refreshing prices...\n');
    for (const pair of TOKEN_PAIRS) {
      await monitorPair(pair);
    }
  }, CHECK_INTERVAL);
}

// ============================================
// MAIN PROGRAM
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Jupiter Arbitrage Bot (DEMO)        ║');
  console.log('║   IAUE Campus Hackathon 2025          ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Start monitoring
  await monitorAllPairs();
}

// Run the bot
main();

// ============================================
// TODO: STUDENTS IMPLEMENT THESE FEATURES
// ============================================

// 1. Add multi-DEX price comparison
//    - Fetch prices from Orca, Raydium, Meteora separately
//    - Compare prices across all DEXs
//    - Find the best arbitrage route

// 2. Add automatic trade execution
//    - Connect to user's Solana wallet
//    - Execute trades when profitable opportunities are found
//    - Handle transaction confirmation

// 3. Add profit tracking
//    - Save all detected opportunities to a database/file
//    - Calculate historical profit if trades were executed
//    - Generate daily/weekly reports

// 4. Add gas fee calculation
//    - Factor in transaction fees
//    - Calculate net profit after fees
//    - Only alert if profit exceeds fees + minimum threshold

// 5. Add notification system
//    - Send alerts via Telegram/Discord webhook
//    - Email notifications for large opportunities
//    - Browser notifications (if running as web app)

// 6. Add risk management
//    - Set maximum trade size
//    - Implement stop-loss mechanisms
//    - Add circuit breakers for abnormal market conditions

// ============================================
// BONUS CHALLENGES (For Advanced Students)
// ============================================

// 1. Implement flash loan arbitrage
// 2. Add support for triangle arbitrage (A → B → C → A)
// 3. Create a web dashboard to visualize opportunities
// 4. Add machine learning to predict optimal trading times
// 5. Implement backtesting using historical price data
