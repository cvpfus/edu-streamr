// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./EduStreamr.sol";
import "./interfaces/IEduStreamr.sol";
import "./libraries/EduStreamrLib.sol";
import "./libraries/StringUtils.sol";

contract UniversalEduStreamr is Ownable, IEduStreamr {
    using StringUtils for string;

    struct CreatorInfo {
        string username;
        string name;
        address creatorAddress;
        address contractAddress;
    }

    mapping(address => CreatorInfo) public creatorInfoByAddress;
    mapping(string => CreatorInfo) public creatorInfoByUsername;
    mapping(string => address) public usernameToAddress;
    mapping(address => string) public addressToUsername;
    mapping(address => bool) public isRegistered;
    mapping(address => Tip[]) private tips;
    mapping(address => uint256) public totalTipsReceived;

    event ContractDeployed(
        address indexed creatorAddress,
        address indexed creatorContractAddress
    );

    constructor() Ownable(msg.sender) {}

    /// @dev Function to deploy a new EduStreamr contract
    /// @param username - The username of the creator
    function deployContract(
        string calldata username
    ) external returns (address) {
        require(
            bytes(username).length >= 3 && bytes(username).length <= 10,
            "Username must be between 3 and 10 characters"
        );

        require(username.isAlphanumeric(), "Username must be alphanumeric");

        require(
            creatorInfoByAddress[msg.sender].contractAddress == address(0),
            "Contract already deployed"
        );
        require(
            usernameToAddress[username] == address(0),
            "Username already registered"
        );

        EduStreamr eduStreamr = new EduStreamr(
            address(this),
            totalTipsReceived[msg.sender],
            tips[msg.sender]
        );
        eduStreamr.transferOwnership(msg.sender);

        CreatorInfo memory creatorInfo = CreatorInfo({
            username: username,
            name: username,
            creatorAddress: msg.sender,
            contractAddress: address(eduStreamr)
        });

        creatorInfoByAddress[msg.sender] = creatorInfo;
        creatorInfoByUsername[username] = creatorInfo;
        usernameToAddress[username] = msg.sender;
        addressToUsername[msg.sender] = username;
        isRegistered[msg.sender] = true;

        emit ContractDeployed(msg.sender, address(eduStreamr));

        return address(eduStreamr);
    }

    /// @dev Function to send a tip to an unregistered creator
    /// @param creatorAddress - The address of the creator
    /// @param senderName - The name of the sender
    /// @param message - The message sent with the tip
    function sendTip(
        address creatorAddress,
        string calldata senderName,
        string calldata message
    ) external payable {
        require(msg.value > 0, "Tip amount must be greater than zero");

        (bool sent, ) = creatorAddress.call{value: msg.value}("");
        require(sent, "Failed to send tip");

        Tip memory tip = Tip({
            recipientAddress: creatorAddress,
            senderAddress: msg.sender,
            senderName: senderName,
            message: message,
            amount: msg.value,
            timestamp: block.timestamp
        });

        tips[creatorAddress].push(tip);

        totalTipsReceived[creatorAddress] += msg.value;

        emit TipReceived({
            recipientAddress: tip.recipientAddress,
            senderAddress: tip.senderAddress,
            senderName: tip.senderName,
            message: tip.message,
            amount: tip.amount,
            timestamp: tip.timestamp
        });
    }

    /// @dev Function to get tip history with pagination using page numbers
    /// @param pageIndex - Page index
    /// @param pageSize - Page size
    /// @return paginatedTips - Array of tips in the specified page range
    function getTipHistory(
        address creatorAddress,
        uint256 pageIndex,
        uint256 pageSize
    ) external view returns (Tip[] memory paginatedTips, uint256 totalTips) {
        totalTips = tips[creatorAddress].length;

        paginatedTips = EduStreamrLib.getTipHistory(
            tips[creatorAddress],
            totalTips,
            pageIndex,
            pageSize
        );
    }

    /// @dev Function to get the total number of tips
    /// @return tipCount - Total number of tips
    function getTipCount(
        address creatorAddress
    ) external view returns (uint256 tipCount) {
        tipCount = tips[creatorAddress].length;
    }

    /// @dev Function to change the creator username
    /// @param newUsername - New username to be set
    function changeUsername(string memory newUsername) external {
        require(isRegistered[msg.sender], "User is not registered");

        require(
            usernameToAddress[newUsername] == address(0),
            "Username already exist"
        );

        require(
            bytes(newUsername).length >= 3 && bytes(newUsername).length <= 10,
            "Username must be between 3 and 10 characters"
        );

        CreatorInfo storage creatorInfo = creatorInfoByAddress[msg.sender];

        delete usernameToAddress[creatorInfo.username];
        usernameToAddress[newUsername] = msg.sender;

        delete creatorInfoByUsername[creatorInfo.username];
        creatorInfo.username = newUsername;
        creatorInfoByUsername[newUsername] = creatorInfo;
    }

    /// @dev Function to change the creator name
    /// @param newName - New name to be set
    function changeName(string memory newName) external {
        require(isRegistered[msg.sender], "User is not registered");

        require(
            bytes(newName).length >= 3 && bytes(newName).length <= 35,
            "Name must be between 3 and 35 characters"
        );

        require(newName.isLetterOrSpace(), "Name must contain only letters and spaces");

        CreatorInfo storage creatorInfo = creatorInfoByAddress[msg.sender];

        creatorInfo.name = newName;

        creatorInfoByUsername[creatorInfo.username] = creatorInfo;
    }
}
