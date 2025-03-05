// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./UniversalEduStreamr.sol";
import "./interfaces/IEduStreamr.sol";
import "./libraries/EduStreamrLib.sol";
import "./libraries/StringUtils.sol";

contract EduStreamr is Ownable, IEduStreamr {
    using StringUtils for string;

    Tip[] private tips;
    uint256 public totalTipsReceived;
    string public bio;
    address payable factoryAddress;
    uint8 public messageDuration;

    mapping(string => string) public colors;

    constructor(
        address _factoryAddress,
        uint256 _totalTipsReceived,
        Tip[] memory _tips
    ) Ownable(msg.sender) {
        factoryAddress = payable(_factoryAddress);
        totalTipsReceived = _totalTipsReceived;

        colors["background"] = "#209bb9";
        colors["primary"] = "#ffffff";
        colors["secondary"] = "#c1fc29";

        messageDuration = 5;

        if (_tips.length > 0) {
            for (uint256 i = 0; i < _tips.length; i++) {
                tips.push(_tips[i]);
            }
        }
    }

    /// @dev Function to store a new tip
    /// @param senderName - The name of the sender
    /// @param message - The message sent with the tip
    function sendTip(
        string calldata senderName,
        string calldata message
    ) external payable {
        require(msg.value > 0, "Tip amount must be greater than zero");

        Tip memory tip = Tip({
            recipientAddress: owner(),
            senderAddress: msg.sender,
            senderName: senderName,
            message: message,
            amount: msg.value,
            timestamp: block.timestamp
        });

        tips.push(tip);

        totalTipsReceived += msg.value;

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
        uint256 pageIndex,
        uint256 pageSize
    ) external view returns (Tip[] memory paginatedTips, uint256 totalTips) {
        totalTips = tips.length;

        paginatedTips = EduStreamrLib.getTipHistory(
            tips,
            totalTips,
            pageIndex,
            pageSize
        );
    }

    /// @dev Function to get the total number of tips
    /// @return tipCount - Total number of tips
    function getTipCount() external view returns (uint256 tipCount) {
        tipCount = tips.length;
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
        require(
            bytes(newBio).length <= 130,
            "Bio must be less than 130 characters"
        );
        bio = newBio;
    }

    /// @dev Function to set the message duration
    /// @param _seconds - The duration in seconds
    function setMessageDuration(uint8 _seconds) external onlyOwner {
        require(
            _seconds >= 1 && _seconds <= 120,
            "Duration must be between 1 and 120 seconds"
        );
        messageDuration = _seconds;
    }
    
    /// @dev Function to get the colors of the widget
    /// @return primary - The primary color
    /// @return secondary - The secondary color
    /// @return background - The background color
    function getColors() external view returns (string memory, string memory, string memory) {
        return (colors["primary"], colors["secondary"], colors["background"]);
    }

    /// @dev Function to set the color of the widget
    /// @param colorType - The color type
    /// @param colorHex - The color hex
    function setColor(
        string memory colorType,
        string memory colorHex
    ) external onlyOwner {
        require(
            colorType.isEqual("primary") ||
                colorType.isEqual("secondary") ||
                colorType.isEqual("background"),
            "Invalid color type"
        );
        require(colorHex.isColorHex(), "Invalid color hex");

        colors[colorType] = colorHex;
    }

    /// @dev Function to set the colors of the widget
    /// @param primary - The primary color
    /// @param secondary - The secondary color
    /// @param background - The background color
    function setColors(
        string memory primary,
        string memory secondary,
        string memory background
    ) external onlyOwner {
        uint256 primaryLength = bytes(primary).length;
        uint256 secondaryLength = bytes(secondary).length;
        uint256 backgroundLength = bytes(background).length;

        require(
            primary.isColorHex() || primaryLength == 0,
            "Invalid primary color hex"
        );
        require(
            secondary.isColorHex() || secondaryLength == 0,
            "Invalid secondary color hex"
        );
        require(
            background.isColorHex() || backgroundLength == 0,
            "Invalid background color hex"
        );

        if (primaryLength > 0) colors["primary"] = primary;
        if (secondaryLength > 0) colors["secondary"] = secondary;
        if (backgroundLength > 0) colors["background"] = background;
    }
}
