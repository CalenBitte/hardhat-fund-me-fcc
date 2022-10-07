//import
//main function
// calling of main function
/*function deployFunc(hre){
    console.log("hi");
}

module.exports.default = deployFunc;*/
//Napravit cemo na drugi nacin, anonymous func
//Nearly identical

/*module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre
    //hre.getNamedAccounts isto ko ovo gore
}*/
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
// const helperConfig = require("../helper-hardhat-config");
// const networkConfig = helperConfig.networkConfig;
// Ove dvi zakomentirane su ka ona nezakomentirana gori

//Isto ko ovo gori
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    //Ako nema mocka onda ovako
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    console.log("ADRESAAA");
    console.log(ethUsdPriceFeedAddress);
  }
  // if the contract doesnt exist, we deploy a minimal version of it
  //for our local testing

  //What happens when we want to change chains?
  //When going for localhost or hardhat network we want to use a mock
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress], //put price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.EHTERSCAN_API_KEY
  ) {
    //Verify
    await verify(fundMe.address, args);
  }
  log("----------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
