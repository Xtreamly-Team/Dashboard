export class DataPoint {
    constructor(
        public x: string,
        public y: number
    ) {}
}
export function fatbars(dataPoints: DataPoint[]) {
    return {
	colors: ['#1A56DB', '#FDBA8C'],
	series: [
		{
			name: 'Quantity',
			color: '#EF562F',
			data: dataPoints,
		}
	],
	chart: {
		type: 'bar',
		height: '140px',
		fontFamily: 'Inter, sans-serif',
		foreColor: '#4B5563',
		toolbar: {
			show: false
		}
	},
	plotOptions: {
		bar: {
			columnWidth: '90%',
			borderRadius: 3
		}
	},
	tooltip: {
		shared: false,
		intersect: false,
		style: {
			fontSize: '14px',
			fontFamily: 'Inter, sans-serif'
		}
	},
	states: {
		hover: {
			filter: {
				type: 'darken',
				value: 1
			}
		}
	},
	stroke: {
		show: true,
		width: 5,
		colors: ['transparent']
	},
	grid: {
		show: false
	},
	dataLabels: {
		enabled: false
	},
	legend: {
		show: false
	},
	xaxis: {
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
	},
	yaxis: {
		show: false
	},
	fill: {
		opacity: 1
	}
};
}



export default function normalBars (dark) {
    let mainChartColors;
    
	if (dark) {
		mainChartColors = {
			borderColor: '#374151',
			labelColor: '#9CA3AF',
			opacityFrom: 0,
			opacityTo: 0.15,
		};
	} else {
		mainChartColors = {
			borderColor: '#F3F4F6',
			labelColor: '#6B7280',
			opacityFrom: 0.45,
			opacityTo: 0,
		}
	}

	return {
		chart: {
			height: 420,
			type: 'area',
			fontFamily: 'Inter, sans-serif',
			foreColor: mainChartColors.labelColor,
			toolbar: {
				show: false
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				enabled: true,
				opacityFrom: mainChartColors.opacityFrom,
				opacityTo: mainChartColors.opacityTo
			}
		},
		dataLabels: {
			enabled: false
		},
		tooltip: {
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif'
			}
		},
		grid: {
			show: true,
			borderColor: mainChartColors.borderColor,
			strokeDashArray: 1,
			padding: {
				left: 35,
				bottom: 15
			}
		},
		series: [		],
		markers: {
			size: 5,
			strokeColors: '#ffffff',
			hover: {
				size: undefined,
				sizeOffset: 3
			}
		},
		xaxis: {
			categories: ['01 Febasdad', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
			labels: {
				style: {
					colors: [mainChartColors.labelColor],
					fontSize: '14px',
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
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: [mainChartColors.labelColor],
					fontSize: '14px',
					fontWeight: 500
				},
				formatter: function (value) {
					return '$' + value;
				}
			}
		},
		legend: {
			fontSize: '14px',
			fontWeight: 500,
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: [mainChartColors.labelColor]
			},
			itemMargin: {
				horizontal: 10
			}
		},
		responsive: [
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
		]
	};
}
