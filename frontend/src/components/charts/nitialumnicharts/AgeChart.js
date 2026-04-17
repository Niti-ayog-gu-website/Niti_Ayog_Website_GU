import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";



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

export default function AgeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
        
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="_id"
          angle={-30}
          tick={renderMultiLineTick}
            interval={0}
  height={80}
        />

        <YAxis />
        <Tooltip />

        <Bar dataKey="count" fill="#6366f1" radius={[6,6,0,0]} />

      </BarChart>
    </ResponsiveContainer>
  );
}