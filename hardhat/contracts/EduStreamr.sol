// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EduStreamr is Ownable {
    struct Tip {
        address senderAddress;
        string senderName;
        string message;
        uint256 amount;
        uint256 timestamp;
    }

    Tip[] private tips;

    uint256 public totalTipsReceived;

    string public bio;

    event TipReceived(
        address indexed senderAddress,
        string senderName,
        string message,
        uint256 amount,
        uint256 timestamp
    );
    event Withdraw(address indexed owner, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /// @dev Function to store a new tip
    /// @param message - The message sent with the tip
    function sendTip(string calldata senderName, string calldata message) external payable {
        require(msg.value > 0, "Tip amount must be greater than zero");

        tips.push(
            Tip({
                senderAddress: msg.sender,
                senderName: senderName,
                message: message,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        totalTipsReceived += msg.value;

        emit TipReceived(msg.sender, senderName, message, msg.value, block.timestamp);
    }

    /// @dev Function to emit the TipReceived event for a selected tip by index
    /// @param tipIndex - The index of the tip in the array
    function emitTipEvent(uint256 tipIndex) external onlyOwner {
        require(tipIndex < tips.length, "Invalid tip index");

        Tip memory selectedTip = tips[tipIndex];
        emit TipReceived(
            selectedTip.senderAddress,
            selectedTip.senderName,
            selectedTip.message,
            selectedTip.amount,
            selectedTip.timestamp
        );
    }

    /// @dev Function to get tip history with pagination
    /// @param page - Page number (starting from 1)
    /// @param pageSize - Number of tips per page
    /// @return paginatedTips - Array of tips on the requested page
    function getTipHistory(
        uint256 page,
        uint256 pageSize
    ) external view returns (Tip[] memory paginatedTips) {
        uint256 totalTips = tips.length;

        require(page > 0, "Page number must be greater than zero");

        uint256 start = (page - 1) * pageSize;
        uint256 end = start + pageSize;

        if (end > totalTips) {
            end = totalTips;
        }

        require(start < totalTips, "Page out of range");

        paginatedTips = new Tip[](end - start);
        for (uint256 i = start; i < end; i++) {
            paginatedTips[i - start] = tips[i];
        }
    }

    /// @dev Function to get tip history with pagination using row numbers
    /// @param startRow - Start row number
    /// @param endRow - End row number
    /// @return paginatedTips - Array of tips in the specified row range
    function getTipHistory2(
        uint256 startRow,
        uint256 endRow
    ) external view returns (Tip[] memory paginatedTips, uint256 totalTips) {
        totalTips = tips.length;

        require(startRow < endRow, "Invalid row range");

        uint256 end = endRow;
        if (end > totalTips) {
            end = totalTips;
        }

        paginatedTips = new Tip[](end - startRow);
        for (uint256 i = startRow; i < end; i++) {
            paginatedTips[i - startRow] = tips[i];
        }
    }

    /// @dev Function to get all tips
    /// @return tips - Array of all tips
    function getAllTips() external view returns (Tip[] memory) {
        return tips;
    }

    /// @dev Function to get the total number of tips
    /// @return totalTips - Total number of tips
    function getTotalTips() external view returns (uint256) {
        return tips.length;
    }

    /// @dev Function to withdraw the contract balance to the owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdraw(owner(), balance);
    }

    /// @dev Function to set the bio of the creator
    /// @param newBio - The bio
    function setBio(string calldata newBio) external onlyOwner {
        require(bytes(newBio).length <= 130, "Bio must be less than 130 characters");
        bio = newBio;
    }
}
