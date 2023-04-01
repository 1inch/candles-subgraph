import { Swap as SwapEvent } from "../generated/templates/UniswapV2Pair/UniswapV2Pair"
import { Swap, Pool } from "../generated/schema"

export function handleSwapV2(event: SwapEvent): void {
  const entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  const pool = new Pool(event.address);

  entity.token0 = pool.token0
  entity.token1 = pool.token1
  entity.pool = event.address
  entity.amount0 = event.params.amount0In.minus(event.params.amount0Out)
  entity.amount1 = event.params.amount1In.minus(event.params.amount1Out)

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
