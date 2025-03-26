import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialGoals from "@/components/dashboard/financial-goals";
import { CalendarIcon, PlusIcon, Edit, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, formatDateRelative } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "@/components/planning/event-form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export default function Planning() {
  const userId = 1; // For demo purposes
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: [`/api/events?userId=${userId}`],
  });

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: [`/api/goals?userId=${userId}`],
  });

  const handleDeleteEvent = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/events/${id}`, undefined);
      queryClient.invalidateQueries({ queryKey: [`/api/events?userId=${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/dashboard?userId=${userId}`] });
      toast({ 
        title: "Event deleted", 
        description: "The event has been deleted successfully." 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete event. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
  };

  const handleFormSuccess = () => {
    setIsAddEventOpen(false);
    setEditingEvent(null);
    queryClient.invalidateQueries({ queryKey: [`/api/events?userId=${userId}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/dashboard?userId=${userId}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/goals?userId=${userId}`] });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'warning';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
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

  const eventColumns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(new Date(row.original.date)),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(parseFloat(row.original.amount)),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge variant={getPriorityColor(row.original.priority)}>
          {getPriorityLabel(row.original.priority)}
        </Badge>
      ),
    },
    {
      accessorKey: "dueIn",
      header: "Due",
      cell: ({ row }) => formatDateRelative(new Date(row.original.date)),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEditEvent(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteEvent(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Financial Planning</h1>
          <p className="text-sm text-gray-500">Plan and track your financial goals and upcoming events</p>
        </div>
        <div>
          <Button onClick={() => setIsAddEventOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Events and Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="text-center py-4">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No upcoming events</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Add your first event to start planning.</p>
                  <Button onClick={() => setIsAddEventOpen(true)} className="mt-4">
                    Add Event
                  </Button>
                </div>
              ) : (
                <DataTable
                  columns={eventColumns}
                  data={events}
                  searchColumn="title"
                  searchPlaceholder="Search events..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals" className="space-y-4">
          <FinancialGoals 
            goals={goals}
            isLoading={isLoadingGoals}
            userId={userId}
            onGoalAdded={handleFormSuccess}
          />
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm userId={userId} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog 
        open={!!editingEvent} 
        onOpenChange={(open) => !open && setEditingEvent(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm 
              userId={userId} 
              onSuccess={handleFormSuccess} 
              initialValues={editingEvent}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
