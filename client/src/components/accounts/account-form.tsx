import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AccountFormProps {
  userId: number;
  onSuccess: () => void;
  initialValues?: {
    id?: number;
    name: string;
    accountNumber: string;
    bankName: string;
    accountType: string;
    balance: string;
    notes: string;
  };
  isEditing?: boolean;
}

export default function AccountForm({ 
  userId, 
  onSuccess, 
  initialValues,
  isEditing = false
}: AccountFormProps) {
  const defaultValues = {
    name: "",
    accountNumber: "",
    bankName: "",
    accountType: "checking",
    balance: "",
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
        name: initialValues.name || "",
        accountNumber: initialValues.accountNumber || "",
        bankName: initialValues.bankName || "",
        accountType: initialValues.accountType || "checking",
        balance: initialValues.balance || "",
        notes: initialValues.notes || "",
      });
    }
  }, [initialValues]);
  
  // Validate the form data
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Account name is required";
    }
    
    if (!formData.bankName.trim()) {
      errors.bankName = "Bank name is required";
    }
    
    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    }
    
    if (!formData.balance) {
      errors.balance = "Balance is required";
    } else if (isNaN(parseFloat(formData.balance))) {
      errors.balance = "Balance must be a valid number";
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
        ? `/api/accounts/${initialValues?.id}` 
        : "/api/accounts";
      
      const method = isEditing ? "PUT" : "POST";
      
      // Properly format submission data
      const submissionData = {
        name: formData.name.trim(),
        accountNumber: formData.accountNumber.trim(),
        bankName: formData.bankName.trim(),
        accountType: formData.accountType,
        balance: formData.balance.toString(),
        userId: userId,
        notes: formData.notes?.trim() || null,
        credentials: {} // Required field, even if empty
      };
      
      console.log("Submitting account data:", submissionData);
      
      await apiRequest(method, endpoint, submissionData);
      
      toast({
        title: isEditing ? "Account updated" : "Account added",
        description: isEditing 
          ? "Your account has been updated successfully." 
          : "Your account has been added successfully.",
      });
      
      // Reset form after successful submission if not editing
      if (!isEditing) {
        setFormData({...defaultValues});
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      // More detailed error handling
      let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} account.`;
      
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
  
  // Helper function to mask account number display
  const formatAccountNumber = (accountNumber: string) => {
    // Only show the last 4 digits if longer than 4 characters
    if (accountNumber.length > 4) {
      return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
    }
    return accountNumber;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={cn("mt-1", formErrors.name && "border-red-500")}
          placeholder="e.g. Chase Checking"
          required
        />
        {formErrors.name && (
          <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className={cn("mt-1", formErrors.bankName && "border-red-500")}
            placeholder="e.g. Chase Bank"
            required
          />
          {formErrors.bankName && (
            <p className="text-sm text-red-500 mt-1">{formErrors.bankName}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="accountType">Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => handleSelectChange("accountType", value)}
          >
            <SelectTrigger id="accountType" className="w-full mt-1">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="investment">Investment Account</SelectItem>
              <SelectItem value="retirement">Retirement Account</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className={cn("mt-1", formErrors.accountNumber && "border-red-500")}
            placeholder="e.g. ****1234"
            required
          />
          {formErrors.accountNumber && (
            <p className="text-sm text-red-500 mt-1">{formErrors.accountNumber}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            For security, only enter the last 4 digits or use a masked format
          </p>
        </div>
        
        <div>
          <Label htmlFor="balance">Current Balance ($)</Label>
          <Input
            id="balance"
            name="balance"
            type="number"
            step="0.01"
            min="0"
            value={formData.balance}
            onChange={handleChange}
            className={cn("mt-1", formErrors.balance && "border-red-500")}
            required
          />
          {formErrors.balance && (
            <p className="text-sm text-red-500 mt-1">{formErrors.balance}</p>
          )}
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
          placeholder="Additional information about this account"
        />
      </div>
      
      <Button 
        type="submit" 
        variant="default"
        className={cn("w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white", 
          isSubmitting && "opacity-70")}
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Adding...") 
          : (isEditing ? "Update Account" : "Add Account")}
      </Button>
    </form>
  );
}
