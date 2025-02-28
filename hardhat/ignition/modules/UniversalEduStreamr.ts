// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UniversalEduStreamrModule = buildModule("UniversalEduStreamrModule", (m) => {
  const contract = m.contract("UniversalEduStreamr");

  return { contract };
});

export default UniversalEduStreamrModule;
