import { getBlockTimestamp } from "$lib/api";
import { StableCoins } from "$lib/utils";

export class SwapTransaction {
    constructor(
        public hash: string,
        public timestamp: number,
        public blockNumber: number,
        public tokenInSymbol: string,
        public tokenOutSymbol: string,
        public amountIn: number,
        public quotedPrice: number,
        public priceImpact: number,
        public priceImpactPercentage: number,
        public quotedAmountOut: number,
        public executedAmountOut: number,
        public poolFee: number,
        public gasFee: number,
        public thresholdPercentage?: number,
    ) { }

    get executedPrice() {
        return this.executedAmountOut / this.amountIn;
    }

    get slippagePercentage() {
        return 100 * ((this.executedPrice - this.quotedPrice) / this.quotedPrice);
    }

    get slippageAmount() {
        return StableCoins.includes(this.tokenOutSymbol) ?
            this.executedAmountOut - this.quotedAmountOut :
            (this.executedAmountOut - this.quotedAmountOut) / this.executedPrice;
        ;
    }

    static fromServerResponse(response: any): SwapTransaction[] {
        const swaps = response.map((swap: any) => swap['uniswapSwap'])
        const swapTransactions: SwapTransaction[] = []
        swaps.forEach((swap: any) => {
            swapTransactions.push(new SwapTransaction(
                swap['hash'],
                swap['timestamp'],
                swap['blockNumber'],
                swap['tokenInSymbol'],
                swap['tokenOutSymbol'],
                swap['amountIn'],
                swap['quotedPrice'],
                swap['priceImpact'],
                swap['priceImpactPercentage'],
                swap['quotedAmountOut'],
                swap['executedAmountOut'],
                swap['poolFee'],
                swap['gasPrice'],
                swap['metaData'] ? +swap['metaData'][0] : undefined,
            ))
        })
        return swapTransactions;
    }
}



export class SwapTransactionTableModel {
    constructor(
        public hash: string,
        public timestamp: number,
        public blockNumber: number,
        public tokenInSymbol: string,
        public tokenOutSymbol: string,
        public amountIn: number,
        public quotedPrice: number,
        public executedPrice: number,
        public gasFee: number,
        public slippage: number,
        public slippagePercentage: number,
        public priceImpact: number,
        public thresholdPercentage?: number,
    ) { }

    get amountOut() {
        return this.amountIn * this.executedPrice;
    }

    static headers() {
        return [
            'Hash',
            'Block',
            // 'In',
            // 'Out',
            'Amount In',
            'Amount Out',
            'Quoted Price',
            'Executed Price',
            'Gas Fee',
            'Slippage (USD)',
            'Slippage (%)',
            'Threshold (%)',
            'Price Impact (%)',
        ];
    }

    static fromSwapTransaction(swapTransaction: SwapTransaction): SwapTransactionTableModel {
        return new SwapTransactionTableModel(
            swapTransaction.hash,
            swapTransaction.timestamp,
            swapTransaction.blockNumber,
            swapTransaction.tokenInSymbol,
            swapTransaction.tokenOutSymbol,
            swapTransaction.amountIn,
            swapTransaction.quotedPrice,
            swapTransaction.executedPrice,
            swapTransaction.gasFee,
            swapTransaction.slippageAmount,
            swapTransaction.slippagePercentage,
            swapTransaction.priceImpactPercentage,
            swapTransaction.thresholdPercentage,
        );
    }
}


export class MEVTransactions {
    constructor(
        public arbitrageTransactions: MEVArbitrageTransaction[],
        public sandwichTransactions: MEVSandwhichTransaction[],
    ) { }

    static fromServerResponse(response: any): MEVTransactions {
        return new MEVTransactions(
            MEVArbitrageTransaction.fromServerResponse(response),
            MEVSandwhichTransaction.fromServerResponse(response),
        );
    }
}

export class MEVArbitrageTransaction {
    constructor(
        public hash: string,
        public blockNumber: number,
        public start_amount: number,
        public end_amount: number,
        public profit_amount: number,
    ) { }

    static fromServerResponse(response: any): MEVArbitrageTransaction[] {
        const mevTransactions = JSON.parse(response['arbitrages'])
        const mevArbitrageTransactions: MEVArbitrageTransaction[] = []
        mevTransactions.forEach((mev: any) => {
            mevArbitrageTransactions.push(new MEVArbitrageTransaction(
                mev['transaction_hash'],
                mev['block_number'],
                mev['start_amount'],
                mev['end_amount'],
                mev['profit_amount'],
            ))
        })
        return mevArbitrageTransactions;
    }
}

export class MEVSandwhichTransaction {
    constructor(
        public blockNumber: number,
        public frontrun_hash: string,
        public backrunrun_hash: string,
        public profit_amount: number,
    ) { }

    static fromServerResponse(response: any): MEVSandwhichTransaction[] {
        const mevTransactions = JSON.parse(response['sandwiches'])
        const mevArbitrageTransactions: MEVSandwhichTransaction[] = []
        mevTransactions.forEach((mev: any) => {
            mevArbitrageTransactions.push(new MEVSandwhichTransaction(
                mev['block_number'],
                mev['frontrun_swap_transaction_hash'],
                mev['backrun_swap_transaction_hash'],
                mev['profit_amount'],
            ))
        })
        return mevArbitrageTransactions;
    }
}

export class MEVArbitrageTransactionTableModel {
    constructor(
        public hash: string,
        public blockNumber: number,
        public start_amount: number,
        public end_amount: number,
        public profit: number,
    ) { }

    static headers() {
        return [
            'Hash',
            'Block',
            'Start Amount',
            'End Amount',
            'Profit',
        ];
    }

    static fromMEVArbitrageTransaction(mevTransaction: MEVArbitrageTransaction): MEVArbitrageTransactionTableModel {
        return new MEVArbitrageTransactionTableModel(
            mevTransaction.hash,
            mevTransaction.blockNumber,
            mevTransaction.start_amount,
            mevTransaction.end_amount,
            mevTransaction.profit_amount,
        );
    }
}


export class MEVSandwichTransactionTableModel {
    constructor(
        public fronrun_hash: string,
        public backrun_hash: string,
        public blockNumber: number,
        public profit: number,
    ) { }

    static headers() {
        return [
            'Frontrun Hash',
            'Backrun Hash',
            'Block',
            'Profit',
        ];
    }

    static fromMEVSandwichTransaction(mevTransaction: MEVSandwhichTransaction): MEVSandwichTransactionTableModel {
        return new MEVSandwichTransactionTableModel(
            mevTransaction.frontrun_hash,
            mevTransaction.backrunrun_hash,
            mevTransaction.blockNumber,
            mevTransaction.profit_amount,
        );
    }
}


export class AggregatedSlippageAmount {
    constructor(
        public positiveSlippage: number,
        public negativeSlippage: number,
        public timestamp: number,
    ) { }

    static fromServerResponse(timestamp: number, serverResponse: any): AggregatedSlippageAmount {
        return new AggregatedSlippageAmount(
            serverResponse[0]['gainedAmount'],
            serverResponse[0]['lostAmount'],
            timestamp,
        )
    }
}

export class TokenVolumesSnapshot {
    constructor(
        public timestamp: number,
        public tokenVolumes: TokenVolume[],
    ) { }
}

export class TokenVolume {
    constructor(
        public tokenSymbol: string,
        public volumeIn: number,
        public volumeOut: number,
    ) {

    }
    get totalVolume() {
        return this.volumeIn + this.volumeOut;
    }

    static fromServerResponse(serverResponse: any): TokenVolume[] {
        const tokenVolumes: TokenVolume[] = []
        for (const rawToken of serverResponse) {
            tokenVolumes.push(new TokenVolume(
                rawToken.tokenMetadata.symbol,
                rawToken.volumeAsTokenIn,
                rawToken.volumeAsTokenOut,
            ))
        }
        return tokenVolumes;
    }

}

export class PoolVolatilitiesSnapshot {
    constructor(
        public timestamp: number,
        public poolVolatilities: PoolVolatility[],
    ) { }

    get averageVolatility() {
        return this.poolVolatilities.reduce((acc, poolVolatility) => acc + poolVolatility.volatility, 0) / this.poolVolatilities.length;
    }

    get averageVariance() {
        return this.poolVolatilities.reduce((acc, poolVolatility) => acc + poolVolatility.variance, 0) / this.poolVolatilities.length;
    }

    get averageATR() {
        return this.poolVolatilities.reduce((acc, poolVolatility) => acc + poolVolatility.averageTrueRange, 0) / this.poolVolatilities.length;
    }

    static fromServerResponse(timestamp: number, serverResponse: any): PoolVolatilitiesSnapshot {
        let poolVolatilities: PoolVolatility[] = [];

        serverResponse.forEach((poolVolatility: any) => {
            poolVolatilities.push(new PoolVolatility(
                timestamp,
                poolVolatility['poolAddress'],
                poolVolatility['atr'],
                poolVolatility['standardDeviation'],
                poolVolatility['variance'],
            ))
        })
        return new PoolVolatilitiesSnapshot(
            timestamp,
            poolVolatilities,
        )
    }
}

export class PoolVolatility {
    constructor(
        public timestamp: number,
        public poolAddress: string,
        public averageTrueRange: number,
        public volatility: number,
        public variance: number,
    ) { }
}

export class Token {
    constructor(
        public symbol: string,
        public address: string,
    ) { }
}

export class TokenPair {
    constructor(
        public tokenIn: Token,
        public tokenOut: Token,
    ) { }
}

export class LP {
    constructor(
        public address: string,
        public tokenPair: TokenPair,
    ) { }
}

export class LPInfo {
    constructor(
        public tvlUSD: number,
        public tvl0: number,
        public tvl1: number,
        public balance0: number,
        public balance1: number,
        public fee: number,
        public liquidity: number,
        public token0Price: number,
        public token1Price: number,
        public sqrtPrice: number,
        public blockNumber: number,
        public timestamp?: number,
    ) { }
    static async LPInfoFromServerResponse(serverResponse: any): Promise<LPInfo> {
        return {
            tvlUSD: serverResponse['totalValueLockedInTermOfToken1'],
            tvl0: serverResponse['ValueLockedToken0'],
            tvl1: serverResponse['ValueLockedToken1'],
            balance0: serverResponse['token0Balance'],
            balance1: serverResponse['token1Balance'],
            fee: serverResponse['feeProtocol'],
            liquidity: +serverResponse['liquidity'],
            token0Price: serverResponse['token0Price'],
            token1Price: serverResponse['token1Price'],
            sqrtPrice: serverResponse['sqrtPriceX96'],
            blockNumber: serverResponse['blockNumber'],
            timestamp: await getBlockTimestamp(serverResponse['blockNumber']),
        }
    }
}

export class LPSnapshot {
    constructor(
        public lp: LP,
        public info: LPInfo,
    ) { }
}

export type LPRegistry = Record<string, LPSnapshot[]>;



// export class LiquidityProviderReport {
//     constructor(
//         public owner: string,
//         public totalPositonMinted: number,
//         public totalPositionBurned: number,
//         public totalToken0Minted: number,
//         public totalToken1Minted: number,
//         public totalToken0MintedUSD: number,
//         public totalToken1MintedUSD: number,
//         public totalToken0Burned: number,
//         public totalToken1Burned: number,
//         public totalToken0BurnedUSD: number,
//         public totalToken1BurnedUSD: number,
//         public totalToken0Collected: number,
//         public totalToken1Collected: number,
//         public totalToken0CollectedUSD: number,
//         public totalToken1CollectedUSD: number,
//         public timestampStart: number,
//         public timestampEnd: number,
//     ) { }
//
//     public getToken0Price() {
//         if (this.totalToken0Minted === 0) {
//             return 0
//         }
//
//     }
//
//     public getNetInflowUSD() {
//         return this.totalToken0MintedUSD + this.totalToken1MintedUSD - this.totalToken0BurnedUSD - this.totalToken1BurnedUSD
//     }
//
//     public getNetInflowToken0() {
//         return this.totalToken0Minted - this.totalToken0Burned
//     }
//
//     public getNetInflowToken1() {
//         return this.totalToken1Minted - this.totalToken1Burned
//     }
//
//     public getCurrentValue() {
//         const currentToken1 = this.getNetInflowToken1() 
//         const currentToken0 = this.getNetInflowToken0() 
//     }
//
//     static fromServerResponse(serverResponse: any): LiquidityProviderReport {
//         const report = serverResponse['report']
//         return new LiquidityProviderReport(
//             serverResponse['owner'],
//             report['totalPositionMinted'],
//             report['totalPositionBurned'],
//             report['totalToken0Minted'],
//             report['totalToken1Minted'],
//             report['totalToken0MintedUSD'],
//             report['totalToken1MintedUSD'],
//             report['totalToken0Burned'],
//             report['totalToken1Burned'],
//             report['totalToken0BurnedUSD'],
//             report['totalToken1BurnedUSD'],
//             report['totalToken0Collected'],
//             report['totalToken1Collected'],
//             report['totalToken0CollectedUSD'],
//             report['totalToken1CollectedUSD'],
//             report['timestampStart'],
//             report['timestampEnd'],
//         )
//     }
// }