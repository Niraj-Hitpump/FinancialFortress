import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  PlusIcon, 
  Trash2, 
  Edit, 
  FileDown, 
  ArrowUpDown, 
  CreditCard,
  TrendingUp,
  Activity 
} from "lucide-react";
import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseChart from "@/components/dashboard/expense-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Function to export transactions to CSV
const exportTransactions = (transactions: any[]) => {
  // Define the headers for the CSV
  const headers = [
    "ID",
    "Date",
    "Description",
    "Category",
    "Account",
    "Type",
    "Amount",
    "Notes"
  ];
  
  try {
    // Convert each transaction to a CSV row
    const rows = transactions.map(trans => {
      // Format date
      const date = formatDate(new Date(trans.date));
      // Format amount with proper sign based on type
      const amount = trans.type === "income" ? 
        parseFloat(trans.amount) : 
        -parseFloat(trans.amount);
      
      return [
        trans.id,
        date,
        trans.description,
        trans.categoryId, // This would be better with category name
        trans.accountId, // This would be better with account name
        trans.type,
        amount,
        trans.notes || ""
      ].join(",");
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows
    ].join("\n");
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Set up download attributes
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `finance-transactions-${today}.csv`);
    link.style.visibility = "hidden";
    
    // Append to document, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting transactions:", error);
    // Could show a toast message here
  }
};

// For the expense chart
const expenseChartData = [
  { name: "Housing", value: 35, color: "#4F46E5" },
  { name: "Food", value: 20, color: "#10B981" },
  { name: "Transportation", value: 15, color: "#F43F5E" },
  { name: "Entertainment", value: 10, color: "#FBBF24" },
  { name: "Utilities", value: 15, color: "#60A5FA" },
  { name: "Other", value: 5, color: "#9CA3AF" },
];

export default function Expenses() {
  const userId = 1; // For demo purposes
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [animateCards, setAnimateCards] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Trigger animations when component mounts
    setTimeout(() => {
      setAnimateCards(true);
    }, 300);
  }, []);

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: [`/api/transactions?userId=${userId}`],
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: [`/api/categories?userId=${userId}`],
  });

  const { data: accounts = [] } = useQuery({
    queryKey: [`/api/accounts?userId=${userId}`],
  });

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getAccountName = (accountId: number) => {
    const account = accounts.find((a: any) => a.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/transactions/${id}`, undefined);
      queryClient.invalidateQueries({ queryKey: [`/api/transactions?userId=${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/dashboard?userId=${userId}`] });
      toast({ 
        title: "Transaction deleted", 
        description: "The transaction has been deleted successfully." 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete transaction. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  const handleFormSuccess = () => {
    setIsAddExpenseOpen(false);
    setEditingTransaction(null);
    queryClient.invalidateQueries({ queryKey: [`/api/transactions?userId=${userId}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/dashboard?userId=${userId}`] });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Date</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{formatDate(new Date(row.original.date))}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.description}</div>
      ),
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => (
        <div className="font-medium">{getCategoryName(row.original.categoryId)}</div>
      ),
    },
    {
      accessorKey: "accountId",
      header: "Account",
      cell: ({ row }) => (
        <div className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{getAccountName(row.original.accountId)}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "income" ? "success" : "destructive"} className="animate-fade-in">
          {row.original.type === "income" ? "Income" : "Expense"}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div className="flex items-center space-x-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Amount</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.original.amount);
        const formattedAmount = formatCurrency(amount);
        const isIncome = row.original.type === "income";
        return (
          <div className="text-right font-medium">
            <span className={`${isIncome ? "text-emerald-500" : "text-rose-500"} gradient-text font-semibold`}>
              {isIncome ? "+" : "-"}{formattedAmount}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEditTransaction(row.original)}
            className="hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteTransaction(row.original.id)}
            className="hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header with gradient background */}
      <div className="rounded-lg overflow-hidden animate-scale-in">
        <div className="relative overflow-hidden rounded-lg p-8 bg-gradient-to-r from-rose-600 to-purple-700">
          <div className="absolute inset-0 bg-grid-white/10 mask-image-gradient"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl mb-2">
                  Expense Tracker
                </h1>
                <p className="text-rose-100 max-w-[600px] md:text-lg">
                  Track and manage your expenses and income with ease
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all"
                  onClick={() => exportTransactions(transactions)}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="secondary" 
                  className="animate-bounce-in transition-all hover:shadow-lg"
                  onClick={() => setIsAddExpenseOpen(true)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start mb-4 bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">All Transactions</TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white transition-all">Expenses</TabsTrigger>
          <TabsTrigger value="income" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 animate-fade-in">
          <Card variant="glass" bordered={false} className="shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                All Transactions
              </CardTitle>
              <CardDescription>View and manage all your financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={transactions}
                searchColumn="description"
                searchPlaceholder="Search transactions..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4 animate-fade-in">
          <Card variant="glass" bordered={false} className="shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-rose-500" />
                Expenses
              </CardTitle>
              <CardDescription>Track where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={transactions.filter((t: any) => t.type === "expense")}
                searchColumn="description"
                searchPlaceholder="Search expenses..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="income" className="space-y-4 animate-fade-in">
          <Card variant="glass" bordered={false} className="shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                Income
              </CardTitle>
              <CardDescription>Track your earnings and revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={transactions.filter((t: any) => t.type === "income")}
                searchColumn="description"
                searchPlaceholder="Search income..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '200ms' }}>
          <Card variant="glass" bordered={false} className="shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-2 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                Expense Categories
              </CardTitle>
              <CardDescription>How your spending is distributed</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart data={expenseChartData} />
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '300ms' }}>
          <Card variant="glass" bordered={false} className="shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mr-2 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                Monthly Trends
              </CardTitle>
              <CardDescription>Your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-center animate-pulse-subtle">
                  <Activity className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p>Monthly spending trends chart will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[525px] animate-scale-in glass-dark">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record a new transaction to keep track of your finances
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog 
        open={!!editingTransaction} 
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent className="sm:max-w-[525px] animate-scale-in glass-dark">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the details of this transaction
            </DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <ExpenseForm 
              userId={userId} 
              onSuccess={handleFormSuccess} 
              initialValues={editingTransaction}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
