// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEduStreamr {
    struct Tip {
        address recipientAddress;
        address senderAddress;
        string senderName;
        string message;
        uint256 amount;
        uint256 timestamp;
    }

    event TipReceived(
        address indexed recipientAddress,
        address indexed senderAddress,
        string senderName,
        string message,
        uint256 amount,
        uint256 timestamp
    );

    event Withdraw(address indexed owner, uint256 amount);
}
