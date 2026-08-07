# KSTS Database Architecture

## Overview

KSTS (Karachi Smart Travel Services) uses a centralized relational database architecture built on PostgreSQL with Prisma ORM.

The database is designed to support:

- Multiple transport companies
- Multiple offices
- Multiple users and roles
- Bus fleet management
- Route management
- Trip scheduling
- Real-time seat booking
- Ticket generation
- Reporting system

The main objective is to create a secure, scalable and reliable database structure for complete transport operations.

---

# Database Technology

## Database

PostgreSQL


## ORM

Prisma ORM


Purpose:

- Type-safe database access
- Secure queries
- Database migrations
- Relationship management
- Scalable development


---

# Core Database Architecture

KSTS follows a relational database model.


Main flow:



---

# User Management

## Users Table

Stores all system users.


User types:

- Super Admin
- Company Admin
- Office Staff
- Booking Agent
- Customer


Main fields:

- id
- name
- email
- password
- role
- companyId
- officeId
- status
- createdAt
- updatedAt


---

# Roles & Permissions

## Roles Table

Controls user access.


Examples:

- SUPER_ADMIN
- COMPANY_ADMIN
- OFFICE_STAFF
- AGENT
- CUSTOMER


Permissions include:

- Create
- Read
- Update
- Delete
- Manage bookings
- Manage users


---

# Company Management

## Companies Table

Stores transport company information.


Example:

- Hazara Movers
- Faisal Movers
- Waheed Movers


Main fields:

- id
- companyName
- logo
- contactInfo
- status
- createdAt
- updatedAt


Relationship:



---

# Office Management

## Offices Table

Stores company branches.


Example:

Company:

Hazara Movers


Offices:

- Karachi Office
- Lahore Office
- Islamabad Office


Main fields:

- id
- companyId
- officeName
- address
- contactNumber
- status


Relationship:




---

# Bus Fleet Management

## Buses Table

Stores bus information.


Main fields:

- id
- companyId
- busNumber
- busType
- model
- seatCapacity
- status


Examples:

- Executive Bus
- Sleeper Bus
- Family Bus


Relationship:



---

# Seat Layout Management

## Seats Table

Stores bus seat configuration.


Main fields:

- id
- busId
- seatNumber
- seatType
- position


Purpose:

- Manage different bus layouts
- Track seat availability
- Prevent double booking


---

# Route Management

## Routes Table

Stores travel routes.


Example:

Karachi → Lahore

Karachi → Islamabad


Main fields:

- id
- companyId
- departureCity
- arrivalCity
- distance
- duration


Relationship:




---

# Trip Management

## Trips Table

Stores daily bus operations.


Main fields:

- id
- busId
- routeId
- departureTime
- arrivalTime
- fare
- status


Example:

Karachi to Islamabad

Departure:

10:00 PM


---

# Booking Management

## Bookings Table

Stores ticket reservations.


Main fields:

- id
- tripId
- customerName
- customerPhone
- seatNumber
- bookingStatus
- bookedBy
- createdAt


Booking statuses:

- HOLD
- CONFIRMED
- CANCELLED


---

# Ticket Management

## Tickets Table

Stores generated tickets.


Main fields:

- id
- bookingId
- ticketNumber
- issueDate
- status


Purpose:

- Digital ticket
- Printable ticket
- Booking verification


---

# Payment Management (Future)

Future integration:


Supported:

- Cash
- JazzCash
- Easypaisa
- Online Payments


---

# Database Relationships

Main relationships:






---

# Data Security Rules

Database follows:


- Secure relations
- Role based access
- Data validation
- Audit tracking
- Soft delete
- Backup strategy


---

# Performance Considerations

Database optimization:


- Proper indexing
- Efficient queries
- Relationship optimization
- Scalable structure


---

# Future Database Expansion

Possible additions:


- Customer accounts
- Online payments
- Notifications
- Loyalty system
- Agent commissions
- Reports analytics
- AI based insights


---

Last Updated:

2026
