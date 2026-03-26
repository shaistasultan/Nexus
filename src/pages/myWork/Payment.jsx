import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
} from "lucide-react";

const Payment = () => {
  const [balance, setBalance] = useState(25400.0);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      amount: 5000,
      sender: "Angel Investor",
      receiver: "You",
      status: "Completed",
      date: "2026-03-24",
    },
    {
      id: 2,
      amount: 1200,
      sender: "You",
      receiver: "Cloud Services",
      status: "Processing",
      date: "2026-03-25",
    },
    {
      id: 3,
      amount: 15000,
      sender: "Venture Capital",
      receiver: "You",
      status: "Completed",
      date: "2026-03-22",
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  // Simulation: Transfer / Funding Deal
  const handleSimulation = (type) => {
    setIsProcessing(true);
    setTimeout(() => {
      const amount = 1000;
      if (type === "deposit") setBalance((prev) => prev + amount);
      if (type === "withdraw") setBalance((prev) => prev - amount);

      const newTx = {
        id: Date.now(),
        amount,
        sender: type === "deposit" ? "External Investor" : "You",
        receiver: type === "deposit" ? "You" : "External Account",
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
      };

      setTransactions([newTx, ...transactions]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Financial Hub
          </h1>
          <p className="text-slate-500">
            Manage your deals, funding, and capital flow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Balance & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet size={120} />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                Available Balance
              </p>
              <h2 className="text-4xl font-bold mb-6">
                ${balance.toLocaleString()}
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSimulation("deposit")}
                  disabled={isProcessing}
                  className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                >
                  <ArrowDownLeft size={18} /> Deposit
                </button>
                <button
                  onClick={() => handleSimulation("withdraw")}
                  disabled={isProcessing}
                  className="flex-1 bg-slate-800 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  <ArrowUpRight size={18} /> Withdraw
                </button>
              </div>
            </div>

            {/* Funding Deal Flow Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-600">
                <RefreshCcw size={20} /> Funding Deal Flow
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    1
                  </div>
                  <p className="text-sm font-medium">Investor initiates deal</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    2
                  </div>
                  <p className="text-sm font-medium">
                    Agreement signed in Chamber
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                    3
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    Funds released to Wallet
                  </p>
                </div>
                <button
                  onClick={() => handleSimulation("deposit")}
                  className="w-full mt-2 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-colors"
                >
                  Simulate Deal Funding
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Transaction History Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                Transaction History
              </h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm">
                          {tx.sender === "You"
                            ? `To: ${tx.receiver}`
                            : `From: ${tx.sender}`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tx.sender === "You" ? "Withdrawal" : "Deposit"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                            tx.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {tx.status === "Completed" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {tx.date}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${tx.sender === "You" ? "text-slate-900" : "text-blue-600"}`}
                      >
                        {tx.sender === "You" ? "-" : "+"}$
                        {tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isProcessing && (
              <div className="p-8 text-center bg-white/80 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-500 font-medium">
                  Processing Transaction...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
