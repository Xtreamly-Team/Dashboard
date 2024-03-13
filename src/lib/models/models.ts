import { stableCoins } from "$lib/utils";

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
        return stableCoins.includes(this.tokenOutSymbol) ?
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
        public negativeSlippage: number
    ) { }

    static fromServerResponse(serverResponse: any): AggergatedSlippageAmount {
        return new AggergatedSlippageAmount(
            serverResponse[0]['gainedAmount'],
            serverResponse[0]['lostAmount'],
        )
    }
}
