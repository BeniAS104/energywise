import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// First, create a common options object for chart configurations
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'var(--black)',
        font: {
          size: 15,
          weight: 600
        },
        padding: 15
      }
    },
    tooltip: {
      titleColor: 'var(--black)',
      bodyColor: 'var(--black)',
      backgroundColor: 'var(--white)',
      borderColor: 'var(--gray)',
      borderWidth: 1,
      titleFont: {
        size: 16,
        weight: 600
      },
      bodyFont: {
        size: 13,
        weight: 400
      },
      padding: 10
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'var(--gray)',
        font: {
          size: 14
        }
      },
      grid: {
        color: 'var(--light-gray)',
        lineWidth: 1
      }
    },
    y: {
      ticks: {
        color: 'var(--gray)',
        font: {
          size: 12
        }
      },
      grid: {
        color: 'var(--light-gray)',
        lineWidth: 1
      }
    }
  },
  elements: {
    line: {
      borderWidth: 3,
      borderColor: 'var(--green)'
    },
    point: {
      radius: 4,
      hoverRadius: 6,
      backgroundColor: 'var(--white)',
      borderColor: 'var(--green)',
      borderWidth: 2
    },
    bar: {
      backgroundColor: 'var(--blue)',
      borderWidth: 0
    }
  }
};

// For the Doughnut chart, create a specific options object (no scales needed)
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'var(--black)',
        font: {
          size: 12,
          weight: 500
        },
        padding: 15,
        boxWidth: 12
      }
    },
    tooltip: {
      titleColor: 'var(--black)',
      bodyColor: 'var(--black)',
      backgroundColor: 'var(--white)',
      borderColor: 'var(--gray)',
      borderWidth: 1,
      titleFont: {
        size: 14,
        color: 'var(--black)',
        weight: 600
      },
      bodyFont: {
        size: 12,
        color: 'var(--black)',
        weight: 400
      },
      padding: 10
    }
  }
};

export default function Analytics({ appliances, energyCost }) {
  // Calculate total monthly consumption and cost
  const totalMonthlyConsumption = appliances.reduce((total, appliance) => {
    const hoursPerMonth = appliance.hoursPerDay * appliance.daysPerWeek * 4;
    const kWh = (appliance.watts / 1000) * hoursPerMonth;
    return total + kWh;
  }, 0);

  const totalMonthlyCost = totalMonthlyConsumption * energyCost;

  // Average household consumption data (example values)
  const avgMonthlyConsumption = 877; // kWh for average household
  const avgMonthlyCost = avgMonthlyConsumption * energyCost;

  // Prepare data for appliance distribution chart
  const applianceConsumptionData = {
    labels: appliances.map(app => app.name),
    datasets: [{
      label: 'Monthly Consumption (kWh)',
      data: appliances.map(app => {
        const hoursPerMonth = app.hoursPerDay * app.daysPerWeek * 4;
        return ((app.watts / 1000) * hoursPerMonth).toFixed(2);
      }),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ]
    }]
  };

  // Prepare data for monthly comparison chart
  const comparisonData = {
    labels: ['Your Consumption', 'Average Household'],
    datasets: [{
      label: 'Monthly Consumption (kWh)',
      data: [totalMonthlyConsumption.toFixed(2), avgMonthlyConsumption],
      backgroundColor: ['#36A2EB', '#FFCE56']
    }]
  };

  // Prepare data for daily usage pattern
  const dailyUsageData = {
    labels: appliances.map(app => app.name),
    datasets: [{
      label: 'Hours per Day',
      data: appliances.map(app => app.hoursPerDay),
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  };

  // Add this new data preparation for Cost vs Consumption
  const costVsConsumptionData = {
    labels: appliances.map(app => app.name),
    datasets: [
      {
        label: 'Consumption (kWh)',
        data: appliances.map(app => {
          const hoursPerMonth = app.hoursPerDay * app.daysPerWeek * 4;
          return ((app.watts / 1000) * hoursPerMonth).toFixed(2);
        }),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        yAxisID: 'consumption',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Cost ($)',
        data: appliances.map(app => {
          const hoursPerMonth = app.hoursPerDay * app.daysPerWeek * 4;
          const kWh = (app.watts / 1000) * hoursPerMonth;
          return (kWh * energyCost).toFixed(2);
        }),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        yAxisID: 'cost',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="analytics-container">
      <h2>Energy Analytics</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Monthly Consumption</h3>
          <p className="summary-value">{totalMonthlyConsumption.toFixed(2)} kWh</p>
          <p className="comparison">
            {totalMonthlyConsumption < avgMonthlyConsumption 
              ? '🌟 Below average' 
              : '⚠️ Above average'}
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Monthly Cost</h3>
          <p className="summary-value">${totalMonthlyCost.toFixed(2)}</p>
          <p className="comparison">
            {totalMonthlyCost < avgMonthlyCost 
              ? '💰 Saving money' 
              : '💸 Higher than average'}
          </p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Appliance Energy Distribution</h3>
          <Doughnut 
            data={applianceConsumptionData}
            options={doughnutOptions}
          />
        </div>

        <div className="chart-container">
          <h3>Consumption Comparison</h3>
          <Bar 
            data={comparisonData}
            options={chartOptions}
          />
        </div>

        <div className="chart-container">
          <h3>Daily Usage Pattern</h3>
          <Line 
            data={dailyUsageData}
            options={chartOptions}
          />
        </div>

        <div className="chart-container">
          <h3>Cost vs Consumption Trend</h3>
          <Line 
            data={costVsConsumptionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              scales: {
                consumption: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Consumption (kWh)'
                  }
                },
                cost: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Cost ($)'
                  },
                  grid: {
                    drawOnChartArea: false
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

Analytics.propTypes = {
  appliances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    watts: PropTypes.number.isRequired,
    hoursPerDay: PropTypes.number.isRequired,
    daysPerWeek: PropTypes.number.isRequired
  })).isRequired,
  energyCost: PropTypes.number.isRequired
}; 