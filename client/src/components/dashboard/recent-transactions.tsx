import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  ShoppingBag, 
  Monitor, 
  DollarSign, 
  MapPin 
} from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  amount: string;
  date: string;
  type: string;
  categoryId: number;
  userId: number;
  accountId: number;
  notes: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export default function RecentTransactions({ 
  transactions, 
  isLoading = false 
}: RecentTransactionsProps) {
  // Get icon based on description (simplified version)
  const getIcon = (description: string) => {
    if (description.toLowerCase().includes('amazon') || description.toLowerCase().includes('purchase')) {
      return <ShoppingBag className="h-6 w-6 text-gray-500" />;
    } else if (description.toLowerCase().includes('netflix') || description.toLowerCase().includes('subscription')) {
      return <Monitor className="h-6 w-6 text-gray-500" />;
    } else if (description.toLowerCase().includes('salary') || description.toLowerCase().includes('deposit')) {
      return <DollarSign className="h-6 w-6 text-gray-500" />;
    } else {
      return <MapPin className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get payment method (simplified version)
  const getPaymentMethod = (transaction: Transaction) => {
    if (transaction.accountId === 1) return "Debit Card";
    if (transaction.accountId === 2) return "Savings";
    if (transaction.accountId === 3) return "Credit Card";
    return "Bank Transfer";
  };

  return (
    <Card>
      <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium text-gray-900">Recent Transactions</CardTitle>
        <Link href="/expenses" className="text-sm text-primary hover:text-indigo-700">
          View all
        </Link>
      </CardHeader>
      <CardContent className="border-t border-gray-200 p-0">
        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No recent transactions</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getIcon(transaction.description)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.categoryId === 7 ? 'Income' : 'Expense'} • {formatDate(new Date(transaction.date))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-secondary' : 'text-accent'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
                        </p>
                        <p className="text-xs text-gray-500">{getPaymentMethod(transaction)}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
