import { Swap as SwapEvent } from "../generated/templates/UniswapV3Pair/UniswapV3Pair"
import { Swap, Pool } from "../generated/schema"

export function handleSwapV3(event: SwapEvent): void {
  const entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  const pool = Pool.load(event.address)!

  entity.pool = event.address
  entity.token0 = pool.token0
  entity.token1 = pool.token1
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
