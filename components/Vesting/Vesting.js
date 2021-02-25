import { VictoryPie, VictoryLabel } from 'victory';
import moment from 'moment';
import { DeltaSection } from '../Section';

const Vesting = () => {
  return <DeltaSection title="Delta Vesting Schedule">
    <svg viewBox="0 0 400 400">
      <VictoryPie
        standalone={false}
        width={400} height={400}
        style={{
          labels: { fill: "black" }, data: {
            fillOpacity: 1, stroke: "black", strokeWidth: 1
          }
        }}
        colorScale={["#e53e3e", "#38a169"]}
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
        x={200} y={170}
        lineHeight={[1.5, 1, 2]}
        style={[{ fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'gray' }]}
        text={['Time until fully', 'matured', `${moment().endOf('minute').fromNow()}`]}
      />
    </svg>
  </DeltaSection>
};

export default Vesting;
