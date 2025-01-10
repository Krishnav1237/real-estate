import { useContract, usePublicClient, useWalletClient } from 'wagmi';
import { REAL_ESTATE_TOKEN_ABI, REAL_ESTATE_MARKETPLACE_ABI } from '../config/abis';
import { REAL_ESTATE_TOKEN_ADDRESS, REAL_ESTATE_MARKETPLACE_ADDRESS } from '../config/addresses';

export function useRealEstateToken() {
  return useContract({
    address: REAL_ESTATE_TOKEN_ADDRESS,
    abi: REAL_ESTATE_TOKEN_ABI,
  });
}

export function useRealEstateMarketplace() {
  return useContract({
    address: REAL_ESTATE_MARKETPLACE_ADDRESS,
    abi: REAL_ESTATE_MARKETPLACE_ABI,
  });
}

export function usePublicProvider() {
  return usePublicClient();
}

export function useWallet() {
  return useWalletClient();
} 