import { factoryAbi } from './abi';
import web3 from './web3';

const instance = new web3.eth.Contract(
  factoryAbi,
  '0xfeddc812f721cc2df9024538b7ba79122b63d7a1'
);
// 0x20246a526d3dd31629faf8b53946d16871823fe0
// 0x228f716a41ec6622529fcabf978648584b8e7be0
export default instance;
