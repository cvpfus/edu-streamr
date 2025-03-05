// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IEduStreamr.sol";

library EduStreamrLib {
    /// @dev Function to get tip history with pagination using row numbers
    /// @param tips - Array of tips
    /// @param totalTips - Total number of tips
    /// @param pageIndex - Page index
    /// @param pageSize - Page size
    /// @return paginatedTips - Array of tips in the specified row range
    function getTipHistory(
        IEduStreamr.Tip[] memory tips,
        uint256 totalTips,
        uint256 pageIndex,
        uint256 pageSize
    ) internal pure returns (IEduStreamr.Tip[] memory paginatedTips) {
        require(pageSize > 0, "Page size must be greater than zero");
        
        uint256 start = pageIndex * pageSize;
        uint256 end = start + pageSize;
        
        if (end > totalTips) {
            end = totalTips;
        }
        
        require(start < totalTips, "Page index out of range");
        
        paginatedTips = new IEduStreamr.Tip[](end - start);
        for (uint256 i = start; i < end; i++) {
            paginatedTips[i - start] = tips[i];
        }
    }
}
