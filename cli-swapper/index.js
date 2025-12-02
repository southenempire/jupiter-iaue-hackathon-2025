// Jupiter CLI Token Swapper - Hackathon Starter Template
// Fork this repo and build your own token swapper!

const readline = require('readline');

// ============================================
// CONFIGURATION
// ============================================
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'; // You can use a different RPC

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a quote from Jupiter for swapping tokens
 * @param {string} inputMint - Input token mint address
 * @param {string} outputMint - Output token mint address
 * @param {number} amount - Amount to swap (in smallest unit, e.g., lamports for SOL)
 */
async function getQuote(inputMint, outputMint, amount) {
  try {
    const params = new URLSearchParams({
      inputMint: inputMint,
      outputMint: outputMint,
      amount: amount.toString(),
      slippageBps: '50' // 0.5% slippage
    });

    const response = await fetch(`${JUPITER_QUOTE_API}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get quote');
    }

    return data;
  } catch (error) {
    console.error('Error getting quote:', error.message);
    return null;
  }
}

/**
 * Display quote information in a readable format
 */
function displayQuote(quote) {
  if (!quote) {
    console.log('❌ No quote available\n');
    return;
  }

  console.log('\n✅ Quote Retrieved:');
  console.log('─────────────────────────────────────');
  console.log(`Input Amount: ${quote.inAmount}`);
  console.log(`Output Amount: ${quote.outAmount}`);
  console.log(`Price Impact: ${quote.priceImpactPct}%`);
  console.log(`Route Plan: ${quote.routePlan.length} step(s)`);
  console.log('─────────────────────────────────────\n');

  // Display route details
  console.log('🔀 Route Details:');
  quote.routePlan.forEach((step, index) => {
    console.log(`  Step ${index + 1}: ${step.swapInfo.label}`);
  });
  console.log('\n');
}

/**
 * Create a user-friendly CLI interface
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Prompt user for input
 */
function question(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// ============================================
// MAIN PROGRAM
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Jupiter CLI Token Swapper (DEMO)    ║');
  console.log('║   IAUE Campus Hackathon 2025          ║');
  console.log('╚════════════════════════════════════════╝\n');

  const rl = createInterface();

  try {
    // Common token addresses (for demo purposes)
    console.log('📝 Common Token Addresses:');
    console.log('SOL: So11111111111111111111111111111111111112');
    console.log('USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    console.log('USDT: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB\n');

    // Get input token
    const inputMint = await question(rl, '🔹 Enter input token mint address: ');
    
    // Get output token
    const outputMint = await question(rl, '🔹 Enter output token mint address: ');
    
    // Get amount
    const amountStr = await question(rl, '🔹 Enter amount (in smallest unit, e.g., lamports): ');
    const amount = parseInt(amountStr);

    if (isNaN(amount) || amount <= 0) {
      console.log('❌ Invalid amount. Please enter a positive number.');
      rl.close();
      return;
    }

    console.log('\n⏳ Fetching quote from Jupiter...\n');

    // Get and display quote
    const quote = await getQuote(inputMint, outputMint, amount);
    displayQuote(quote);

    // ============================================
    // TODO: STUDENTS IMPLEMENT THESE FEATURES
    // ============================================
    
    // 1. Add swap execution functionality
    // - Use Jupiter Swap API to execute the trade
    // - Handle transaction signing with user's wallet
    // - Display transaction confirmation
    
    // 2. Add price comparison across different routes
    // - Fetch multiple route options
    // - Display pros/cons of each route
    // - Let user choose their preferred route
    
    // 3. Add error handling and retry logic
    // - Handle API failures gracefully
    // - Implement retry mechanism for failed requests
    // - Display clear error messages to users
    
    // 4. Add transaction history tracking
    // - Save completed swaps to a local file
    // - Display past swap history
    // - Calculate total fees spent
    
    // 5. Add real-time price monitoring
    // - Continuously fetch prices for a token pair
    // - Alert when price hits a certain threshold
    // - Display price charts in terminal

    console.log('💡 Next Steps:');
    console.log('  1. Implement swap execution');
    console.log('  2. Add wallet connection');
    console.log('  3. Handle errors and edge cases');
    console.log('  4. Add advanced features (history, monitoring, etc.)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the program
main();

// ============================================
// BONUS CHALLENGES (For Advanced Students)
// ============================================

// 1. Add support for multiple wallets
// 2. Implement DCA (Dollar Cost Averaging) scheduling
// 3. Add colored terminal output with 'chalk' library
// 4. Create a config file for saving preferences
// 5. Add unit tests for all functions
