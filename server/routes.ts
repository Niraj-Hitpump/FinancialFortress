import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCategorySchema, insertTransactionSchema, insertGoalSchema, insertEventSchema, insertAccountSchema } from "@shared/schema";
import { z } from "zod";

// Helper function to validate request body
function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  req: Request,
  res: Response
): z.infer<T> | null {
  try {
    return schema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
    } else {
      res.status(400).json({ message: "Invalid request body" });
    }
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    const data = validateBody(insertUserSchema, req, res);
    if (!data) return;
    
    const existingUser = await storage.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const user = await storage.createUser(data);
    res.status(201).json({ id: user.id, username: user.username, fullName: user.fullName, email: user.email });
  });
  
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // For a real application, you'd use sessions here
    res.status(200).json({ id: user.id, username: user.username, fullName: user.fullName, email: user.email });
  });
  
  // Category routes
  app.get("/api/categories", async (req, res) => {
    // In a real app, we would get userId from the session
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const categories = await storage.getCategories(userId);
    res.status(200).json(categories);
  });
  
  app.post("/api/categories", async (req, res) => {
    const data = validateBody(insertCategorySchema, req, res);
    if (!data) return;
    
    const category = await storage.createCategory(data);
    res.status(201).json(category);
  });
  
  app.put("/api/categories/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const data = validateBody(insertCategorySchema.partial(), req, res);
    if (!data) return;
    
    const category = await storage.updateCategory(id, data);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json(category);
  });
  
  app.delete("/api/categories/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const result = await storage.deleteCategory(id);
    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(204).send();
  });
  
  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const transactions = await storage.getTransactions(userId);
    res.status(200).json(transactions);
  });
  
  app.post("/api/transactions", async (req, res) => {
    const data = validateBody(insertTransactionSchema, req, res);
    if (!data) return;
    
    const transaction = await storage.createTransaction(data);
    res.status(201).json(transaction);
  });
  
  app.put("/api/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }
    
    const data = validateBody(insertTransactionSchema.partial(), req, res);
    if (!data) return;
    
    const transaction = await storage.updateTransaction(id, data);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    res.status(200).json(transaction);
  });
  
  app.delete("/api/transactions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }
    
    const result = await storage.deleteTransaction(id);
    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    res.status(204).send();
  });
  
  // Goal routes
  app.get("/api/goals", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const goals = await storage.getGoals(userId);
    res.status(200).json(goals);
  });
  
  app.post("/api/goals", async (req, res) => {
    const data = validateBody(insertGoalSchema, req, res);
    if (!data) return;
    
    const goal = await storage.createGoal(data);
    res.status(201).json(goal);
  });
  
  app.put("/api/goals/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid goal ID" });
    }
    
    const data = validateBody(insertGoalSchema.partial(), req, res);
    if (!data) return;
    
    const goal = await storage.updateGoal(id, data);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.status(200).json(goal);
  });
  
  app.delete("/api/goals/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid goal ID" });
    }
    
    const result = await storage.deleteGoal(id);
    if (!result) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    res.status(204).send();
  });
  
  // Event routes
  app.get("/api/events", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const events = await storage.getEvents(userId);
    res.status(200).json(events);
  });
  
  app.post("/api/events", async (req, res) => {
    const data = validateBody(insertEventSchema, req, res);
    if (!data) return;
    
    const event = await storage.createEvent(data);
    res.status(201).json(event);
  });
  
  app.put("/api/events/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    
    const data = validateBody(insertEventSchema.partial(), req, res);
    if (!data) return;
    
    const event = await storage.updateEvent(id, data);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(200).json(event);
  });
  
  app.delete("/api/events/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    
    const result = await storage.deleteEvent(id);
    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(204).send();
  });
  
  // Account routes
  app.get("/api/accounts", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const accounts = await storage.getAccounts(userId);
    res.status(200).json(accounts);
  });
  
  app.post("/api/accounts", async (req, res) => {
    const data = validateBody(insertAccountSchema, req, res);
    if (!data) return;
    
    const account = await storage.createAccount(data);
    res.status(201).json(account);
  });
  
  app.put("/api/accounts/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }
    
    const data = validateBody(insertAccountSchema.partial(), req, res);
    if (!data) return;
    
    const account = await storage.updateAccount(id, data);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    
    res.status(200).json(account);
  });
  
  app.delete("/api/accounts/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }
    
    const result = await storage.deleteAccount(id);
    if (!result) {
      return res.status(404).json({ message: "Account not found" });
    }
    
    res.status(204).send();
  });
  
  // Dashboard data route
  app.get("/api/dashboard", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      // Fetch all required data for the dashboard
      const [transactions, accounts, goals, events] = await Promise.all([
        storage.getTransactions(userId),
        storage.getAccounts(userId),
        storage.getGoals(userId),
        storage.getEvents(userId),
      ]);
      
      // Calculate total balance
      const totalBalance = accounts.reduce((sum, account) => {
        return sum + parseFloat(account.balance as any);
      }, 0);
      
      // Calculate monthly expenses (for the current month)
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyExpenses = transactions
        .filter(t => new Date(t.date) >= currentMonthStart && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount as any), 0);
      
      // Calculate savings rate (simplified)
      const monthlyIncome = transactions
        .filter(t => new Date(t.date) >= currentMonthStart && t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount as any), 0);
      
      const savingsRate = monthlyIncome > 0 
        ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
        : 0;
      
      // Calculate upcoming bills
      const upcomingBills = events
        .filter(e => new Date(e.date) > now && new Date(e.date) < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, e) => sum + parseFloat(e.amount as any), 0);
      
      // Get recent transactions
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      // Get upcoming events
      const upcomingEvents = events
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
      
      res.status(200).json({
        totalBalance,
        monthlyExpenses,
        savingsRate,
        upcomingBills,
        recentTransactions,
        upcomingEvents,
        goals,
        accounts
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });
  
  // Creates the HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
