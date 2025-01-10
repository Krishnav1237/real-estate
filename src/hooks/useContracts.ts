import { useContractRead, useContractWrite, useWalletClient } from 'wagmi';
import { REAL_ESTATE_TOKEN_ABI, REAL_ESTATE_MARKETPLACE_ABI } from '../config/abis';
import { REAL_ESTATE_TOKEN_ADDRESS, REAL_ESTATE_MARKETPLACE_ADDRESS } from '../config/addresses';

export function useContracts() {
  const { data: walletClient } = useWalletClient();

  const tokenContract = {
    read: useContractRead({
      address: REAL_ESTATE_TOKEN_ADDRESS,
      abi: REAL_ESTATE_TOKEN_ABI,
    }),
    write: useContractWrite({
      address: REAL_ESTATE_TOKEN_ADDRESS,
      abi: REAL_ESTATE_TOKEN_ABI,
    }),
  };

  const marketplaceContract = {
    read: useContractRead({
      address: REAL_ESTATE_MARKETPLACE_ADDRESS,
      abi: REAL_ESTATE_MARKETPLACE_ABI,
    }),
    write: useContractWrite({
      address: REAL_ESTATE_MARKETPLACE_ADDRESS,
      abi: REAL_ESTATE_MARKETPLACE_ABI,
    }),
  };

  return {
    tokenContract,
    marketplaceContract,
  };
} 