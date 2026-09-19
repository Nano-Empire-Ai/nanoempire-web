"use client";

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function TapePage() {
  const [data, setData] = useState<{time: string, price: number}[]>([]);
  
  // Generate simulated data on mount
  useEffect(() => {
    const points = [];
    let currentPrice = 2.78;
    const now = new Date();
    
    // Generate last 24 hours of data points (e.g. every 30 mins -> 48 points)
    for (let i = 48; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30 * 60000);
      
      // Random walk around 2.78
      const change = (Math.random() - 0.5) * 0.05;
      currentPrice = currentPrice + change;
      
      // Mean reversion
      if (currentPrice > 2.90) currentPrice -= 0.02;
      if (currentPrice < 2.65) currentPrice += 0.02;
      
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: Number(currentPrice.toFixed(3))
      });
    }
    
    setData(points);
    
    // Simulate live updates
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        let newPrice = last.price + (Math.random() - 0.5) * 0.05;
        if (newPrice > 2.90) newPrice -= 0.02;
        if (newPrice < 2.65) newPrice += 0.02;
        
        const newPoints = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: Number(newPrice.toFixed(3))
        }];
        return newPoints;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#00ff00] p-6 font-mono selection:bg-[#00ff00] selection:text-black flex flex-col">
      <div className="border-b border-[#333] pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tighter text-[#00ff00] drop-shadow-[0_0_8px_rgba(0,255,0,0.8)] uppercase">
          The Printed Price - Compute Desk
        </h1>
        <p className="text-sm text-green-700 uppercase tracking-widest mt-2">
          Live OCPI (Ornn Compute Price Index) Tape
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        <div className="lg:col-span-2 border border-[#333] bg-[#050505] p-4 relative overflow-hidden group">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
          
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h2 className="text-xl font-bold mb-1">H100 (SXM) - 24Hr Spot</h2>
              <div className="text-sm text-green-800">OCPI Index Real-Time</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-[#00ff00] drop-shadow-[0_0_10px_rgba(0,255,0,0.6)]">
                ${data.length > 0 ? data[data.length - 1].price.toFixed(3) : '2.780'}
              </div>
              <div className="text-sm text-green-600 animate-pulse">LIVE &bull;</div>
            </div>
          </div>
          
          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#333" 
                  tick={{ fill: '#005500', fontSize: 12 }}
                  tickLine={{ stroke: '#333' }}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['dataMin - 0.05', 'dataMax + 0.05']}
                  stroke="#333" 
                  tick={{ fill: '#005500', fontSize: 12 }}
                  tickLine={{ stroke: '#333' }}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                  orientation="right"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff00', color: '#00ff00' }}
                  itemStyle={{ color: '#00ff00' }}
                  labelStyle={{ color: '#00aa00' }}
                />
                <Line 
                  type="stepAfter"
                  dataKey="price" 
                  stroke="#00ff00" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#000', stroke: '#00ff00', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-[#333] bg-[#0a0a0a] p-5 hover:border-[#00ff00] transition-colors duration-300">
            <h3 className="text-lg text-green-600 mb-2">H200 - 1 Hr Spot</h3>
            <div className="text-3xl font-bold">$3.420</div>
            <div className="text-xs text-green-800 mt-2">vs CW: +$0.12 | vs AWS: -$0.41</div>
          </div>
          
          <div className="border border-[#333] bg-[#0a0a0a] p-5 hover:border-[#00ff00] transition-colors duration-300">
            <h3 className="text-lg text-green-600 mb-2">B200 - FWD Curve (30d)</h3>
            <div className="text-3xl font-bold">$4.950</div>
            <div className="text-xs text-green-800 mt-2">Volume: 42,000 GH/s</div>
          </div>
          
          <div className="border border-[#333] bg-[#0a0a0a] p-5 h-48 flex flex-col justify-between">
            <h3 className="text-lg text-green-600 mb-2">SYSTEM STATUS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NODE_CONN</span>
                <span className="text-[#00ff00]">SECURE</span>
              </div>
              <div className="flex justify-between">
                <span>LATENCY</span>
                <span className="text-[#00ff00]">12ms</span>
              </div>
              <div className="flex justify-between">
                <span>DATA_STREAM</span>
                <span className="text-[#00ff00]">ACTIVE</span>
              </div>
            </div>
            <div className="w-full h-1 bg-[#111] mt-4">
              <div className="h-full bg-[#00ff00] w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t border-[#333] pt-4 text-xs text-green-800 flex justify-between">
        <p>Powered by Nano Empire AI x402 Arbitrage Gateway</p>
        <p>Data provided by Ornn Exchange</p>
      </div>
    </div>
  );
}
