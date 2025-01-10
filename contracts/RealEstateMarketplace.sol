// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RealEstateToken.sol";

contract RealEstateMarketplace is ERC1155Holder, ReentrancyGuard, Ownable {
    RealEstateToken public immutable tokenContract;
    
    struct Listing {
        address seller;
        uint256 propertyId;
        uint256 amount;
        uint256 pricePerToken;
        bool isActive;
    }

    // Mapping from listing ID to Listing
    mapping(uint256 => Listing) public listings;
    uint256 private _listingIdCounter;

    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeRate;

    // Events
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed propertyId,
        uint256 amount,
        uint256 pricePerToken
    );
    event ListingCancelled(uint256 indexed listingId);
    event ListingPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 indexed propertyId,
        uint256 amount,
        uint256 totalPrice
    );
    event PlatformFeeUpdated(uint256 newFeeRate);

    constructor(address tokenContractAddress, uint256 initialFeeRate) Ownable() {
        require(initialFeeRate <= 1000, "Fee rate cannot exceed 10%");
        tokenContract = RealEstateToken(tokenContractAddress);
        platformFeeRate = initialFeeRate;
        _listingIdCounter = 0;
    }

    // Create a new listing
    function createListing(
        uint256 propertyId,
        uint256 amount,
        uint256 pricePerToken
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerToken > 0, "Price must be greater than 0");
        require(
            tokenContract.balanceOf(msg.sender, propertyId) >= amount,
            "Insufficient token balance"
        );

        uint256 listingId = _listingIdCounter;
        _listingIdCounter++;

        listings[listingId] = Listing({
            seller: msg.sender,
            propertyId: propertyId,
            amount: amount,
            pricePerToken: pricePerToken,
            isActive: true
        });

        // Transfer tokens to marketplace contract
        tokenContract.safeTransferFrom(
            msg.sender,
            address(this),
            propertyId,
            amount,
            ""
        );

        emit ListingCreated(
            listingId,
            msg.sender,
            propertyId,
            amount,
            pricePerToken
        );
    }

    // Cancel a listing
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(
            listing.seller == msg.sender,
            "Only seller can cancel listing"
        );

        listing.isActive = false;

        // Return tokens to seller
        tokenContract.safeTransferFrom(
            address(this),
            msg.sender,
            listing.propertyId,
            listing.amount,
            ""
        );

        emit ListingCancelled(listingId);
    }

    // Purchase tokens from a listing
    function purchaseListing(
        uint256 listingId,
        uint256 amount
    ) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(amount > 0 && amount <= listing.amount, "Invalid amount");

        uint256 totalPrice = amount * listing.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Calculate platform fee
        uint256 platformFee = (totalPrice * platformFeeRate) / 10000;
        uint256 sellerProceeds = totalPrice - platformFee;

        // Update listing
        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.isActive = false;
        }

        // Transfer tokens to buyer
        tokenContract.safeTransferFrom(
            address(this),
            msg.sender,
            listing.propertyId,
            amount,
            ""
        );

        // Transfer payment to seller
        payable(listing.seller).transfer(sellerProceeds);

        emit ListingPurchased(
            listingId,
            msg.sender,
            listing.propertyId,
            amount,
            totalPrice
        );

        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }

    // Update platform fee rate (only owner)
    function updatePlatformFeeRate(uint256 newFeeRate) external onlyOwner {
        require(newFeeRate <= 1000, "Fee rate cannot exceed 10%");
        platformFeeRate = newFeeRate;
        emit PlatformFeeUpdated(newFeeRate);
    }

    // Get listing details
    function getListing(uint256 listingId) external view returns (
        address seller,
        uint256 propertyId,
        uint256 amount,
        uint256 pricePerToken,
        bool isActive
    ) {
        Listing storage listing = listings[listingId];
        return (
            listing.seller,
            listing.propertyId,
            listing.amount,
            listing.pricePerToken,
            listing.isActive
        );
    }

    // Withdraw platform fees (only owner)
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
} 