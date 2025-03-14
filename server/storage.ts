import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  resources, type Resource, type InsertResource,
  payments, type Payment, type InsertPayment,
  announcements, type Announcement, type InsertAnnouncement,
  eventRegistrations, type EventRegistration, type InsertEventRegistration,
  contactMessages, type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

// Storage interface with all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getPastEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined>;
  
  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByReference(reference: string): Promise<Payment | undefined>;
  getUserPayments(userId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined>;
  
  // Announcement operations
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Event Registration operations
  getEventRegistration(id: number): Promise<EventRegistration | undefined>;
  getUserEventRegistrations(userId: number): Promise<EventRegistration[]>;
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  
  // Contact Message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private resources: Map<number, Resource>;
  private payments: Map<number, Payment>;
  private announcements: Map<number, Announcement>;
  private eventRegistrations: Map<number, EventRegistration>;
  private contactMessages: Map<number, ContactMessage>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private eventIdCounter: number;
  private resourceIdCounter: number;
  private paymentIdCounter: number;
  private announcementIdCounter: number;
  private eventRegistrationIdCounter: number;
  private contactMessageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.resources = new Map();
    this.payments = new Map();
    this.announcements = new Map();
    this.eventRegistrations = new Map();
    this.contactMessages = new Map();
    
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.resourceIdCounter = 1;
    this.paymentIdCounter = 1;
    this.announcementIdCounter = 1;
    this.eventRegistrationIdCounter = 1;
    this.contactMessageIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData(): void {
    // Sample announcements
    this.createAnnouncement({
      title: "Annual Conference 2023",
      content: "Registration for the 2023 Annual Conference is now open. Early bird registration ends on June 30th, 2023."
    });
    
    // Sample events
    const now = new Date();
    const futureDate1 = new Date();
    futureDate1.setDate(now.getDate() + 30);
    const futureDate2 = new Date();
    futureDate2.setDate(now.getDate() + 45);
    const futureDate3 = new Date();
    futureDate3.setDate(now.getDate() + 60);
    
    this.createEvent({
      title: "Annual Legal Conference 2023",
      description: "Join us for the premier gathering of legal professionals in Nigeria. Featuring keynote speakers and panel discussions on emerging legal trends.",
      date: futureDate1,
      venue: "Eko Hotels & Suites, Lagos",
      time: "9:00 AM - 5:00 PM",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      isPast: false
    });
    
    this.createEvent({
      title: "Legal Practice Management Workshop",
      description: "A comprehensive workshop on modern legal practice management, technology integration, and client relations.",
      date: futureDate2,
      venue: "Transcorp Hilton, Abuja",
      time: "10:00 AM - 3:00 PM",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      isPast: false
    });
    
    this.createEvent({
      title: "BOSAN Annual Dinner & Awards",
      description: "A prestigious evening recognizing outstanding contributions to the legal profession. Black tie required.",
      date: futureDate3,
      venue: "Oriental Hotel, Lagos",
      time: "6:00 PM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      isPast: false
    });
    
    // Sample resources
    this.createResource({
      title: "Code of Conduct for Legal Practitioners",
      description: "Guidelines for professional conduct of legal practitioners in Nigeria",
      url: "/resources/code-of-conduct.pdf",
      type: "document"
    });
    
    this.createResource({
      title: "Supreme Court Practice Directions",
      description: "Updated practice directions for the Supreme Court of Nigeria",
      url: "/resources/supreme-court-directions.pdf",
      type: "document"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getUpcomingEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => !event.isPast)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  async getPastEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.isPast)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const createdAt = new Date();
    const event: Event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const createdAt = new Date();
    const resource: Resource = { ...insertResource, id, createdAt };
    this.resources.set(id, resource);
    return resource;
  }
  
  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async getPaymentByReference(reference: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      (payment) => payment.reference === reference
    );
  }
  
  async getUserPayments(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const createdAt = new Date();
    const payment: Payment = { ...insertPayment, id, createdAt };
    this.payments.set(id, payment);
    return payment;
  }
  
  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    const payment = await this.getPayment(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...paymentData };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  // Announcement operations
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementIdCounter++;
    const createdAt = new Date();
    const announcement: Announcement = { ...insertAnnouncement, id, createdAt };
    this.announcements.set(id, announcement);
    return announcement;
  }
  
  // Event Registration operations
  async getEventRegistration(id: number): Promise<EventRegistration | undefined> {
    return this.eventRegistrations.get(id);
  }
  
  async getUserEventRegistrations(userId: number): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrations.values())
      .filter(registration => registration.userId === userId);
  }
  
  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrations.values())
      .filter(registration => registration.eventId === eventId);
  }
  
  async createEventRegistration(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const id = this.eventRegistrationIdCounter++;
    const createdAt = new Date();
    const registration: EventRegistration = { ...insertRegistration, id, createdAt };
    this.eventRegistrations.set(id, registration);
    return registration;
  }
  
  // Contact Message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const createdAt = new Date();
    const message: ContactMessage = { ...insertMessage, id, createdAt };
    this.contactMessages.set(id, message);
    return message;
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
