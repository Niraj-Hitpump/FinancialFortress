import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PlusIcon, Trash2, Edit, FileDown } from "lucide-react";
import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseChart from "@/components/dashboard/expense-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      header: "Date",
      cell: ({ row }) => formatDate(new Date(row.original.date)),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => getCategoryName(row.original.categoryId),
    },
    {
      accessorKey: "accountId",
      header: "Account",
      cell: ({ row }) => getAccountName(row.original.accountId),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "income" ? "success" : "destructive"}>
          {row.original.type === "income" ? "Income" : "Expense"}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.original.amount);
        const formattedAmount = formatCurrency(amount);
        return (
          <span className={row.original.type === "income" ? "text-secondary font-medium" : "text-accent font-medium"}>
            {row.original.type === "income" ? "+" : "-"}{formattedAmount}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEditTransaction(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteTransaction(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expense Tracker</h1>
          <p className="text-sm text-gray-500">Manage and track your expenses and income</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddExpenseOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Transactions</CardTitle>
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
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Expenses</CardTitle>
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
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Income</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={expenseChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Monthly spending trends chart will appear here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <ExpenseForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog 
        open={!!editingTransaction} 
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
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
