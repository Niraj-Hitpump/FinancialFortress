import { 
  User, InsertUser, 
  Category, InsertCategory, 
  Transaction, InsertTransaction, 
  Goal, InsertGoal, 
  Event, InsertEvent, 
  Account, InsertAccount 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(userId: number): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Goal operations
  getGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;
  
  // Event operations
  getEvents(userId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Account operations
  getAccounts(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account | undefined>;
  deleteAccount(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private transactions: Map<number, Transaction>;
  private goals: Map<number, Goal>;
  private events: Map<number, Event>;
  private accounts: Map<number, Account>;
  
  private userId: number;
  private categoryId: number;
  private transactionId: number;
  private goalId: number;
  private eventId: number;
  private accountId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.transactions = new Map();
    this.goals = new Map();
    this.events = new Map();
    this.accounts = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.transactionId = 1;
    this.goalId = 1;
    this.eventId = 1;
    this.accountId = 1;
    
    // Seed with initial data for demo
    this.seedData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.userId === userId
    );
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory = { ...existingCategory, ...category };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Transaction operations
  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existingTransaction = this.transactions.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction = { ...existingTransaction, ...transaction };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }
  
  // Goal operations
  async getGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.userId === userId
    );
  }
  
  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }
  
  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.goalId++;
    const goal: Goal = { ...insertGoal, id };
    this.goals.set(id, goal);
    return goal;
  }
  
  async updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const existingGoal = this.goals.get(id);
    if (!existingGoal) return undefined;
    
    const updatedGoal = { ...existingGoal, ...goal };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }
  
  // Event operations
  async getEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId
    );
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  // Account operations
  async getAccounts(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(
      (account) => account.userId === userId
    );
  }
  
  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }
  
  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.accountId++;
    const account: Account = { ...insertAccount, id };
    this.accounts.set(id, account);
    return account;
  }
  
  async updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account | undefined> {
    const existingAccount = this.accounts.get(id);
    if (!existingAccount) return undefined;
    
    const updatedAccount = { ...existingAccount, ...account };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }
  
  async deleteAccount(id: number): Promise<boolean> {
    return this.accounts.delete(id);
  }
  
  // Seed data for demo purposes
  private seedData() {
    // Create a demo user
    const user: User = {
      id: this.userId++,
      username: 'johndoe',
      password: 'password123',
      fullName: 'John Doe',
      email: 'john@example.com'
    };
    this.users.set(user.id, user);
    
    // Create categories
    const categories = [
      { id: this.categoryId++, name: 'Housing', icon: 'home', color: '#4F46E5', userId: user.id },
      { id: this.categoryId++, name: 'Food', icon: 'utensils', color: '#10B981', userId: user.id },
      { id: this.categoryId++, name: 'Transportation', icon: 'car', color: '#F43F5E', userId: user.id },
      { id: this.categoryId++, name: 'Entertainment', icon: 'film', color: '#FBBF24', userId: user.id },
      { id: this.categoryId++, name: 'Utilities', icon: 'bolt', color: '#60A5FA', userId: user.id },
      { id: this.categoryId++, name: 'Shopping', icon: 'shopping-bag', color: '#9333EA', userId: user.id },
      { id: this.categoryId++, name: 'Income', icon: 'wallet', color: '#10B981', userId: user.id }
    ];
    
    categories.forEach(category => {
      this.categories.set(category.id, category as Category);
    });
    
    // Create accounts
    const accounts = [
      { 
        id: this.accountId++, 
        name: 'Chase Checking', 
        accountNumber: '****4567', 
        bankName: 'Chase Bank', 
        accountType: 'checking', 
        balance: '12500.80', 
        userId: user.id, 
        notes: 'Main checking account',
        credentials: {}
      },
      { 
        id: this.accountId++, 
        name: 'Savings', 
        accountNumber: '****7890', 
        bankName: 'Bank of America', 
        accountType: 'savings', 
        balance: '8400', 
        userId: user.id, 
        notes: 'Emergency fund',
        credentials: {}
      },
      { 
        id: this.accountId++, 
        name: 'Credit Card', 
        accountNumber: '****1234', 
        bankName: 'Citi', 
        accountType: 'credit_card', 
        balance: '-1350.50', 
        userId: user.id, 
        notes: 'Rewards card',
        credentials: {}
      }
    ];
    
    accounts.forEach(account => {
      this.accounts.set(account.id, account as Account);
    });
    
    // Create transactions
    const transactions = [
      { 
        id: this.transactionId++, 
        description: 'Amazon Purchase', 
        amount: '42.99', 
        date: new Date('2023-05-12'), 
        type: 'expense', 
        categoryId: categories[5].id, 
        userId: user.id, 
        accountId: accounts[0].id,
        notes: 'Purchased household items'
      },
      { 
        id: this.transactionId++, 
        description: 'Netflix Subscription', 
        amount: '14.99', 
        date: new Date('2023-05-10'), 
        type: 'expense', 
        categoryId: categories[3].id, 
        userId: user.id, 
        accountId: accounts[2].id,
        notes: 'Monthly subscription'
      },
      { 
        id: this.transactionId++, 
        description: 'Salary Deposit', 
        amount: '3450.00', 
        date: new Date('2023-05-05'), 
        type: 'income', 
        categoryId: categories[6].id, 
        userId: user.id, 
        accountId: accounts[0].id,
        notes: 'Monthly salary'
      },
      { 
        id: this.transactionId++, 
        description: 'Uber Ride', 
        amount: '18.50', 
        date: new Date('2023-05-03'), 
        type: 'expense', 
        categoryId: categories[2].id, 
        userId: user.id, 
        accountId: accounts[2].id,
        notes: 'Trip to downtown'
      }
    ];
    
    transactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction as Transaction);
    });
    
    // Create goals
    const goals = [
      { 
        id: this.goalId++, 
        title: 'Emergency Fund', 
        description: 'Save 6 months of expenses', 
        targetAmount: '12000', 
        currentAmount: '8400', 
        targetDate: new Date('2023-12-31'), 
        userId: user.id, 
        status: 'on_track'
      },
      { 
        id: this.goalId++, 
        title: 'Vacation Fund', 
        description: 'Trip to Europe', 
        targetAmount: '5000', 
        currentAmount: '1800', 
        targetDate: new Date('2023-07-31'), 
        userId: user.id, 
        status: 'falling_behind'
      },
      { 
        id: this.goalId++, 
        title: 'New Car', 
        description: 'Down payment', 
        targetAmount: '8000', 
        currentAmount: '500', 
        targetDate: new Date('2024-03-31'), 
        userId: user.id, 
        status: 'just_started'
      }
    ];
    
    goals.forEach(goal => {
      this.goals.set(goal.id, goal as Goal);
    });
    
    // Create events
    const events = [
      { 
        id: this.eventId++, 
        title: 'Rent Payment', 
        description: 'Monthly rent', 
        amount: '1200', 
        date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        userId: user.id, 
        priority: 'high',
        category: 'Housing'
      },
      { 
        id: this.eventId++, 
        title: 'Car Insurance', 
        description: 'Monthly premium', 
        amount: '95.50', 
        date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        userId: user.id, 
        priority: 'medium',
        category: 'Insurance'
      },
      { 
        id: this.eventId++, 
        title: "Mom's Birthday Gift", 
        description: 'Buy a necklace', 
        amount: '150', 
        date: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        userId: user.id, 
        priority: 'low',
        category: 'Gifts'
      },
      { 
        id: this.eventId++, 
        title: 'Electric Bill', 
        description: 'Monthly utility bill', 
        amount: '85.40', 
        date: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        userId: user.id, 
        priority: 'medium',
        category: 'Utilities'
      }
    ];
    
    events.forEach(event => {
      this.events.set(event.id, event as Event);
    });
  }
}

export const storage = new MemStorage();
