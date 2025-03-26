import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { 
  PlusIcon, 
  Trash2, 
  Edit, 
  CreditCard, 
  Eye, 
  EyeOff,
  ArrowUpDown,
  Building,
  Wallet,
  ShieldAlert,
  Clock,
  PiggyBank,
  LineChart
} from "lucide-react";
import AccountForm from "@/components/accounts/account-form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Accounts() {
  const userId = 1; // For demo purposes
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [showAccountNumbers, setShowAccountNumbers] = useState<Record<number, boolean>>({});
  const [animateCards, setAnimateCards] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Trigger animations when component mounts
    setTimeout(() => {
      setAnimateCards(true);
    }, 300);
  }, []);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: [`/api/accounts?userId=${userId}`],
  });

  const totalBalance = accounts.reduce((sum: number, account: any) => {
    return sum + parseFloat(account.balance);
  }, 0);

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <Wallet className="h-4 w-4" />;
      case 'savings':
        return <PiggyBank className="h-4 w-4" />;
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'investment':
        return <LineChart className="h-4 w-4" />;
      case 'retirement':
        return <Clock className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

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

  const getAccountTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-700';
      case 'savings':
        return 'bg-green-100 text-green-700';
      case 'credit_card':
        return 'bg-purple-100 text-purple-700';
      case 'investment':
        return 'bg-amber-100 text-amber-700';
      case 'retirement':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Account Name</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium flex items-center">
          {getAccountTypeIcon(row.original.accountType)}
          <span className="ml-2">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "bankName",
      header: "Bank",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.original.bankName}</span>
        </div>
      ),
    },
    {
      accessorKey: "accountType",
      header: "Type",
      cell: ({ row }) => (
        <Badge className={cn("font-normal", getAccountTypeBadgeColor(row.original.accountType))}>
          {getAccountTypeLabel(row.original.accountType)}
        </Badge>
      ),
    },
    {
      accessorKey: "accountNumber",
      header: "Account Number",
      cell: ({ row }) => {
        const isVisible = showAccountNumbers[row.original.id];
        return (
          <div className="flex items-center">
            <ShieldAlert className={`mr-2 h-4 w-4 ${isVisible ? 'text-amber-500' : 'text-muted-foreground'}`} />
            <span className="font-mono">{isVisible ? row.original.accountNumber : "••••••••"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleShowAccountNumber(row.original.id)}
              className="ml-2 h-6 w-6 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <div className="flex items-center space-x-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="-mr-3 h-8 data-[state=open]:bg-accent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Balance</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const balance = parseFloat(row.original.balance);
        return (
          <div className="text-right">
            <span className={`font-semibold gradient-text ${balance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {formatCurrency(balance)}
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
            onClick={() => handleEditAccount(row.original)}
            className="hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteAccount(row.original.id)}
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
        <div className="relative overflow-hidden rounded-lg p-8 bg-gradient-to-r from-indigo-600 to-blue-700">
          <div className="absolute inset-0 bg-grid-white/10 mask-image-gradient"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl mb-2">
                  Account Management
                </h1>
                <p className="text-indigo-100 max-w-[600px] md:text-lg">
                  Securely manage all your financial accounts in one place
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="animate-bounce-in transition-all hover:shadow-lg"
                onClick={() => setIsAddAccountOpen(true)}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className={`transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '100ms' }}>
          <Card variant="glass" animation="scale" bordered={false} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {formatCurrency(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {accounts.length} accounts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '200ms' }}>
          <Card variant="glass" animation="scale" bordered={false} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text bg-gradient-to-r from-purple-600 to-indigo-600">
                {formatCurrency(
                  accounts
                    .filter((a: any) => a.accountType === "credit_card")
                    .reduce((sum: number, a: any) => sum + parseFloat(a.balance), 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total credit card balance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className={`transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '300ms' }}>
          <Card variant="glass" animation="scale" bordered={false} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <PiggyBank className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text bg-gradient-to-r from-emerald-600 to-teal-600">
                {formatCurrency(
                  accounts
                    .filter((a: any) => a.accountType === "savings")
                    .reduce((sum: number, a: any) => sum + parseFloat(a.balance), 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total savings amount
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={`transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
           style={{ transitionDelay: '400ms' }}>
        <Card variant="glass" bordered={false} className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-2 flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              Your Accounts
            </CardTitle>
            <CardDescription>
              Manage all your bank accounts, credit cards, and investment accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 animate-pulse-subtle">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Loading accounts...</h3>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-muted-foreground/20 rounded-lg">
                <CreditCard className="mx-auto h-16 w-16 text-muted-foreground/40" />
                <h3 className="mt-4 text-xl font-medium">No accounts added yet</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Add your first account to start tracking your finances and get a complete view of your money.
                </p>
                <Button 
                  onClick={() => setIsAddAccountOpen(true)} 
                  className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add First Account
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
      </div>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="sm:max-w-[525px] animate-scale-in glass-dark">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Add your bank account, credit card, or investment account to track your finances.
            </DialogDescription>
          </DialogHeader>
          <AccountForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog 
        open={!!editingAccount} 
        onOpenChange={(open) => !open && setEditingAccount(null)}
      >
        <DialogContent className="sm:max-w-[525px] animate-scale-in glass-dark">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update your account details and settings.
            </DialogDescription>
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
