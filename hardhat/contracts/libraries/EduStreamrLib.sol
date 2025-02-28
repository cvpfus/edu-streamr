// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IEduStreamr.sol";

library EduStreamrLib {
    /// @dev Function to get tip history with pagination using row numbers
    /// @param tips - Array of tips
    /// @param totalTips - Total number of tips
    /// @param startRow - Start row number
    /// @param endRow - End row number
    /// @return paginatedTips - Array of tips in the specified row range
    function getTipHistory(
        IEduStreamr.Tip[] memory tips,
        uint256 totalTips,
        uint256 startRow,
        uint256 endRow
    ) internal pure returns (IEduStreamr.Tip[] memory paginatedTips) {
        require(startRow < endRow, "Invalid row range");

        uint256 end = endRow;
        if (end > totalTips) {
            end = totalTips;
        }

        paginatedTips = new IEduStreamr.Tip[](end - startRow);
        for (uint256 i = startRow; i < end; i++) {
            paginatedTips[i - startRow] = tips[i];
        }
    }
}
