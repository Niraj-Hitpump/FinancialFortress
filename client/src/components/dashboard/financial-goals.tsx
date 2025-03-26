import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface Goal {
  id: number;
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
  userId: number;
  status: string;
}

interface FinancialGoalsProps {
  goals: Goal[];
  isLoading?: boolean;
  userId: number;
  onGoalAdded: () => void;
}

const GoalForm = ({ userId, onSuccess }: { userId: number; onSuccess: () => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    status: "just_started"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/goals", {
        ...formData,
        userId,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount)
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">Goal Title</label>
          <input
            id="title"
            name="title"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="targetAmount" className="text-sm font-medium">Target Amount ($)</label>
            <input
              id="targetAmount"
              name="targetAmount"
              type="number"
              min="0"
              step="0.01"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.targetAmount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="currentAmount" className="text-sm font-medium">Current Amount ($)</label>
            <input
              id="currentAmount"
              name="currentAmount"
              type="number"
              min="0"
              step="0.01"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.currentAmount}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="targetDate" className="text-sm font-medium">Target Date</label>
          <input
            id="targetDate"
            name="targetDate"
            type="date"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.targetDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="status" className="text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="just_started">Just Started</option>
            <option value="on_track">On Track</option>
            <option value="falling_behind">Falling Behind</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Goal"}
        </Button>
      </div>
    </form>
  );
};

export default function FinancialGoals({ 
  goals, 
  isLoading = false,
  userId,
  onGoalAdded
}: FinancialGoalsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-secondary/10 text-secondary';
      case 'falling_behind':
        return 'bg-warning/10 text-warning';
      case 'just_started':
        return 'bg-info/10 text-info';
      case 'completed':
        return 'bg-success/10 text-success';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'falling_behind':
        return 'Falling Behind';
      case 'just_started':
        return 'Just Started';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown Status';
    }
  };
  
  const calculatePercentage = (current: string, target: string) => {
    const currentValue = parseFloat(current);
    const targetValue = parseFloat(target);
    if (targetValue <= 0) return 0;
    return Math.min(Math.round((currentValue / targetValue) * 100), 100);
  };
  
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-secondary';
      case 'falling_behind':
        return 'bg-warning';
      case 'just_started':
        return 'bg-info';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-gray-400';
    }
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    onGoalAdded();
    toast({
      title: "Goal created",
      description: "Your financial goal has been added successfully.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900">Financial Goals</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary hover:text-indigo-700"
            onClick={() => setIsFormOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {isLoading ? (
            <div className="text-center">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center text-gray-500">No financial goals yet</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
                
                return (
                  <div key={goal.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {getStatusLabel(goal.status)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          {formatCurrency(parseFloat(goal.currentAmount))} of {formatCurrency(parseFloat(goal.targetAmount))}
                        </span>
                        <span className="text-gray-900 font-medium">{percentage}%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <Progress 
                          value={percentage} 
                          className={getProgressColor(goal.status)}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>Target date: {formatDate(new Date(goal.targetDate))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Financial Goal</DialogTitle>
          </DialogHeader>
          <GoalForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
