import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  userId: number;
  onSuccess: () => void;
  initialValues?: {
    id?: number;
    description: string;
    amount: string;
    date: string;
    type: string;
    categoryId: number;
    accountId: number;
    notes: string;
  };
  isEditing?: boolean;
}

export default function ExpenseForm({ 
  userId, 
  onSuccess, 
  initialValues,
  isEditing = false
}: ExpenseFormProps) {
  const defaultValues = {
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    type: "expense",
    categoryId: 1,
    accountId: 1,
    notes: "",
  };
  
  const [formData, setFormData] = useState({...defaultValues});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // Initialize form with initial values when they are available
  useEffect(() => {
    if (initialValues) {
      setFormData({
        description: initialValues.description || "",
        amount: initialValues.amount || "",
        date: initialValues.date || new Date().toISOString().split('T')[0],
        type: initialValues.type || "expense",
        categoryId: initialValues.categoryId || 1,
        accountId: initialValues.accountId || 1,
        notes: initialValues.notes || "",
      });
    }
  }, [initialValues]);
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: [`/api/categories?userId=${userId}`],
  });
  
  // Fetch accounts
  const { data: accounts = [] } = useQuery({
    queryKey: [`/api/accounts?userId=${userId}`],
  });
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(parseFloat(formData.amount))) {
      errors.amount = "Amount must be a valid number";
    }
    
    if (!formData.date) {
      errors.date = "Date is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const endpoint = isEditing 
        ? `/api/transactions/${initialValues?.id}` 
        : "/api/transactions";
      
      const method = isEditing ? "PUT" : "POST";
      
      // Ensure numeric fields are properly formatted
      // Create a proper date string in YYYY-MM-DD format
      const dateStr = formData.date;
      
      const submissionData = {
        description: formData.description.trim(),
        amount: formData.amount.toString(),
        date: dateStr,
        type: formData.type,
        categoryId: parseInt(formData.categoryId.toString()),
        accountId: parseInt(formData.accountId.toString()),
        userId: userId,
        notes: formData.notes?.trim() || null
      };
      
      console.log("Submitting data:", submissionData);
      
      await apiRequest(method, endpoint, submissionData);
      
      toast({
        title: isEditing ? "Transaction updated" : "Transaction added",
        description: isEditing 
          ? "Your transaction has been updated successfully." 
          : "Your transaction has been added successfully.",
      });
      
      // Reset form after successful submission if not editing
      if (!isEditing) {
        setFormData({...defaultValues});
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      // More detailed error handling
      let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} transaction.`;
      
      if (error.message) {
        errorMessage += ` ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Transaction Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger id="type" className="w-full mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={cn("mt-1", formErrors.description && "border-red-500")}
            required
          />
          {formErrors.description && (
            <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className={cn("mt-1", formErrors.amount && "border-red-500")}
              required
            />
            {formErrors.amount && (
              <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={cn("mt-1", formErrors.date && "border-red-500")}
              required
            />
            {formErrors.date && (
              <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={String(formData.categoryId)}
              onValueChange={(value) => handleSelectChange("categoryId", value)}
            >
              <SelectTrigger id="categoryId" className="w-full mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="accountId">Account</Label>
            <Select
              value={String(formData.accountId)}
              onValueChange={(value) => handleSelectChange("accountId", value)}
            >
              <SelectTrigger id="accountId" className="w-full mt-1">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account: any) => (
                  <SelectItem key={account.id} value={String(account.id)}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className={cn("w-full", isSubmitting && "opacity-70")}
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Adding...") 
          : (isEditing ? "Update Transaction" : "Add Transaction")}
      </Button>
    </form>
  );
}
