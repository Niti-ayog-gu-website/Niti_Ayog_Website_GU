import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  "Working/Employed (Engaged in an economic activity)": "#10B981", // green
  "Unemployed (Seeking/Available for work)": "#F59E0B", // orange
  "Not in Labour Force (e.g., Domestic Duties, Pensioner, Illness, Not seeking work)": "#EF4444" // red
};
export default function Work365Chart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
       <Pie data={data} dataKey="count" nameKey="_id">
  {data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[entry._id] || "#8884d8"} />
  ))}
</Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}