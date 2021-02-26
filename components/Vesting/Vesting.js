import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { DeltaSection, DeltaSectionBlock } from '../Section';
import { DeltaTitleH2 } from '../Title';

const Vesting = () => {
  const [currentTime, setCurrentTime] = useState(1);
  const chartWidth = 400;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  });

  return <DeltaSection requiresConnectedWallet title="Delta Vesting Schedule">
    <DeltaTitleH2 center>Total Delta</DeltaTitleH2>
    <div className="w-full text-center">
      <svg viewBox="0 0 600 400">
        <VictoryPie
          standalone={false}
          width={chartWidth} height={400}
          style={{
            labels: { fill: "black" }, data: {
              fillOpacity: 1, stroke: "black", strokeWidth: 1
            }
          }}
          colorScale={["#38a169", "#e53e3e"]}
          categories={{ x: ["mature", "unmature"] }}
          innerRadius={110}
          labelRadius={125}
          labels={({ datum }) => `${datum.y}%`}
          data={[
            { x: "mature", y: 20 },
            { x: "unmature", y: 80 },
          ]}
        />
        <VictoryLabel
          textAnchor="middle"
          standalone={false}
          x={chartWidth / 2} y={190}
          lineHeight={[1.5, 1, 2]}
          style={[{ fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'gray' }]}
          text={['Time until fully', 'matured', currentTime]}
        />
        <VictoryLegend x={380} y={150} standalone={false}
          title=""
          centerTitle
          orientation="horizontal"
          itemsPerRow={1}
          data={[
            { name: "Mature", symbol: { fill: "#38a169" } },
            { name: "Unmature", symbol: { fill: "#e53e3e" } }
          ]}
        />
      </svg>
    </div>
    <DeltaSectionBlock>
      <DeltaTitleH2>
        <div className="mr-4 text-center">My Wallet</div>
      </DeltaTitleH2>
    </DeltaSectionBlock>
  </DeltaSection>
};

export default Vesting;
