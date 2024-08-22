import {
  SuiClient,
} from "@mysten/sui/client";
import { networkConfig} from "./networkConfig.ts";

export const useSui = () => {
  const FULL_NODE = networkConfig.testnet;
  // console.log('full_node', FULL_NODE);
  const suiClient = new SuiClient(FULL_NODE);

  return { suiClient };
};
