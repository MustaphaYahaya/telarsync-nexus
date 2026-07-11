import React, { useState } from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Order {
  id: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const ORDER_STATUSES: Order['status'][] = ['Pending', 'In Progress', 'Completed'];

export function OrderTracker() {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [orderName, setOrderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName) return;
    const newOrder: Order = {
      id: new Date().toISOString(),
      name: orderName,
      status: 'Pending',
    };
    setOrders([...orders, newOrder]);
    setOrderName('');
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleStatusChange = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0D1B2A]">Order Tracker</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4 items-center">
            <Input
              placeholder="Order Name or ID"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Add Order</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-700 mt-6">Current Orders</h3>
        {orders.length === 0 ? (
           <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-500">No orders being tracked.</p>
           </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-800">{order.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
