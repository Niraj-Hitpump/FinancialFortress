import { useState } from "react";
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
    ...initialValues
  };
  
  const [formData, setFormData] = useState(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const endpoint = isEditing 
        ? `/api/accounts/${initialValues?.id}` 
        : "/api/accounts";
      
      const method = isEditing ? "PUT" : "POST";
      
      await apiRequest(method, endpoint, {
        ...formData,
        userId,
        balance: parseFloat(formData.balance),
        credentials: {}
      });
      
      toast({
        title: isEditing ? "Account updated" : "Account added",
        description: isEditing 
          ? "Your account has been updated successfully." 
          : "Your account has been added successfully.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} account. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
          className="mt-1"
          placeholder="e.g. Chase Checking"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="mt-1"
            placeholder="e.g. Chase Bank"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="accountType">Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => handleSelectChange("accountType", value)}
          >
            <SelectTrigger className="w-full mt-1">
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
            className="mt-1"
            placeholder="e.g. ****1234"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="balance">Current Balance ($)</Label>
          <Input
            id="balance"
            name="balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={handleChange}
            className="mt-1"
            required
          />
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
        className={cn("w-full mt-2", isSubmitting && "opacity-70")}
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Adding...") 
          : (isEditing ? "Update Account" : "Add Account")}
      </Button>
    </form>
  );
}
