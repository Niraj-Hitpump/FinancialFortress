import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { PlusIcon, Trash2, Edit, CreditCard, Eye, EyeOff } from "lucide-react";
import AccountForm from "@/components/accounts/account-form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Accounts() {
  const userId = 1; // For demo purposes
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [showAccountNumbers, setShowAccountNumbers] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: [`/api/accounts?userId=${userId}`],
  });

  const totalBalance = accounts.reduce((sum: number, account: any) => {
    return sum + parseFloat(account.balance);
  }, 0);

  const toggleShowAccountNumber = (id: number) => {
    setShowAccountNumbers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/accounts/${id}`, undefined);
      queryClient.invalidateQueries({ queryKey: [`/api/accounts?userId=${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/dashboard?userId=${userId}`] });
      toast({ 
        title: "Account deleted", 
        description: "The account has been deleted successfully." 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete account. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
  };

  const handleFormSuccess = () => {
    setIsAddAccountOpen(false);
    setEditingAccount(null);
    queryClient.invalidateQueries({ queryKey: [`/api/accounts?userId=${userId}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/dashboard?userId=${userId}`] });
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Checking Account';
      case 'savings':
        return 'Savings Account';
      case 'credit_card':
        return 'Credit Card';
      case 'investment':
        return 'Investment Account';
      case 'retirement':
        return 'Retirement Account';
      default:
        return 'Other Account';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Account Name",
    },
    {
      accessorKey: "bankName",
      header: "Bank",
    },
    {
      accessorKey: "accountType",
      header: "Type",
      cell: ({ row }) => getAccountTypeLabel(row.original.accountType),
    },
    {
      accessorKey: "accountNumber",
      header: "Account Number",
      cell: ({ row }) => {
        const isVisible = showAccountNumbers[row.original.id];
        return (
          <div className="flex items-center">
            <span>{isVisible ? row.original.accountNumber : "••••••"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleShowAccountNumber(row.original.id)}
              className="ml-2 h-6 w-6"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const balance = parseFloat(row.original.balance);
        return (
          <span className={balance >= 0 ? "text-secondary font-medium" : "text-accent font-medium"}>
            {formatCurrency(balance)}
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
            onClick={() => handleEditAccount(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteAccount(row.original.id)}
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
          <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
          <p className="text-sm text-gray-500">Manage your bank accounts and credit cards</p>
        </div>
        <Button onClick={() => setIsAddAccountOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.length} accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                accounts
                  .filter((a: any) => a.accountType === "credit_card")
                  .reduce((sum: number, a: any) => sum + parseFloat(a.balance), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total credit card balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                accounts
                  .filter((a: any) => a.accountType === "savings")
                  .reduce((sum: number, a: any) => sum + parseFloat(a.balance), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total savings amount
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
          <CardDescription>
            Manage all your bank accounts, credit cards, and investment accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No accounts added yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add your first account to start tracking your finances.</p>
              <Button onClick={() => setIsAddAccountOpen(true)} className="mt-4">
                Add Account
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={accounts}
              searchColumn="name"
              searchPlaceholder="Search accounts..."
            />
          )}
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <AccountForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog 
        open={!!editingAccount} 
        onOpenChange={(open) => !open && setEditingAccount(null)}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          {editingAccount && (
            <AccountForm 
              userId={userId} 
              onSuccess={handleFormSuccess} 
              initialValues={editingAccount}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
