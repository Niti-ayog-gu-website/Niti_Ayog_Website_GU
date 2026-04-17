import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const renderMultiLineTick = (props) => {
  const { x, y, payload } = props;

  // Split words smartly into 2–3 lines
  const words = payload.value.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).length < 12) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine.trim());
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine.trim());

  return (
    <g transform={`translate(${x},${y + 10})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={i * 12}
          textAnchor="middle"
          fontSize={12}
          fill="#030912"
          fontWeight={500}
        >
          {line}
        </text>
      ))}
    </g>
  );
};


export default function WorkChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="_id"
          tick={renderMultiLineTick}
            interval={0}
  height={80}
/>
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}