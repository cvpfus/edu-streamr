// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EduStreamrFactoryModule = buildModule(
  "EduStreamrFactoryModule",
  (m) => {
    const contract = m.contract("EduStreamrFactory");

    return { contract };
  }
);

export default EduStreamrFactoryModule;
