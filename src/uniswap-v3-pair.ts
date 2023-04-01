import { Swap as SwapEvent } from "../generated/templates/UniswapV3Pair/UniswapV3Pair"
import { Swap, Pool } from "../generated/schema"
import { fillCandles } from "./candles"

export function handleSwapV3(event: SwapEvent): void {
  const swap = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  const pool = Pool.load(event.address)!

  swap.pool = event.address
  swap.token0 = pool.token0
  swap.token1 = pool.token1
  swap.amount0 = event.params.amount0
  swap.amount1 = event.params.amount1

  swap.blockNumber = event.block.number
  swap.blockTimestamp = event.block.timestamp
  swap.transactionHash = event.transaction.hash

  fillCandles(swap)

  swap.save()
}
