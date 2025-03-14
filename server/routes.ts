import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertContactMessageSchema, 
  insertEventRegistrationSchema,
  insertPaymentSchema,
} from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Public API endpoints
  app.get("/api/announcements", async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/upcoming", async (req, res) => {
    const events = await storage.getUpcomingEvents();
    res.json(events);
  });

  app.get("/api/events/past", async (req, res) => {
    const events = await storage.getPastEvents();
    res.json(events);
  });

  app.get("/api/members", async (req, res) => {
    const users = await storage.getUsers();
    // Filter out sensitive information
    const members = users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      specialty: user.specialty,
      yearElevated: user.yearElevated,
      profileImage: user.profileImage
    }));
    res.json(members);
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validData);
      res.status(201).json({ success: true, id: contactMessage.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  // Protected API endpoints - require authentication
  app.get("/api/resources", ensureAuthenticated, async (req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  app.post("/api/events/:eventId/register", ensureAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      // Check if user is already registered
      const existingRegistrations = await storage.getEventRegistrations(eventId);
      const alreadyRegistered = existingRegistrations.some(reg => reg.userId === userId);
      
      if (alreadyRegistered) {
        return res.status(400).json({ error: "Already registered for this event" });
      }
      
      const registrationData = { eventId, userId };
      const validData = insertEventRegistrationSchema.parse(registrationData);
      const registration = await storage.createEventRegistration(validData);
      
      res.status(201).json({ success: true, id: registration.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/payments", ensureAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const payments = await storage.getUserPayments(userId);
    res.json(payments);
  });

  app.post("/api/payments", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Generate a unique reference for this payment
      const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const paymentData = {
        ...req.body,
        userId,
        reference,
        status: "pending"
      };
      
      const validData = insertPaymentSchema.parse(paymentData);
      const payment = await storage.createPayment(validData);
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.put("/api/payments/:reference/verify", ensureAuthenticated, async (req, res) => {
    try {
      const { reference } = req.params;
      const payment = await storage.getPaymentByReference(reference);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      // In a real implementation, we would verify with the payment gateway
      // For now, we'll just update the status
      const updatedPayment = await storage.updatePayment(payment.id, { status: "completed" });
      
      res.json(updatedPayment);
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  app.get("/api/user/profile", ensureAuthenticated, async (req, res) => {
    res.json(req.user);
  });

  app.put("/api/user/profile", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Prevent updating sensitive fields
      const { password, role, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Middleware to ensure user is authenticated
function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
}
