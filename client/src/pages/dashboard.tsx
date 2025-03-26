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
  ClockIcon,
  TrendingUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import ExpenseForm from "@/components/expenses/expense-form";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [animateStats, setAnimateStats] = useState(false);
  
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
  
  useEffect(() => {
    // Trigger animations when component mounts
    setTimeout(() => {
      setAnimateStats(true);
    }, 300);
  }, []);
  
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
    <div className="fade-in space-y-6">
      {/* Header with gradient background */}
      <div className="rounded-lg overflow-hidden animate-scale-in">
        <div className="relative overflow-hidden rounded-lg p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute inset-0 bg-grid-white/10 mask-image-gradient"></div>
          <div className="relative z-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              <div className="col-span-2">
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl mb-2">
                  Financial Dashboard
                </h1>
                <p className="text-blue-100 max-w-[600px] mb-4 md:text-lg">
                  Take control of your finances with real-time analytics and insights.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    variant="secondary" 
                    className="animate-bounce-in transition-all hover:shadow-lg"
                    onClick={() => setIsExpenseFormOpen(true)}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Reports
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <Activity className="h-32 w-32 text-white/30 animate-float" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '100ms' }}>
          <StatCard
            title="Total Balance"
            value={formatCurrency(totalBalance)}
            icon={<DollarSign />}
            iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            iconColor="text-white"
            change={{ value: "+2.5%", type: "increase", text: "from last month" }}
          />
        </div>
        
        <div className={`transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '200ms' }}>
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(monthlyExpenses)}
            icon={<WalletIcon />}
            iconBgColor="bg-gradient-to-br from-rose-500 to-rose-600"
            iconColor="text-white"
            change={{ value: "-8.1%", type: "decrease", text: "from last month" }}
          />
        </div>
        
        <div className={`transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '300ms' }}>
          <StatCard
            title="Savings Rate"
            value={`${savingsRate}%`}
            icon={<PiggyBankIcon />}
            iconBgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
            iconColor="text-white"
            change={{ value: "+1.2%", type: "increase", text: "from last month" }}
          />
        </div>
        
        <div className={`transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
             style={{ transitionDelay: '400ms' }}>
          <StatCard
            title="Upcoming Bills"
            value={formatCurrency(upcomingBills)}
            icon={<ClockIcon />}
            iconBgColor="bg-gradient-to-br from-amber-500 to-amber-600"
            iconColor="text-white"
            change={{ value: "5 days", type: "neutral", text: "until next due" }}
          />
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="hover-scale glass-dark border-0 shadow-lg overflow-hidden animate-slide-up"
              style={{ animationDelay: '500ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-2 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Expense Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={expenseChartData} />
          </CardContent>
        </Card>
        <Card className="hover-scale glass-dark border-0 shadow-lg overflow-hidden animate-slide-up"
              style={{ animationDelay: '600ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mr-2 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              Income vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={incomeExpenseData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions and upcoming events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
          <RecentTransactions 
            transactions={recentTransactions} 
            isLoading={isLoading} 
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
          <UpcomingEvents 
            events={upcomingEvents} 
            isLoading={isLoading} 
            userId={userId}
            onEventAdded={handleEventAdded}
          />
        </div>
      </div>

      {/* Financial goals section */}
      <div className="animate-slide-up" style={{ animationDelay: '900ms' }}>
        <FinancialGoals 
          goals={goals} 
          isLoading={isLoading} 
          userId={userId}
          onGoalAdded={handleGoalAdded}
        />
      </div>
      
      {/* Expense form dialog */}
      <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
        <DialogContent className="sm:max-w-[525px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Track your spending by adding a new expense to your account.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm userId={userId} onSuccess={handleExpenseAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
