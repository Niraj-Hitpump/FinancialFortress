import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateRelative } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import EventForm from "@/components/planning/event-form";

interface Event {
  id: number;
  title: string;
  description: string;
  amount: string;
  date: string;
  userId: number;
  priority: string;
  category: string;
}

interface UpcomingEventsProps {
  events: Event[];
  isLoading?: boolean;
  userId: number;
  onEventAdded: () => void;
}

export default function UpcomingEvents({ 
  events, 
  isLoading = false,
  userId,
  onEventAdded
}: UpcomingEventsProps) {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-warning/10 text-warning';
      case 'medium':
        return 'bg-info/10 text-info';
      case 'low':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Normal Priority';
    }
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    onEventAdded();
    toast({
      title: "Event created",
      description: "Your event has been added successfully.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900">Upcoming Events</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-primary hover:text-indigo-700"
            onClick={() => setIsFormOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Event
          </Button>
        </CardHeader>
        <CardContent className="border-t border-gray-200 p-0">
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No upcoming events</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {events.map((event) => (
                  <li key={event.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-500">
                              {event.category} • {formatDateRelative(new Date(event.date))}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(parseFloat(event.amount))}</p>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                            {getPriorityLabel(event.priority)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
