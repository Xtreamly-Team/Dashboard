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
        );
    }
}

export class AggergatedSlippageAmount {
    constructor(
        public positiveSlippage: number,
        public negativeSlippage: number,
        public timestamp: number,
    ) { }

    static fromServerResponse(timestamp: number, serverResponse: any): AggergatedSlippageAmount {
        return new AggergatedSlippageAmount(
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

export type LPInfo = {
    tvlUSD: number,
    tvl0: number,
    tvl1: number,
    balance0: number,
    balance1: number,
    fee: number,
    liquidity: number,
    token0Price: number,
    token1Price: number,
    sqrtPrice: number,
    blockNumber: number,
    timestamp?: number,
}

export class LPSnapshot {
    constructor(
        public address: string,
        public tokenPair: TokenPair,
        public info: LPInfo | null = null,
    ) { }

    static async LPInfoFromServerResponse(serverResponse: any): Promise<LPInfo> {
        return {
            tvlUSD: serverResponse['totalValueLockedInTermOfToken1'],
            tvl0: serverResponse['ValueLockedToken0'],
            tvl1: serverResponse['ValueLockedToken1'],
            balance0: serverResponse['token0Balance'],
            balance1: serverResponse['token1Balance'],
            fee: serverResponse['feeProtocol'],
            liquidity: serverResponse['liquidity'],
            token0Price: serverResponse['token0Price'],
            token1Price: serverResponse['token1Price'],
            sqrtPrice: serverResponse['sqrtPriceX96'],
            blockNumber: serverResponse['blockNumber'],
            timestamp: await getBlockTimestamp(serverResponse['blockNumber']),
        }
    }
}
