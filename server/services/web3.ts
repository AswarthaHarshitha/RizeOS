// Web3 verification service for blockchain transactions

export interface TransactionVerification {
  isValid: boolean;
  amount: string;
  currency: string;
  network: string;
  timestamp: Date;
  fromAddress: string;
  toAddress: string;
  error?: string;
}

export interface PlatformFeeConfig {
  ethereum: { amount: "0.001", currency: "ETH" };
  polygon: { amount: "0.001", currency: "MATIC" };
  solana: { amount: "0.01", currency: "SOL" };
}

export const PLATFORM_FEES: PlatformFeeConfig = {
  ethereum: { amount: "0.001", currency: "ETH" },
  polygon: { amount: "0.001", currency: "MATIC" },
  solana: { amount: "0.01", currency: "SOL" },
};

export const PLATFORM_ADDRESSES = {
  ethereum: "0x742d35Cc6665C90532d8EcEc5D0E8eC41c1E8B96",
  polygon: "0x742d35Cc6665C90532d8EcEc5D0E8eC41c1E8B96",
  solana: "GvH8K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5",
};

/**
 * Verify a blockchain transaction for platform fee payment
 * In a production environment, this would connect to actual blockchain APIs
 * For the assessment, we'll simulate verification logic
 */
export async function verifyTransaction(
  txHash: string,
  expectedAmount: string,
  expectedCurrency: string,
  network: string
): Promise<TransactionVerification> {
  try {
    console.log(`Verifying transaction: ${txHash} for ${expectedAmount} ${expectedCurrency} on ${network}`);
    // Simulate transaction verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate different verification scenarios for demonstration
    const hashPrefix = txHash.substring(0, 4);
    
    // Simulate invalid transaction
    if (hashPrefix === "0x00" || txHash.length < 10) {
      return {
        isValid: false,
        amount: "0",
        currency: expectedCurrency,
        network,
        timestamp: new Date(),
        fromAddress: "",
        toAddress: "",
        error: "Transaction not found or invalid hash"
      };
    }

    // Simulate insufficient amount
    if (hashPrefix === "0x11") {
      return {
        isValid: false,
        amount: "0.0005",
        currency: expectedCurrency,
        network,
        timestamp: new Date(),
        fromAddress: "0x1234567890123456789012345678901234567890",
        toAddress: PLATFORM_ADDRESSES[network as keyof typeof PLATFORM_ADDRESSES] || "",
        error: "Insufficient payment amount"
      };
    }

    // Simulate successful verification
    return {
      isValid: true,
      amount: expectedAmount,
      currency: expectedCurrency,
      network,
      timestamp: new Date(),
      fromAddress: "0x1234567890123456789012345678901234567890",
      toAddress: PLATFORM_ADDRESSES[network as keyof typeof PLATFORM_ADDRESSES] || "",
    };

  } catch (error) {
    console.error("Transaction verification failed:", error);
    return {
      isValid: false,
      amount: "0",
      currency: expectedCurrency,
      network,
      timestamp: new Date(),
      fromAddress: "",
      toAddress: "",
      error: `Verification error: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
}

/**
 * Get the required platform fee for a specific network
 */
export function getPlatformFee(network: string): { amount: string; currency: string } {
  switch (network.toLowerCase()) {
    case "ethereum":
      return PLATFORM_FEES.ethereum;
    case "polygon":
      return PLATFORM_FEES.polygon;
    case "solana":
      return PLATFORM_FEES.solana;
    default:
      return PLATFORM_FEES.ethereum; // Default to Ethereum
  }
}

/**
 * Validate transaction hash format based on network
 */
export function validateTransactionHash(txHash: string, network: string): boolean {
  switch (network.toLowerCase()) {
    case "ethereum":
    case "polygon":
      // Ethereum/Polygon transaction hash format (0x + 64 hex characters)
      return /^0x[a-fA-F0-9]{64}$/.test(txHash);
    case "solana":
      // Solana transaction signature format (base58, 87-88 characters)
      return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(txHash);
    default:
      return false;
  }
}

/**
 * Format amount for display based on currency
 */
export function formatCurrencyAmount(amount: string, currency: string): string {
  const numAmount = parseFloat(amount);
  
  switch (currency.toLowerCase()) {
    case "eth":
    case "matic":
      return `${numAmount.toFixed(6)} ${currency.toUpperCase()}`;
    case "sol":
      return `${numAmount.toFixed(4)} ${currency.toUpperCase()}`;
    default:
      return `${numAmount} ${currency.toUpperCase()}`;
  }
}

/**
 * Check if a payment amount meets the minimum requirement
 */
export function isValidPaymentAmount(
  amount: string,
  currency: string,
  network: string
): boolean {
  const requiredFee = getPlatformFee(network);
  const paidAmount = parseFloat(amount);
  const requiredAmount = parseFloat(requiredFee.amount);
  
  return (
    currency.toLowerCase() === requiredFee.currency.toLowerCase() &&
    paidAmount >= requiredAmount
  );
}