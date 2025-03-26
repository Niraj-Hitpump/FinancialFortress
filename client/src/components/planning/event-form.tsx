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

interface EventFormProps {
  userId: number;
  onSuccess: () => void;
  initialValues?: {
    id?: number;
    title: string;
    description: string;
    amount: string;
    date: string;
    priority: string;
    category: string;
  };
  isEditing?: boolean;
}

export default function EventForm({ 
  userId, 
  onSuccess, 
  initialValues,
  isEditing = false
}: EventFormProps) {
  const defaultValues = {
    title: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    priority: "medium",
    category: "Utilities",
  };
  
  const [formData, setFormData] = useState({...defaultValues});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // Initialize form with initial values when they are available
  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        description: initialValues.description || "",
        amount: initialValues.amount || "",
        date: initialValues.date || new Date().toISOString().split('T')[0],
        priority: initialValues.priority || "medium",
        category: initialValues.category || "Utilities",
      });
    }
  }, [initialValues]);
  
  const eventCategories = [
    "Housing",
    "Insurance",
    "Utilities",
    "Transportation",
    "Food",
    "Entertainment",
    "Healthcare",
    "Personal",
    "Gifts",
    "Education",
    "Taxes",
    "Other"
  ];
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
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
        ? `/api/events/${initialValues?.id}` 
        : "/api/events";
      
      const method = isEditing ? "PUT" : "POST";
      
      // Properly format the data
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        amount: formData.amount.toString(),
        date: new Date(formData.date).toISOString(),
        userId: userId,
        priority: formData.priority,
        category: formData.category
      };
      
      console.log("Submitting event data:", submissionData);
      
      await apiRequest(method, endpoint, submissionData);
      
      toast({
        title: isEditing ? "Event updated" : "Event added",
        description: isEditing 
          ? "Your event has been updated successfully." 
          : "Your event has been added successfully.",
      });
      
      // Reset form after successful submission if not editing
      if (!isEditing) {
        setFormData({...defaultValues});
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      // More detailed error handling
      let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} event.`;
      
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={cn("mt-1", formErrors.title && "border-red-500")}
          required
        />
        {formErrors.title && (
          <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1"
        />
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
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger id="category" className="w-full mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {eventCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleSelectChange("priority", value)}
          >
            <SelectTrigger id="priority" className="w-full mt-1">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        type="submit" 
        variant="gradient" 
        className={cn("w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white", 
          isSubmitting && "opacity-70")}
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Adding...") 
          : (isEditing ? "Update Event" : "Add Event")}
      </Button>
    </form>
  );
}
