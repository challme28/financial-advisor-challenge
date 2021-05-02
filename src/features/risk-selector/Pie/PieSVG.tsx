import React from "react";
import * as d3 from "d3";
import {Data} from "../RiskSelector";
import {PieArcDatum} from "d3";

const Arc = ({data, index, createArc, colors}:
               {
                 data: PieArcDatum<Data>,
                 index: number,
                 createArc: any,
                 colors: (arg0: any) => string | undefined,
               }) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors(index)}/>
    <text
      transform={`translate(${createArc.centroid(data)})`}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
    >
      {data.data.label}
    </text>
  </g>
);

const Pie = (props: {
  innerRadius: number;
  outerRadius: number;
  data: Data[];
  width: number;
  height: number;
}) => {
  const createPie = d3
    .pie<Data>()
    .value(d => d.value)
    .sort(null);
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);
  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const data = createPie(props.data);

  return (
    <svg width={props.width} height={props.height}>
      <g transform={`translate(${props.width / 2} ${props.height / 2})`}>
        {data
          .filter((d: PieArcDatum<Data>) => !!d.value)
          .map((d: PieArcDatum<Data>, i) =>
            (
              <Arc
                key={i}
                data={d}
                index={i}
                createArc={createArc}
                colors={colors}
              />
            )
          )}
      </g>
    </svg>
  );
};

export default Pie;