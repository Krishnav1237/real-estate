// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RealEstateToken is ERC1155Supply, Ownable {
    using Strings for uint256;

    // Property struct to store property details
    struct Property {
        string name;
        string location;
        uint256 totalTokens;
        uint256 pricePerToken;
        bool isActive;
        string metadataURI;
    }

    // Mapping from token ID to Property
    mapping(uint256 => Property) public properties;
    
    // Counter for property IDs
    uint256 private _propertyIdCounter;

    // Events
    event PropertyCreated(
        uint256 indexed propertyId,
        string name,
        string location,
        uint256 totalTokens,
        uint256 pricePerToken
    );
    event PropertyDeactivated(uint256 indexed propertyId);
    event TokensPurchased(
        address indexed buyer,
        uint256 indexed propertyId,
        uint256 amount,
        uint256 totalPrice
    );

    constructor() ERC1155("") Ownable() {
        _propertyIdCounter = 0;
    }

    // Create a new property token
    function createProperty(
        string memory name,
        string memory location,
        uint256 totalTokens,
        uint256 pricePerToken,
        string memory metadataURI
    ) public onlyOwner {
        require(totalTokens > 0, "Total tokens must be greater than 0");
        require(pricePerToken > 0, "Price per token must be greater than 0");

        uint256 propertyId = _propertyIdCounter;
        _propertyIdCounter++;

        properties[propertyId] = Property({
            name: name,
            location: location,
            totalTokens: totalTokens,
            pricePerToken: pricePerToken,
            isActive: true,
            metadataURI: metadataURI
        });

        _mint(address(this), propertyId, totalTokens, "");

        emit PropertyCreated(
            propertyId,
            name,
            location,
            totalTokens,
            pricePerToken
        );
    }

    // Purchase tokens for a property
    function purchaseTokens(uint256 propertyId, uint256 amount) public payable {
        Property storage property = properties[propertyId];
        require(property.isActive, "Property is not active");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 totalPrice = amount * property.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");
        require(
            balanceOf(address(this), propertyId) >= amount,
            "Not enough tokens available"
        );

        // Transfer tokens from contract to buyer
        _safeTransferFrom(address(this), msg.sender, propertyId, amount, "");

        // Emit purchase event
        emit TokensPurchased(msg.sender, propertyId, amount, totalPrice);

        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }

    // Deactivate a property
    function deactivateProperty(uint256 propertyId) public onlyOwner {
        require(properties[propertyId].isActive, "Property is already inactive");
        properties[propertyId].isActive = false;
        emit PropertyDeactivated(propertyId);
    }

    // Get property details
    function getProperty(uint256 propertyId) public view returns (
        string memory name,
        string memory location,
        uint256 totalTokens,
        uint256 pricePerToken,
        bool isActive,
        uint256 availableTokens
    ) {
        Property storage property = properties[propertyId];
        return (
            property.name,
            property.location,
            property.totalTokens,
            property.pricePerToken,
            property.isActive,
            balanceOf(address(this), propertyId)
        );
    }

    // Override _beforeTokenTransfer
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // URI Override for metadata
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "URI query for nonexistent token");
        return properties[tokenId].metadataURI;
    }

    // Withdraw contract balance
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
} 