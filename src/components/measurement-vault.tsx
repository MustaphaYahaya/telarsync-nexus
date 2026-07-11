import React, { useState } from 'react';
import useLocalStorage from '../hooks/use-local-storage';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2 } from 'lucide-react';

interface Measurement {
  id: string;
  name: string;
  value: string;
}

export function MeasurementVault() {
  const [measurements, setMeasurements] = useLocalStorage<Measurement[]>('measurements', []);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;
    const newMeasurement: Measurement = {
      id: new Date().toISOString(),
      name,
      value,
    };
    setMeasurements([...measurements, newMeasurement]);
    setName('');
    setValue('');
  };

  const handleDelete = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Measurement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Measurement Name (e.g., Height)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Value (e.g., 180cm)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button type="submit">Add Measurement</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-700 mt-6">Saved Measurements</h3>
        {measurements.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-500">No measurements saved yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {measurements.map((m) => (
              <Card key={m.id} className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-800">{m.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0D1B2A]">{m.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}