import { PairCreated as PairCreatedEvent } from "../generated/UniswapV2Factory/UniswapV2Factory"
import { Pool } from "../generated/schema"
import { UniswapV2Pair as PairTemplate } from "../generated/templates"

export function handlePairCreatedV2(event: PairCreatedEvent): void {
  const entity = new Pool(event.params.pair)

  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.pool = event.params.pair

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // create the tracked contract based on the template
  PairTemplate.create(event.params.pair)

  entity.save()
}
