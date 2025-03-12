// src/services/marketplaceService.ts
import aptosService from './aptosService';
import polygonService from './polygonService';
import { BlockchainType } from '../hooks/useMultiChainWallet';

// Unified listing type
export interface UnifiedListing {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    seller: string;
    source: 'aptos' | 'polygon' | 'mock';
    status?: number;
    createdAt?: number;
    tokenPrice?: number;
    totalTokens?: number;
    availableTokens?: number;
    verified?: boolean;
    expectedReturn?: number;
    investmentPeriod?: string;
    location?: string;
    area?: number;
}

class MarketplaceService {
    // Fix for src/services/marketplaceService.ts
    async getAllListings(): Promise<UnifiedListing[]> {
        try {
            // Get listings from Aptos
            const aptosListings = await aptosService.getAllListings();

            // Convert Aptos listings to UnifiedListing format, ensuring all required fields are present
            return aptosListings.map(listing => ({
                id: listing.id,
                title: listing.title || '', // Ensure title is a string
                description: listing.description || '', // Ensure description is a string
                price: listing.price,
                imageUrl: listing.imageUrl,
                seller: listing.seller || '', // Ensure seller is a string
                source: 'aptos' as const,
                // Pass through optional properties if they exist
                tokenPrice: listing.tokenPrice,
                totalTokens: listing.totalTokens,
                availableTokens: listing.availableTokens,
                verified: listing.verified,
                expectedReturn: listing.expectedReturn,
                investmentPeriod: listing.investmentPeriod,
                location: listing.location,
                area: listing.area
            }));
        } catch (error) {
            console.error("Error fetching listings:", error);
            return [];
        }
    }

    async listItem(
        chain: BlockchainType,
        price: number,
        name: string,
        description: string,
        imageUrl: string
    ): Promise<string> {
        if (chain === 'aptos') {
            return aptosService.listItemWithPetra(price, name, description, imageUrl);
        } else {
            return polygonService.listItemWithMetaMask(price, name, description, imageUrl);
        }
    }

    async buyItem(chain: BlockchainType, listingId: number): Promise<string> {
        if (chain === 'aptos') {
            return aptosService.buyItemWithPetra(listingId);
        } else {
            return polygonService.buyItemWithMetaMask(listingId);
        }
    }

    async cancelListing(chain: BlockchainType, listingId: number): Promise<string> {
        if (chain === 'aptos') {
            return aptosService.cancelListingWithPetra(listingId);
        } else {
            return polygonService.cancelListingWithMetaMask(listingId);
        }
    }

    async getBalance(chain: BlockchainType, address: string): Promise<number> {
        if (chain === 'aptos') {
            return aptosService.getAccountBalance(address);
        } else {
            return polygonService.getBalance(address);
        }
    }
}

const marketplaceService = new MarketplaceService();
export default marketplaceService;