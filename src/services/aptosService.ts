// src/services/aptosService.ts
import { AptosClient, Types } from 'aptos'; // Using the original 'aptos' package

// Initialize the client with Movement blockchain endpoint
const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL || 'https://aptos.testnet.bardock.movementlabs.xyz/v1');

// Define marketplace contract address
const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS || '0xd5ff7fd86cd844e54533482fbca61e5b2a7159242d5fff1cc16337c75fac4b59';

// Token type for APT coin
const APT_COIN_TYPE = '0x1::aptos_coin::AptosCoin';

// Type definitions
interface AccountResource {
    type: string;
    data: Record<string, unknown>;
}

interface ListingDetails {
    seller: string;
    price: number;
    name: string;
    description: string;
    imageUrl: string;
    status: number;
    createdAt: number;
    isActive: boolean;
}

interface MockListing {
    id: string;
    title: string;
    location: string;
    price: number;
    area: number;
    imageUrl: string;
    tokenPrice: number;
    totalTokens: number;
    availableTokens: number;
    verified: boolean;
    expectedReturn: number;
    investmentPeriod: string;
    description?: string;
    seller?: string;
    source?: 'blockchain' | 'mock';
}

interface ListItemEventData {
    listing_id: string;
    seller: string;
    price: string;
    name: string;
    timestamp: string;
}

// Add Petra wallet types
declare global {
    interface Window {
        aptos?: {
            account(): Promise<{ address: string }>;
            isConnected(): Promise<boolean>;
            connect(): Promise<{ address: string }>;
            disconnect(): Promise<void>;
            signAndSubmitTransaction(transaction: Types.EntryFunctionPayload): Promise<{ hash: string }>;
            network?(): Promise<string>;
        }
    }
}

class AptosService {
    // Check if Petra wallet is installed
    isPetraInstalled(): boolean {
        return window.aptos !== undefined;
    }

    // Connect to Petra wallet
    async connectPetra(): Promise<string> {
        if (!this.isPetraInstalled()) {
            throw new Error("Petra wallet is not installed");
        }

        try {
            const response = await window.aptos!.connect();
            return response.address;
        } catch (error) {
            console.error("Error connecting to Petra wallet:", error);
            throw new Error("Failed to connect to Petra wallet");
        }
    }

    // Disconnect from Petra wallet
    async disconnectPetra(): Promise<void> {
        if (!this.isPetraInstalled()) {
            throw new Error("Petra wallet is not installed");
        }

        try {
            await window.aptos!.disconnect();
        } catch (error) {
            console.error("Error disconnecting from Petra wallet:", error);
            throw new Error("Failed to disconnect from Petra wallet");
        }
    }

    // Get Petra wallet account address
    async getPetraAccount(): Promise<string> {
        if (!this.isPetraInstalled()) {
            throw new Error("Petra wallet is not installed");
        }

        try {
            const account = await window.aptos!.account();
            return account.address;
        } catch (error) {
            console.error("Error getting Petra account:", error);
            throw new Error("Failed to get Petra wallet account");
        }
    }

    // Sign and submit transaction with Petra wallet
    async signAndSubmitTransactionWithPetra(payload: Types.EntryFunctionPayload): Promise<string> {
        if (!this.isPetraInstalled()) {
            throw new Error("Petra wallet is not installed");
        }

        try {
            const response = await window.aptos!.signAndSubmitTransaction(payload);
            await client.waitForTransaction(response.hash);
            return response.hash;
        } catch (error) {
            console.error("Error submitting transaction with Petra:", error);
            throw error;
        }
    }
    getMarketplaceAddress(): string {
        return MARKETPLACE_ADDRESS;
    }

    // Initialize marketplace contract with Petra wallet
    async initializeMarketplaceWithPetra(feePercentage: number): Promise<string> {
        if (!this.isPetraInstalled()) {
            throw new Error("Petra wallet is not installed");
        }

        const isConnected = await window.aptos?.isConnected();
        if (!isConnected) {
            throw new Error("Petra wallet is not connected. Please connect your wallet first.");
        }

        const payload: Types.EntryFunctionPayload = {
            function: `${MARKETPLACE_ADDRESS}::marketplace::initialize`,
            type_arguments: [],
            arguments: [feePercentage],
        };

        return this.signAndSubmitTransactionWithPetra(payload);
    }

    // List an item for sale using Petra wallet
    async listItemWithPetra(
        price: number,
        name: string,
        description: string,
        imageUrl: string,
        coinType: string = APT_COIN_TYPE
    ): Promise<string> {
        const payload: Types.EntryFunctionPayload = {
            function: `${MARKETPLACE_ADDRESS}::marketplace::list_item`,
            type_arguments: [coinType],
            arguments: [price, name, description, imageUrl, MARKETPLACE_ADDRESS],
        };

        return this.signAndSubmitTransactionWithPetra(payload);
    }

    // Buy an item using Petra wallet
    async buyItemWithPetra(
        listingId: number,
        coinType: string = APT_COIN_TYPE
    ): Promise<string> {
        const payload: Types.EntryFunctionPayload = {
            function: `${MARKETPLACE_ADDRESS}::marketplace::buy_item`,
            type_arguments: [coinType],
            arguments: [listingId, MARKETPLACE_ADDRESS],
        };

        return this.signAndSubmitTransactionWithPetra(payload);
    }

    // Cancel a listing with Petra wallet
    async cancelListingWithPetra(listingId: number): Promise<string> {
        const payload: Types.EntryFunctionPayload = {
            function: `${MARKETPLACE_ADDRESS}::marketplace::cancel_listing`,
            type_arguments: [],
            arguments: [listingId, MARKETPLACE_ADDRESS],
        };

        return this.signAndSubmitTransactionWithPetra(payload);
    }

    // Update marketplace fee percentage with Petra wallet
    async updateFeePercentageWithPetra(newFeePercentage: number): Promise<string> {
        const payload: Types.EntryFunctionPayload = {
            function: `${MARKETPLACE_ADDRESS}::marketplace::update_fee_percentage`,
            type_arguments: [],
            arguments: [newFeePercentage, MARKETPLACE_ADDRESS],
        };

        return this.signAndSubmitTransactionWithPetra(payload);
    }

    // Set marketplace paused/unpaused state with Petra wallet
    async setMarketplacePausedWithPetra(isPaused: boolean): Promise<string> {
        const payload: Types.EntryFunctionPayload = {
            function: `${MARKETPLACE_ADDRESS}::marketplace::set_paused`,
            type_arguments: [],
            arguments: [isPaused, MARKETPLACE_ADDRESS],
        };

        return this.signAndSubmitTransactionWithPetra(payload);
    }

    // View functions for querying the blockchain
    async getAllListings(): Promise<MockListing[]> {
        try {
            // Check if the marketplace resource exists
            const resources = await client.getAccountResources(MARKETPLACE_ADDRESS);
            const marketplaceResource = resources.find(
                r => r.type === `${MARKETPLACE_ADDRESS}::marketplace::MarketplaceData`
            );

            if (!marketplaceResource) {
                console.log("Marketplace resource not found");
                return [];
            }

            // Get listing events from the marketplace
            const events = await client.getEventsByEventHandle(
                MARKETPLACE_ADDRESS,
                `${MARKETPLACE_ADDRESS}::marketplace::MarketplaceData`,
                "list_item_events"
            );

            // Convert events to MockListing format
            const listings: MockListing[] = [];

            for (const event of events) {
                const data = event.data as ListItemEventData;
                const listingDetails = await this.getListingDetails(Number(data.listing_id));

                // Only include active listings
                if (listingDetails && listingDetails.isActive) {
                    listings.push({
                        id: data.listing_id,
                        title: listingDetails.name,
                        location: "On-chain Property", // Default location
                        price: listingDetails.price,
                        area: 1000, // Default area
                        imageUrl: listingDetails.imageUrl,
                        tokenPrice: listingDetails.price / 1000, // Simplified token price calculation
                        totalTokens: 1000,
                        availableTokens: 1000,
                        verified: true,
                        expectedReturn: 10, // Default expected return
                        investmentPeriod: "1 year", // Default investment period
                        description: listingDetails.description,
                        seller: listingDetails.seller,
                        source: 'blockchain'
                    });
                }
            }

            console.log(`Found ${listings.length} active blockchain listings`);
            return listings;
        } catch (error) {
            console.error("Error fetching blockchain listings:", error);
            return this.getMockListings();
        }
    }

    async getListingDetails(listingId: number): Promise<ListingDetails | null> {
        try {
            const result = await client.view({
                function: `${MARKETPLACE_ADDRESS}::marketplace::get_listing_details`,
                type_arguments: [],
                arguments: [MARKETPLACE_ADDRESS, listingId.toString()],
            });

            if (result && result.length >= 7) {
                const [seller, price, name, description, imageUrl, status, createdAt] = result;
                return {
                    seller: seller as string,
                    price: Number(price),
                    name: name as string,
                    description: description as string,
                    imageUrl: imageUrl as string,
                    status: Number(status),
                    createdAt: Number(createdAt),
                    isActive: Number(status) === 1
                };
            }
            return null;
        } catch (error) {
            console.error("Error getting listing details:", error);
            return null;
        }
    }

    async isListingActive(listingId: number): Promise<boolean> {
        try {
            const result = await client.view({
                function: `${MARKETPLACE_ADDRESS}::marketplace::is_listing_active`,
                type_arguments: [],
                arguments: [MARKETPLACE_ADDRESS, listingId],
            });

            return Boolean(result[0]);
        } catch (error) {
            console.error("Error checking if listing is active:", error);
            return false;
        }
    }

    async getFeePercentage(): Promise<number> {
        try {
            const result = await client.view({
                function: `${MARKETPLACE_ADDRESS}::marketplace::get_fee_percentage`,
                type_arguments: [],
                arguments: [MARKETPLACE_ADDRESS],
            });

            return Number(result[0]) / 100; // Convert basis points to percentage
        } catch (error) {
            console.error("Error getting fee percentage:", error);
            return 0;
        }
    }

    async getAccountResources(address: string): Promise<AccountResource[]> {
        try {
            return await client.getAccountResources(address);
        } catch (error) {
            console.error("Error getting account resources:", error);
            return [];
        }
    }

    async getAccountBalance(address: string, coinType: string = APT_COIN_TYPE): Promise<number> {
        try {
            const resources = await client.getAccountResources(address);
            const coinResource = resources.find((r) => r.type === `0x1::coin::CoinStore<${coinType}>`) as AccountResource | undefined;

            if (coinResource && typeof coinResource.data === 'object' && coinResource.data !== null) {
                const data = coinResource.data as { coin: { value: string } };
                return Number(data.coin.value) / 100_000_000; // Convert octas to APT
            }
            return 0;
        } catch (error) {
            console.error("Error getting account balance:", error);
            return 0;
        }
    }

    // Mock listings for testing/demo
    getMockListings(limit: number = 10): MockListing[] {
        const mockListings: MockListing[] = [
            {
                id: '1',
                title: 'Luxury Penthouse in Miami',
                location: 'Miami Beach, FL',
                price: 2500000,
                area: 4500,
                imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
                tokenPrice: 0.15,
                totalTokens: 1000,
                availableTokens: 750,
                verified: true,
                expectedReturn: 12.5,
                investmentPeriod: '5 years',
                source: 'mock'
            },
            // Add more mock listings as needed
        ];

        return mockListings.slice(0, limit);
    }
}

const aptosService = new AptosService();
export default aptosService;