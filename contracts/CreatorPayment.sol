// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CreatorPayment
 * @dev Contract for handling payments to content creators
 */
contract CreatorPayment {
    address public owner;
    
    // Mapping to track creator balances
    mapping(address => uint256) public creatorBalances;
    
    // Events
    event PaymentSent(address indexed creator, uint256 amount);
    event PaymentReceived(address indexed from, address indexed to, uint256 amount);
    event BalanceWithdrawn(address indexed creator, uint256 amount);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Make a payment to a creator
     * @param creator Address of the creator to receive payment
     */
    function makePayment(address payable creator) external payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(creator != address(0), "Invalid creator address");
        
        // Update creator's balance
        creatorBalances[creator] += msg.value;
        
        // Transfer the payment directly to the creator
        (bool sent, ) = creator.call{value: msg.value}("");
        require(sent, "Failed to send payment to creator");
        
        // Emit events
        emit PaymentReceived(msg.sender, creator, msg.value);
        emit PaymentSent(creator, msg.value);
    }
    
    /**
     * @dev Get the balance of a specific creator
     * @param creator Address of the creator
     * @return uint256 Balance of the creator
     */
    function getCreatorBalance(address creator) external view returns (uint256) {
        return creatorBalances[creator];
    }
    
    /**
     * @dev Withdraw accumulated balance
     * Only callable by creators with positive balance
     */
    function withdrawBalance() external {
        uint256 balance = creatorBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        // Reset balance before transfer to prevent reentrancy
        creatorBalances[msg.sender] = 0;
        
        // Transfer the balance to the creator
        (bool sent, ) = payable(msg.sender).call{value: balance}("");
        require(sent, "Failed to withdraw balance");
        
        emit BalanceWithdrawn(msg.sender, balance);
    }
    
    /**
     * @dev Get contract balance
     * @return uint256 Current contract balance
     */
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
    
    // Allow contract to receive ETH
    receive() external payable {
        // Emit event when contract receives ETH
        emit PaymentReceived(msg.sender, address(this), msg.value);
    }
    
    // Fallback function
    fallback() external payable {
        // Emit event when contract receives ETH through unknown function call
        emit PaymentReceived(msg.sender, address(this), msg.value);
    }
} 