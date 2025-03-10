// src/hooks/useContracts.ts
import { useState, useCallback } from 'react';
import aptosService from '../services/aptosService';
import { AptosAccount } from 'aptos';

// Interface for the marketplace contract
export function useMarketplace() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const listItem = useCallback(
      async (
          account: AptosAccount,
          price: number,
          name: string,
          description: string,
          imageUrl: string
      ) => {
        setLoading(true);
        setError(null);
        try {
          const txHash = await aptosService.listItem(
              account,
              price,
              name,
              description,
              imageUrl
          );
          setLoading(false);
          return txHash;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
          throw err;
        }
      },
      []
  );

  const buyItem = useCallback(
      async (account: AptosAccount, listingId: number) => {
        setLoading(true);
        setError(null);
        try {
          const txHash = await aptosService.buyItem(account, listingId);
          setLoading(false);
          return txHash;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
          throw err;
        }
      },
      []
  );

  const cancelListing = useCallback(
      async (account: AptosAccount, listingId: number) => {
        setLoading(true);
        setError(null);
        try {
          const txHash = await aptosService.cancelListing(account, listingId);
          setLoading(false);
          return txHash;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
          throw err;
        }
      },
      []
  );

  const getListingDetails = useCallback(
      async (listingId: number) => {
        setLoading(true);
        setError(null);
        try {
          const details = await aptosService.getListingDetails(listingId);
          setLoading(false);
          return details;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
          throw err;
        }
      },
      []
  );

  const getMockListings = useCallback(
      async (limit?: number) => {
        setLoading(true);
        setError(null);
        try {
          const listings = await aptosService.getMockListings(limit);
          setLoading(false);
          return listings;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
          throw err;
        }
      },
      []
  );

  return {
    listItem,
    buyItem,
    cancelListing,
    getListingDetails,
    getMockListings,
    loading,
    error
  };
}

// Also, fix the Aptos Service so it doesn't rely on process.env in browser
export function fixAptosServiceEnvIssue() {
  // In environments where process.env isn't available, you would need to use
  // a different approach to configure environment variables

  // Note: This is a utility function to explain the issue.
  // The actual fix should be in aptosService.ts by replacing:
  // const NODE_URL = process.env.REACT_APP_APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1';
  // with:
  // const NODE_URL = window.ENV?.REACT_APP_APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1';

  return {
    message: "The aptosService.ts file needs to be modified to handle environment variables in a browser-compatible way"
  };
}