import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/stat-card";
import ExpenseChart from "@/components/dashboard/expense-chart";
import IncomeExpenseChart from "@/components/dashboard/income-expense-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import FinancialGoals from "@/components/dashboard/financial-goals";
import { 
  Download, 
  PlusIcon, 
  DollarSign, 
  WalletIcon, 
  PiggyBankIcon, 
  ClockIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import ExpenseForm from "@/components/expenses/expense-form";
import { formatCurrency } from "@/lib/utils";

// For the charts
const expenseChartData = [
  { name: "Housing", value: 35, color: "#4F46E5" },
  { name: "Food", value: 20, color: "#10B981" },
  { name: "Transportation", value: 15, color: "#F43F5E" },
  { name: "Entertainment", value: 10, color: "#FBBF24" },
  { name: "Utilities", value: 15, color: "#60A5FA" },
  { name: "Other", value: 5, color: "#9CA3AF" },
];

const incomeExpenseData = [
  { name: "Dec", income: 4200, expenses: 3100 },
  { name: "Jan", income: 4300, expenses: 3500 },
  { name: "Feb", income: 4200, expenses: 3300 },
  { name: "Mar", income: 4400, expenses: 3400 },
  { name: "Apr", income: 4500, expenses: 3700 },
  { name: "May", income: 4300, expenses: 3800 },
];

export default function Dashboard() {
  const userId = 1; // For demo purposes
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  
  const { 
    data: dashboardData = {}, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: [`/api/dashboard?userId=${userId}`],
  });
  
  const {
    totalBalance = 0,
    monthlyExpenses = 0,
    savingsRate = 0,
    upcomingBills = 0,
    recentTransactions = [],
    upcomingEvents = [],
    goals = [],
    accounts = []
  } = dashboardData;
  
  const handleExpenseAdded = () => {
    setIsExpenseFormOpen(false);
    refetch();
  };
  
  const handleEventAdded = () => {
    refetch();
  };
  
  const handleGoalAdded = () => {
    refetch();
  };
  
  return (
    <div className="fade-in">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Financial Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your financial health</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button variant="outline" size="sm" className="mr-3">
            <Download className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Export
          </Button>
          <Button onClick={() => setIsExpenseFormOpen(true)}>
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={<DollarSign />}
          iconBgColor="bg-secondary/10"
          iconColor="text-secondary"
          change={{ value: "+2.5%", type: "increase", text: "from last month" }}
        />
        
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          icon={<WalletIcon />}
          iconBgColor="bg-accent/10"
          iconColor="text-accent"
          change={{ value: "+8.1%", type: "decrease", text: "from last month" }}
        />
        
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={<PiggyBankIcon />}
          iconBgColor="bg-info/10"
          iconColor="text-info"
          change={{ value: "+1.2%", type: "increase", text: "from last month" }}
        />
        
        <StatCard
          title="Upcoming Bills"
          value={formatCurrency(upcomingBills)}
          icon={<ClockIcon />}
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
          change={{ value: "5 days", type: "neutral", text: "until next due" }}
        />
      </div>

      {/* Charts section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseChart data={expenseChartData} />
        <IncomeExpenseChart data={incomeExpenseData} />
      </div>

      {/* Recent transactions and upcoming events */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions 
          transactions={recentTransactions} 
          isLoading={isLoading} 
        />
        <UpcomingEvents 
          events={upcomingEvents} 
          isLoading={isLoading} 
          userId={userId}
          onEventAdded={handleEventAdded}
        />
      </div>

      {/* Financial goals section */}
      <div className="mt-8">
        <FinancialGoals 
          goals={goals} 
          isLoading={isLoading} 
          userId={userId}
          onGoalAdded={handleGoalAdded}
        />
      </div>
      
      {/* Expense form dialog */}
      <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm userId={userId} onSuccess={handleExpenseAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
