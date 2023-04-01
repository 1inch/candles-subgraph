import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Swap, Pool } from "../generated/schema"
import { Candle, LastCandle } from "../generated/schema"

export function fillCandles(swap: Swap): void {
    const durations = [5*50, 30*60, 60*60, 4*60*60, 24*60*60]
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
            last.open0 = swap.amount0
            last.open1 = swap.amount1
            last.close0 = swap.amount0
            last.close1 = swap.amount1
            last.high0 = swap.amount0
            last.high1 = swap.amount1
            last.low0 = swap.amount0
            last.low1 = swap.amount1
        }

        if (swap.blockTimestamp.lt(last.timestamp.plus(durationBigInt))) {
            // Always update the close price
            last.close0 = swap.amount0
            last.close1 = swap.amount1

            // If new price if higher (ie amount0/amount1 > high0/high1)
            if (swap.amount0.times(last.high1).gt(swap.amount1.times(last.high0))) {
                last.high0 = swap.amount0
                last.high1 = swap.amount1
            }
            // If new price if lower (ie amount0/amount1 < low0/low1)
            if (swap.amount0.times(last.low1).lt(swap.amount1.times(last.low0))) {
                last.low0 = swap.amount0
                last.low1 = swap.amount1
            }
        }
        else if (swap.blockTimestamp.gt(last.timestamp.plus(durationBigInt))) {
            const candleId = last.token0.concat(last.token1).concatI32(durations[i]).concatI32(last.timestamp.toI32())
            const candle = new Candle(candleId)
            candle.token0 = last.token0
            candle.token1 = last.token1
            candle.duration = last.duration
            candle.timestamp = last.timestamp
            candle.open0 = last.open0
            candle.open1 = last.open1
            candle.close0 = last.close0
            candle.close1 = last.close1
            candle.high0 = last.high0
            candle.high1 = last.high1
            candle.low0 = last.low0
            candle.low1 = last.low1
            candle.save()

            last.timestamp = swap.blockTimestamp
                .div(durationBigInt)
                .times(durationBigInt)
            last.open0 = swap.amount0
            last.open1 = swap.amount1
            last.close0 = swap.amount0
            last.close1 = swap.amount1
            last.high0 = swap.amount0
            last.high1 = swap.amount1
            last.low0 = swap.amount0
            last.low1 = swap.amount1
        }
        last.save()
    }
}
