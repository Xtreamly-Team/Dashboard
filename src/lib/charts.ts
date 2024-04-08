import type { ApexOptions } from 'apexcharts';
export class ChartOptionsBuilder {
    constructor(
        private chartOptions: ApexOptions = {},
    ) {
        this.chartOptions = {
            chart: {},
            colors: [],
            annotations: {},
            stroke: {},
            plotOptions: {},
            fill: {},
            labels: [],
            subtitle: {},
            dataLabels: {},
            tooltip: {},
            grid: {},
            series: [],
            markers: {},
            xaxis: {},
            yaxis: {},
            legend: {},
            responsive: []
        }
    }

    build() {
        return this.chartOptions;
    }

    setLables(labels: string[]) {
        if (labels) {
            this.chartOptions.labels = labels
        }
    }

    setOverallOptions(overallChartOptions: ApexChart) {
        if (!this.chartOptions.chart) return this;
        if (overallChartOptions) this.chartOptions.chart = overallChartOptions;
        return this;
    }

    setColors(colors: string[]) {
        if (!this.chartOptions.colors) return this;
        if (colors) this.chartOptions.colors = colors;
        return this;
    }

    setAnnotations(annotationsOptions: ApexAnnotations) {
        if (!this.chartOptions.annotations) return this;
        if (annotationsOptions) this.chartOptions.annotations = annotationsOptions;
        return this;
    }

    setStroke(strokeOptions: ApexStroke) {
        if (!this.chartOptions.stroke) return this;
        if (strokeOptions) this.chartOptions.stroke = strokeOptions;
        return this;
    }

    setPlotOptions(plotOptions: ApexPlotOptions) {
        if (!this.chartOptions.plotOptions) return this;
        if (plotOptions) this.chartOptions.plotOptions = plotOptions;
        return this;
    }

    setFill(fillOptions: ApexFill) {
        if (!this.chartOptions.fill) return this;
        if (fillOptions) this.chartOptions.fill = fillOptions;
        return this;
    }

    setStates(statesOptions: ApexStates) {
        if (!this.chartOptions.states) return this;
        if (statesOptions) this.chartOptions.states = statesOptions;
        return this;
    }

    setSubtitle(subtitleOptions: ApexTitleSubtitle) {
        if (!this.chartOptions.subtitle) return this;
        if (subtitleOptions) this.chartOptions.subtitle = subtitleOptions;
        return this;
    }

    setDataLabels(dataLabelsOptions?: ApexDataLabels) {
        if (!this.chartOptions.dataLabels) return this;
        if (dataLabelsOptions) this.chartOptions.dataLabels = dataLabelsOptions;
        return this;
    }

    setTooltip(tooltipOptions?: ApexTooltip) {
        if (!this.chartOptions.tooltip) return this;
        if (tooltipOptions) this.chartOptions.tooltip = tooltipOptions
        return this;
    }

    setGrid(gridOptions?: ApexGrid) {
        if (!this.chartOptions.grid) return this;
        if (gridOptions) this.chartOptions.grid = gridOptions;
        return this;
    }

    setMarkers(markerOptions?: ApexMarkers) {
        if (!this.chartOptions.markers) return this;
        if (markerOptions) this.chartOptions.markers = markerOptions;
        return this;
    }

    setLegend(legendOptions?: ApexLegend) {
        if (!this.chartOptions.legend) return this;
        if (legendOptions) this.chartOptions.legend = legendOptions;
        return this;
    }

    setResponsive(breakpoints: ApexResponsive[]) {
        if (!this.chartOptions.responsive) return this;
        if (breakpoints) this.chartOptions.responsive = breakpoints;
        return this;
    }

    setXaxis(xaxisOptions?: ApexXAxis) {
        if (!this.chartOptions.xaxis) return this;
        if (xaxisOptions) this.chartOptions.xaxis = xaxisOptions
        return this;
    }

    setYaxis(yaxisOptions?: ApexYAxis) {
        if (!this.chartOptions.yaxis) return this;
        if (yaxisOptions) this.chartOptions.yaxis = yaxisOptions
        return this;
    }

    setSeries(series: ApexAxisChartSeries | ApexNonAxisChartSeries) {
        if (!this.chartOptions.series) return this;
        this.chartOptions.series = series;
        return this;
    }

}


export class SimpleDataPoint {
    constructor(
        public x: string,
        public y: number
    ) { }
}

export type DataSeries = ApexAxisChartSeries | ApexNonAxisChartSeries;

export function lineChart(dataPoints: DataSeries = [], dark = false) {
    let mainChartColors;

    if (dark) {
        mainChartColors = {
            backgroundColor: '#000000',
            borderColor: '#374151',
            labelColor: '#9CA3AF',
            opacityFrom: 0,
            opacityTo: 0.15,
            // opacityFrom: 0.55,
            // opacityTo: 0.35,
        };
    } else {
        mainChartColors = {
            backgroundColor: '#FFFFFF',
            borderColor: '#F3F4F6',
            labelColor: '#6B7280',
            opacityFrom: 0.55,
            opacityTo: 0.35,
        }
    }

    const chartOptionsBuilder = new ChartOptionsBuilder()

    chartOptionsBuilder.setSeries(dataPoints)

    chartOptionsBuilder.setOverallOptions({
        height: 420,
        type: 'line',
        fontFamily: 'Inter, sans-serif',
        // background: mainChartColors.backgroundColor,
        // foreColor: mainChartColors.labelColor,
        toolbar: {
            show: false
        }
    })

    chartOptionsBuilder.setDataLabels({
        enabled: false
    })

    chartOptionsBuilder.setTooltip({
        style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
        }
    })

    chartOptionsBuilder.setGrid({
        show: true,
        borderColor: mainChartColors.borderColor,
        strokeDashArray: 1,
        padding: {
            left: 35,
            bottom: 15
        }
    })

    chartOptionsBuilder.setStroke({
        curve: 'straight',
        width: 2,
        // colors: ['#000'],
    })


    chartOptionsBuilder.setMarkers({
        size: 0,
        strokeColors: '#ffffff',
        hover: {
            size: undefined,
            sizeOffset: 3
        }
    })

    chartOptionsBuilder.setXaxis({
        // categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
        type: 'datetime',
        // type: 'category',
        
        offsetX: -15,
        labels: {
            trim: true,
            style: {
                colors: mainChartColors.labelColor,
                fontSize: '12px',
                fontWeight: 500
            }
        },
        axisBorder: {
            color: mainChartColors.borderColor
        },
        axisTicks: {
            color: mainChartColors.borderColor
        },
        crosshairs: {
            show: true,
            position: 'back',
            stroke: {
                color: mainChartColors.borderColor,
                width: 1,
                dashArray: 10
            }
        },
        tooltip: {
            enabled: false
        }
    })

    chartOptionsBuilder.setYaxis({
        labels: {
            style: {
                colors: mainChartColors.labelColor,
                fontSize: '12px',
                fontWeight: 500
            },
            // formatter: function (value) {
            //     return '$' + value;
            // }
        }
    })

    chartOptionsBuilder.setLegend({
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        labels: {
            colors: [mainChartColors.labelColor]
        },
        itemMargin: {
            horizontal: 10
        }
    })

    chartOptionsBuilder.setResponsive([
        {
            breakpoint: 1024,
            options: {
                xaxis: {
                    labels: {
                        show: false
                    }
                }
            }
        }
    ])

    return chartOptionsBuilder

}

export function pieChart(dataPoints: number[], labels: string[], dark = false) {
    let mainChartColors;

    if (dark) {
        mainChartColors = {
            backgroundColor: '#000000',
            borderColor: '#374151',
            labelColor: '#9CA3AF',
            opacityFrom: 0,
            opacityTo: 0.15,
        };
    } else {
        mainChartColors = {
            backgroundColor: '#FFFFFF',
            borderColor: '#F3F4F6',
            labelColor: '#6B7280',
            opacityFrom: 0.55,
            opacityTo: 0.35,
        }
    }

    const chartOptionsBuilder = new ChartOptionsBuilder()

    chartOptionsBuilder.setSeries(dataPoints)

    chartOptionsBuilder.setOverallOptions({
        height: 420,
        type: 'pie',
        fontFamily: 'Inter, sans-serif',
        // background: mainChartColors.backgroundColor,
        // foreColor: mainChartColors.labelColor,
        toolbar: {
            show: false
        }
    })

    chartOptionsBuilder.setLables(labels)

    chartOptionsBuilder.setTooltip({
        style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
        }
    })

    chartOptionsBuilder.setLegend({
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        labels: {
            colors: [mainChartColors.labelColor]
        },
        itemMargin: {
            horizontal: 10
        }
    })

    return chartOptionsBuilder

}

export function fatbars(dataPoints: SimpleDataPoint[]) {
    const chartOptionsBuilder = new ChartOptionsBuilder()
    chartOptionsBuilder.setColors(['#1A56DB', '#FDBA8C'])

    chartOptionsBuilder.setSeries([
        {
            name: 'Quantity',
            color: '#EF562F',
            data: dataPoints,
        }
    ])

    chartOptionsBuilder.setOverallOptions({
        type: 'bar',
        height: '140px',
        fontFamily: 'Inter, sans-serif',
        foreColor: '#4B5563',
        toolbar: {
            show: false
        }
    })

    chartOptionsBuilder.setPlotOptions({
        bar: {
            columnWidth: '90%',
            borderRadius: 3
        }
    })

    chartOptionsBuilder.setTooltip({
        shared: false,
        intersect: false,
        style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
        }
    })

    chartOptionsBuilder.setStates({
        hover: {
            filter: {
                type: 'darken',
                value: 1
            }
        }
    })

    chartOptionsBuilder.setStroke({
        show: true,
        width: 5,
        colors: ['transparent']
    })

    chartOptionsBuilder.setGrid({
        show: false
    })

    chartOptionsBuilder.setDataLabels({
        enabled: false
    })

    chartOptionsBuilder.setLegend({
        show: false
    })

    chartOptionsBuilder.setXaxis({
        floating: false,
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    })

    chartOptionsBuilder.setYaxis({
        show: false
    })

    chartOptionsBuilder.setFill({
        opacity: 1
    })

    return chartOptionsBuilder.build()

}
