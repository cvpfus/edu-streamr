// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library StringUtils {
    // @dev Checks if a string is alphanumeric.
    // @param str The string to check.
    // @return True if the string is alphanumeric, false otherwise.
    function isAlphanumeric(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(char >= 0x30 && char <= 0x39) && !(char >= 0x41 && char <= 0x5A) && !(char >= 0x61 && char <= 0x7A)) {
                return false;
            }
        }
        return true;
    }

    // @dev Checks if a string is a letter.
    // @param str The string to check.
    // @return True if the string is a letter, false otherwise.
    function isLetterOrSpace(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);

        uint8 letterCount = 0;

        for (uint256 i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(char >= 0x41 && char <= 0x5A) && !(char >= 0x61 && char <= 0x7A) && !(char == 0x20)) {
                return false;
            }

            if (!(char == 0x20)) {
                letterCount++;
            }
        }

        if (letterCount == 0) {
            return false;
        }

        return true;
    }

    // @dev Checks if a string is a color hex code.
    // @param colorHex The color hex code to check.
    // @return True if the string is a color hex code, false otherwise.
    function isColorHex(string memory colorHex) internal pure returns (bool) {
        bytes memory b = bytes(colorHex);
        if (b.length != 7) {
            return false;
        }
        if (b[0] != 0x23) {
            return false;
        }
        for (uint256 i = 1; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(char >= 0x30 && char <= 0x39) && !(char >= 0x41 && char <= 0x46) && !(char >= 0x61 && char <= 0x66)) {
                return false;
            }
        }
        return true;
    }

    function isEqual(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
