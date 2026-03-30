import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, amount, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirm(); // Trigger actual booking logic
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="bg-white dark:bg-darkcard w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-darkborder relative"
        >
          {success ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-64">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-500 text-sm">Your session is confirmed.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gray-50 dark:bg-darkbg p-6 border-b border-gray-100 dark:border-darkborder flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <CreditCard className="text-primary-500" /> Secure Checkout
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-green-500" /> 256-bit SSL Encrypted
                  </p>
                </div>
                <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Form (Mock) */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center bg-primary-50 dark:bg-primary-900/20 px-4 py-3 rounded-xl border border-primary-100 dark:border-primary-900/30">
                   <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Amount</span>
                   <span className="text-2xl font-black text-primary-600 dark:text-primary-400">₹{amount}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Card Number</label>
                    <input type="text" placeholder="1234 5678 9101 1121" disabled={loading} className="w-full bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="flex gap-3">
                     <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Expiry</label>
                       <input type="text" placeholder="MM/YY" disabled={loading} className="w-full bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                     </div>
                     <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">CVC</label>
                       <input type="password" placeholder="***" disabled={loading} className="w-full bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white" />
                     </div>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-400 text-white font-bold py-3.5 rounded-xl mt-4 shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    `Pay ₹${amount} securely`
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                  By confirming this payment, you agree to our Terms of Service and Cancellation Policy.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
