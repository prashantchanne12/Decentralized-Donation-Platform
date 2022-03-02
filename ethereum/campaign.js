import web3 from './web3';
import { campaignAbi } from './abi';

const contract = (address) => {
  return new web3.eth.Contract(campaignAbi, address);
};

export default contract;
