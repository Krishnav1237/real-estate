module marketplace::marketplace {
    use std::error;
    use std::signer;
    use std::string::String;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_std::table::{Self, Table};
    use aptos_std::event::{Self, EventHandle};

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_AUTHORIZED: u64 = 3;
    const E_LISTING_DOESNT_EXIST: u64 = 4;
    const E_INVALID_PRICE: u64 = 5;
    const E_INSUFFICIENT_FUNDS: u64 = 6;
    const E_LISTING_ALREADY_EXISTS: u64 = 7;
    const E_MARKETPLACE_PAUSED: u64 = 8;

    // Listing status
    const LISTING_STATUS_ACTIVE: u8 = 1;
    const LISTING_STATUS_SOLD: u8 = 2;
    const LISTING_STATUS_CANCELLED: u8 = 3;

    struct Listing has store, drop {
        id: u64,
        seller: address,
        price: u64,
        name: String,
        description: String,
        image_url: String,
        status: u8,
        created_at: u64,
        updated_at: u64
    }

    struct MarketplaceData has key {
        admin: address,
        fee_percentage: u64,  // Represented as basis points (1% = 100)
        signer_cap: SignerCapability,
        listings_count: u64,
        is_paused: bool,
        listings: Table<u64, Listing>,
        // Events
        list_item_events: EventHandle<ListItemEvent>,
        buy_item_events: EventHandle<BuyItemEvent>,
        cancel_listing_events: EventHandle<CancelListingEvent>,
    }

    // Events
    struct ListItemEvent has drop, store {
        listing_id: u64,
        seller: address,
        price: u64,
        name: String,
        timestamp: u64,
    }

    struct BuyItemEvent has drop, store {
        listing_id: u64,
        seller: address,
        buyer: address,
        price: u64,
        name: String,
        timestamp: u64,
    }

    struct CancelListingEvent has drop, store {
        listing_id: u64,
        seller: address,
        timestamp: u64,
    }

    // Initialize marketplace
    public entry fun initialize(
        admin: &signer,
        fee_percentage: u64,
    ) {
        let admin_addr = signer::address_of(admin);

        assert!(!exists<MarketplaceData>(admin_addr), error::already_exists(E_ALREADY_INITIALIZED));
        assert!(fee_percentage <= 1000, error::invalid_argument(E_INVALID_PRICE)); // Max fee 10%

        // Create resource account
        let seed = vector[];  // Using vector literal instead of vector::empty<u8>()
        let (resource_signer, resource_signer_cap) = account::create_resource_account(admin, seed);

        // Create and move MarketplaceData to admin's account
        move_to(admin, MarketplaceData {
            admin: admin_addr,
            fee_percentage,
            signer_cap: resource_signer_cap,
            listings_count: 0,
            is_paused: false,
            listings: table::new<u64, Listing>(),
            list_item_events: account::new_event_handle<ListItemEvent>(admin),
            buy_item_events: account::new_event_handle<BuyItemEvent>(admin),
            cancel_listing_events: account::new_event_handle<CancelListingEvent>(admin),
        });
    }

    // List an item for sale
    public entry fun list_item<CoinType>(
        seller: &signer,
        price: u64,
        name: String,
        description: String,
        image_url: String,
        marketplace_addr: address,
    ) acquires MarketplaceData {
        let seller_addr = signer::address_of(seller);

        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global_mut<MarketplaceData>(marketplace_addr);

        // Check if marketplace is paused
        assert!(!marketplace_data.is_paused, error::invalid_state(E_MARKETPLACE_PAUSED));

        // Validate price
        assert!(price > 0, error::invalid_argument(E_INVALID_PRICE));

        // Create new listing
        let listing_id = marketplace_data.listings_count + 1;

        let listing = Listing {
            id: listing_id,
            seller: seller_addr,
            price,
            name: name,
            description,
            image_url,
            status: LISTING_STATUS_ACTIVE,
            created_at: timestamp::now_seconds(),
            updated_at: timestamp::now_seconds(),
        };

        // Add listing to marketplace
        table::add(&mut marketplace_data.listings, listing_id, listing);
        marketplace_data.listings_count = listing_id;

        // Emit event
        event::emit_event(
            &mut marketplace_data.list_item_events,
            ListItemEvent {
                listing_id,
                seller: seller_addr,
                price,
                name,
                timestamp: timestamp::now_seconds(),
            },
        );
    }

    // Buy an item
    public entry fun buy_item<CoinType>(
        buyer: &signer,
        listing_id: u64,
        marketplace_addr: address,
    ) acquires MarketplaceData {
        let buyer_addr = signer::address_of(buyer);

        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global_mut<MarketplaceData>(marketplace_addr);

        // Check if marketplace is paused
        assert!(!marketplace_data.is_paused, error::invalid_state(E_MARKETPLACE_PAUSED));

        // Get listing
        assert!(table::contains(&marketplace_data.listings, listing_id), error::not_found(E_LISTING_DOESNT_EXIST));
        let listing = table::borrow_mut(&mut marketplace_data.listings, listing_id);

        // Check listing is active
        assert!(listing.status == LISTING_STATUS_ACTIVE, error::invalid_state(E_LISTING_DOESNT_EXIST));

        // Check buyer has enough funds - Fixed the error function here
        assert!(coin::balance<CoinType>(buyer_addr) >= listing.price, error::invalid_argument(E_INSUFFICIENT_FUNDS));

        // Calculate fee
        let fee_amount = (listing.price * marketplace_data.fee_percentage) / 10000;
        let seller_amount = listing.price - fee_amount;

        // Transfer payment
        let seller_addr = listing.seller;

        // Transfer funds to seller
        coin::transfer<CoinType>(buyer, seller_addr, seller_amount);

        // Transfer fee to marketplace admin
        if (fee_amount > 0) {
            coin::transfer<CoinType>(buyer, marketplace_data.admin, fee_amount);
        };

        // Update listing status
        listing.status = LISTING_STATUS_SOLD;
        listing.updated_at = timestamp::now_seconds();

        // Emit event
        event::emit_event(
            &mut marketplace_data.buy_item_events,
            BuyItemEvent {
                listing_id,
                seller: seller_addr,
                buyer: buyer_addr,
                price: listing.price,
                name: listing.name,
                timestamp: timestamp::now_seconds(),
            },
        );
    }

    // Cancel a listing
    public entry fun cancel_listing(
        seller: &signer,
        listing_id: u64,
        marketplace_addr: address,
    ) acquires MarketplaceData {
        let seller_addr = signer::address_of(seller);

        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global_mut<MarketplaceData>(marketplace_addr);

        // Get listing
        assert!(table::contains(&marketplace_data.listings, listing_id), error::not_found(E_LISTING_DOESNT_EXIST));
        let listing = table::borrow_mut(&mut marketplace_data.listings, listing_id);

        // Verify seller is owner of the listing
        assert!(listing.seller == seller_addr, error::permission_denied(E_NOT_AUTHORIZED));

        // Check listing is still active
        assert!(listing.status == LISTING_STATUS_ACTIVE, error::invalid_state(E_LISTING_DOESNT_EXIST));

        // Update listing status
        listing.status = LISTING_STATUS_CANCELLED;
        listing.updated_at = timestamp::now_seconds();

        // Emit event
        event::emit_event(
            &mut marketplace_data.cancel_listing_events,
            CancelListingEvent {
                listing_id,
                seller: seller_addr,
                timestamp: timestamp::now_seconds(),
            },
        );
    }

    // Admin functions

    // Update fee percentage (admin only)
    public entry fun update_fee_percentage(
        admin: &signer,
        new_fee_percentage: u64,
        marketplace_addr: address,
    ) acquires MarketplaceData {
        let admin_addr = signer::address_of(admin);

        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global_mut<MarketplaceData>(marketplace_addr);

        // Verify caller is admin
        assert!(marketplace_data.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));

        // Max fee is 10%
        assert!(new_fee_percentage <= 1000, error::invalid_argument(E_INVALID_PRICE));

        // Update fee percentage
        marketplace_data.fee_percentage = new_fee_percentage;
    }

    // Pause/unpause marketplace (admin only)
    public entry fun set_paused(
        admin: &signer,
        is_paused: bool,
        marketplace_addr: address,
    ) acquires MarketplaceData {
        let admin_addr = signer::address_of(admin);

        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global_mut<MarketplaceData>(marketplace_addr);

        // Verify caller is admin
        assert!(marketplace_data.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));

        // Update pause status
        marketplace_data.is_paused = is_paused;
    }

    // View functions

    // Get listing details
    #[view]
    public fun get_listing_details(marketplace_addr: address, listing_id: u64): (address, u64, String, String, String, u8, u64) acquires MarketplaceData {
        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global<MarketplaceData>(marketplace_addr);

        // Get listing
        assert!(table::contains(&marketplace_data.listings, listing_id), error::not_found(E_LISTING_DOESNT_EXIST));
        let listing = table::borrow(&marketplace_data.listings, listing_id);

        (
            listing.seller,
            listing.price,
            listing.name,
            listing.description,
            listing.image_url,
            listing.status,
            listing.created_at
        )
    }

    // Check if listing is active
    #[view]
    public fun is_listing_active(marketplace_addr: address, listing_id: u64): bool acquires MarketplaceData {
        // Get marketplace data
        if (!exists<MarketplaceData>(marketplace_addr)) {
            return false
        };

        let marketplace_data = borrow_global<MarketplaceData>(marketplace_addr);

        // Check if listing exists
        if (!table::contains(&marketplace_data.listings, listing_id)) {
            return false
        };

        // Get listing and check status
        let listing = table::borrow(&marketplace_data.listings, listing_id);

        listing.status == LISTING_STATUS_ACTIVE
    }

    // Get marketplace fee percentage
    #[view]
    public fun get_fee_percentage(marketplace_addr: address): u64 acquires MarketplaceData {
        // Get marketplace data
        assert!(exists<MarketplaceData>(marketplace_addr), error::not_found(E_NOT_INITIALIZED));
        let marketplace_data = borrow_global<MarketplaceData>(marketplace_addr);

        marketplace_data.fee_percentage
    }
}