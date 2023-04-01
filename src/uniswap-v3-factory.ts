import { PoolCreated as PoolCreatedEvent } from "../generated/UniswapV3Factory/UniswapV3Factory"
import { Pool } from "../generated/schema"
import { UniswapV3Pair as PairTemplate } from "../generated/templates"

export function handlePoolCreatedV3(event: PoolCreatedEvent): void {
  const entity = new Pool(event.params.pool)

  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.fee = event.params.fee
  entity.tickSpacing = event.params.tickSpacing
  entity.pool = event.params.pool

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  PairTemplate.create(event.params.pool)

  entity.save()
}
