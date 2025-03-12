// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Marketplace is Ownable(msg.sender), Pausable {    // Listing status
    uint8 constant LISTING_STATUS_ACTIVE = 1;
    uint8 constant LISTING_STATUS_SOLD = 2;
    uint8 constant LISTING_STATUS_CANCELLED = 3;

    uint256 private listingCounter = 0;
    uint256 public feePercentage; // basis points (1% = 100)

    struct Listing {
        uint256 id;
        address seller;
        uint256 price;
        string name;
        string description;
        string imageUrl;
        uint8 status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(uint256 => Listing) public listings;

    // Events
    event ListItem(uint256 listingId, address seller, uint256 price, string name, uint256 timestamp);
    event BuyItem(uint256 listingId, address seller, address buyer, uint256 price, string name, uint256 timestamp);
    event CancelListing(uint256 listingId, address seller, uint256 timestamp);

    constructor(uint256 _feePercentage) {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _feePercentage;
    }

    function listItem(
        uint256 price,
        string memory name,
        string memory description,
        string memory imageUrl
    ) public whenNotPaused {
        require(price > 0, "Price must be greater than 0");

        listingCounter++;
        listings[listingCounter] = Listing({
            id: listingCounter,
            seller: msg.sender,
            price: price,
            name: name,
            description: description,
            imageUrl: imageUrl,
            status: LISTING_STATUS_ACTIVE,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit ListItem(listingCounter, msg.sender, price, name, block.timestamp);
    }

    function buyItem(uint256 listingId) public payable whenNotPaused {
        Listing storage listing = listings[listingId];
        require(listing.id != 0, "Listing does not exist");
        require(listing.status == LISTING_STATUS_ACTIVE, "Listing is not active");
        require(msg.value >= listing.price, "Insufficient funds");

        uint256 feeAmount = (listing.price * feePercentage) / 10000;
        uint256 sellerAmount = listing.price - feeAmount;

        // Transfer funds
        payable(listing.seller).transfer(sellerAmount);

        // Update listing status
        listing.status = LISTING_STATUS_SOLD;
        listing.updatedAt = block.timestamp;

        emit BuyItem(listing.id, listing.seller, msg.sender, listing.price, listing.name, block.timestamp);
    }

    function cancelListing(uint256 listingId) public whenNotPaused {
        Listing storage listing = listings[listingId];
        require(listing.id != 0, "Listing does not exist");
        require(listing.seller == msg.sender, "Only seller can cancel listing");
        require(listing.status == LISTING_STATUS_ACTIVE, "Listing is not active");

        listing.status = LISTING_STATUS_CANCELLED;
        listing.updatedAt = block.timestamp;

        emit CancelListing(listing.id, msg.sender, block.timestamp);
    }

    function updateFeePercentage(uint256 _feePercentage) public onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _feePercentage;
    }

    function setPaused(bool _paused) public onlyOwner {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    function getListingDetails(uint256 listingId) public view returns (
        address, uint256, string memory, string memory, string memory, uint8, uint256
    ) {
        Listing memory listing = listings[listingId];
        require(listing.id != 0, "Listing does not exist");

        return (
            listing.seller,
            listing.price,
            listing.name,
            listing.description,
            listing.imageUrl,
            listing.status,
            listing.createdAt
        );
    }

    function isListingActive(uint256 listingId) public view returns (bool) {
        if (listingId == 0 || listingId > listingCounter) {
            return false;
        }
        return listings[listingId].status == LISTING_STATUS_ACTIVE;
    }

    function getFeePercentage() public view returns (uint256) {
        return feePercentage;
    }
}