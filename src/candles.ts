import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Swap, Pool } from "../generated/schema"
import { Candle, LastCandle } from "../generated/schema"

export function fillCandles(swap: Swap): void {
  if (swap.amount0.isZero() || swap.amount1.isZero()) {
    return;
  }
  const swapPrice = new BigDecimal(swap.amount0).div(new BigDecimal(swap.amount1))
  const swapVolume = new BigDecimal(swap.amount0)

  const durations = [5 * 60, 30 * 60, 60 * 60, 4 * 60 * 60, 24 * 60 * 60]
  for (let i = 0; i < durations.length; i++) {
    const durationBigInt = BigInt.fromI32(durations[i]);

    const lastCandleId = swap.token0.concat(swap.token1).concatI32(durations[i]);
    let last = LastCandle.load(lastCandleId)
    if (last == null) {
      last = new LastCandle(lastCandleId)
      last.token0 = swap.token0
      last.token1 = swap.token1
      last.duration = durationBigInt
      last.timestamp = swap.blockTimestamp
        .div(durationBigInt)
        .times(durationBigInt)
      last.volume = swapVolume

      last.open = swapPrice
      last.close = swapPrice
      last.low = swapPrice
      last.high = swapPrice
    }

    if (swap.blockTimestamp.lt(last.timestamp.plus(durationBigInt))) {
      const priceTimesVolume = swapPrice.times(swapVolume)
      const sumVolume = last.volume.plus(swapVolume)

      last.close = last.close.times(last.volume).plus(priceTimesVolume).div(sumVolume);
      if (swapPrice.lt(last.low)) {
        last.low = last.low.times(last.volume).plus(priceTimesVolume).div(sumVolume);
      }
      if (swapPrice.gt(last.high)) {
        last.high = last.high.times(last.volume).plus(priceTimesVolume).div(sumVolume);
      }
    }
    else if (swap.blockTimestamp.gt(last.timestamp.plus(durationBigInt))) {
      const candleId = last.token0.concat(last.token1).concatI32(durations[i]).concatI32(last.timestamp.toI32())
      const candle = new Candle(candleId)
      candle.token0 = last.token0
      candle.token1 = last.token1
      candle.duration = last.duration
      candle.timestamp = last.timestamp
      candle.open = last.open
      candle.close = last.close
      candle.low = last.low
      candle.high = last.high
      candle.save()

      last.timestamp = swap.blockTimestamp
        .div(durationBigInt)
        .times(durationBigInt)
      last.volume = swapVolume
      last.open = swapPrice
      last.close = swapPrice
      last.low = swapPrice
      last.high = swapPrice
    }
    last.save()
  }
}
