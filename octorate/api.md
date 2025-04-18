# Octorate API Documentation for Finca Termópilas

## Overview
Octorate provides a booking system integration for Finca Termópilas that allows customers to check availability, view room details, and make reservations. The system is accessible through a web interface hosted at `book.octorate.com`.

## Base URL
```
https://book.octorate.com/octobook/site/reservation/calendar.xhtml
```

## Request Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `codice` | Property ID for Finca Termópilas | `522604` |
| `lang` | Language code for the interface | `ES` (Spanish) |
| `room` | Specific room ID to display | `739420` (Gemela 1) |

## Available Endpoints

### Room Calendar View
```
GET /octobook/site/reservation/calendar.xhtml
```

This endpoint displays availability and pricing for a specific room at Finca Termópilas. It shows a calendar interface with:

- Daily rates in Colombian Pesos (COP)
- Minimum stay requirements
- Check-in availability status
- Room details (size, amenities, maximum occupancy)
- Property information (check-in/out times, address, GPS coordinates)

### Features

The API provides functionality for:

1. **Availability Search**: Filter by dates, number of guests (adults/children) and number of rooms
2. **Price Display**: Dynamic pricing showing different rates for weekdays/weekends/holidays
3. **Booking Rules**: Shows minimum stay requirements and check-in permissions
4. **Room Information**: Displays details about amenities and maximum occupancy
5. **Property Details**: Shows location information, check-in/out policies

## Integration Notes

The booking system appears to be embedded in the Finca Termópilas website (`termopilas.co`) and handles the reservation process directly through Octorate's system, which likely manages:

- Inventory synchronization
- Payment processing
- Reservation management
- Calendar availability

## Example Usage

A typical booking flow would:
1. Allow users to select dates and number of guests
2. Display room availability and pricing for selected dates
3. Show room details and booking policies
4. Process the reservation and payment

The system supports promotional codes and different rate types based on seasonality and demand.

## Security

The API appears to use secure HTTPS connections for all transactions, with the booking platform being described as "Sistema de reservas seguras en linea desarrollado con tecnología de Octorate" (Secure online reservation system developed with Octorate technology). 