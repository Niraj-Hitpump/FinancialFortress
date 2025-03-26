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
    ...initialValues
  };
  
  const [formData, setFormData] = useState(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
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
        ? `/api/events/${initialValues?.id}` 
        : "/api/events";
      
      const method = isEditing ? "PUT" : "POST";
      
      await apiRequest(method, endpoint, {
        ...formData,
        userId,
        amount: parseFloat(formData.amount),
      });
      
      toast({
        title: isEditing ? "Event updated" : "Event added",
        description: isEditing 
          ? "Your event has been updated successfully." 
          : "Your event has been added successfully.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} event. Please try again.`,
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
          className="mt-1"
          required
        />
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
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger className="w-full mt-1">
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
            <SelectTrigger className="w-full mt-1">
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
        className={cn("w-full mt-2", isSubmitting && "opacity-70")}
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Adding...") 
          : (isEditing ? "Update Event" : "Add Event")}
      </Button>
    </form>
  );
}
