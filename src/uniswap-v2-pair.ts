import { Swap as SwapEvent } from "../generated/templates/UniswapV2Pair/UniswapV2Pair"
import { Swap, Pool } from "../generated/schema"
import { fillCandles } from "./candles"

export function handleSwapV2(event: SwapEvent): void {
  const swap = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  const pool = Pool.load(event.address)!

  swap.pool = event.address
  swap.token0 = pool.token0
  swap.token1 = pool.token1
  swap.amount0 = event.params.amount0In.minus(event.params.amount0Out)
  swap.amount1 = event.params.amount1In.minus(event.params.amount1Out)

  swap.blockNumber = event.block.number
  swap.blockTimestamp = event.block.timestamp
  swap.transactionHash = event.transaction.hash

  fillCandles(swap)

  swap.save()
}
