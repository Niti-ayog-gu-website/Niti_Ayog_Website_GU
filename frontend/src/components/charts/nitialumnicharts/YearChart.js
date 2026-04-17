import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function YearChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis
  dataKey="_id"
  tick={{ fontSize: 10 }}
/>
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#4f46e5" />
      </LineChart>
    </ResponsiveContainer>
  );
}