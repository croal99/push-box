import { PlayerOnChain } from "@/types/PlayerOnChain";
import { SuiClient, SuiMoveObject } from "@mysten/sui/client";

interface GetPlayerObjectProps {
  suiClient: SuiClient;
  gameId: string;
}
export const getPlayerObject = async ({
  suiClient,
  playerId,
}: GetPlayerObjectProps): Promise<PlayerOnChain> => {
  const res = await suiClient.getObject({
    id: playerId,
    options: { showContent: true },
  });
  const gameObject = res?.data?.content as SuiMoveObject;
  const { fields } = gameObject;
  return fields as unknown as PlayerOnChain;
};
