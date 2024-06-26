import { writable } from "svelte/store";
import { PoolVolatilitiesSnapshot, type AggregatedSlippageAmount, type SwapTransaction, type TokenVolumesSnapshot, LPSnapshot, type LPRegistry, MEVTransactions, ImpermanentLossSnapshot, PoolVolumeSnapshot } from "./models";

export const swapTransactionsStore = writable<SwapTransaction[]>([]);
export const mevTransactionsStore = writable<MEVTransactions>({
    arbitrageTransactions: [],
    sandwichTransactions: [],
});
export const slippageCountStore = writable<number[]>([]);
export const aggregatedSlippagesStore = writable<AggregatedSlippageAmount[]>([]);
export const tokenVolumesSnapshotsStore = writable<TokenVolumesSnapshot[]>([]);
export const poolVolatilitySnapshotsStore = writable<PoolVolatilitiesSnapshot[]>([]);
export const poolVolumeSnapshotsStore= writable<PoolVolumeSnapshot[]>([]);
export const poolImpermanentLossSnapshotsStore = writable<ImpermanentLossSnapshot[]>([]);
export const lpRegistryStore = writable<LPRegistry>({});
