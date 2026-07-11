import React from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Database, ClipboardList, CircleCheck } from 'lucide-react';

interface Measurement {
  id: string;
  name: string;
  value: string;
}

interface Order {
  id: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export function Dashboard() {
  const [measurements] = useLocalStorage<Measurement[]>('measurements', []);
  const [orders] = useLocalStorage<Order[]>('orders', []);

  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#0D1B2A]">Dashboard Overview</h2>
      <p className="text-slate-600">A summary of your SartorGrid activity.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Measurements</CardTitle>
            <Database className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0D1B2A]">{measurements.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0D1B2A]">{orders.length - completedOrders}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completed Orders</CardTitle>
            <CircleCheck className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0D1B2A]">{completedOrders}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
