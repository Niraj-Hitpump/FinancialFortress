import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IncomeExpenseChartProps {
  data: {
    name: string;
    income: number;
    expenses: number;
  }[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const [timeframe, setTimeframe] = useState('last_6_months');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Income vs Expenses</h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              {timeframe === 'last_6_months' ? 'Last 6 months' : 
               timeframe === 'last_year' ? 'Last year' : 'Year to date'}
            </span>
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value)}
            >
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
                <SelectItem value="year_to_date">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value}`, '']}
                contentStyle={{ 
                  borderRadius: '0.375rem', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend 
                align="right" 
                verticalAlign="top" 
                iconType="circle"
                iconSize={8}
              />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="#F43F5E" 
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
