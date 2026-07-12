// User Roles
export const UserRole = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  ADMIN: 'Admin'
};

// Appointment Status
export const AppointmentStatus = {
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

// Notification Types
export const NotificationType = {
  APPOINTMENT_BOOKED: 'AppointmentBooked',
  APPOINTMENT_CANCELLED: 'AppointmentCancelled',
  APPOINTMENT_REMINDER: 'AppointmentReminder',
  DOCTOR_VERIFIED: 'DoctorVerified',
  NEW_MESSAGE: 'NewMessage',
  REVIEW_RECEIVED: 'ReviewReceived',
  COMPLAINT_RECEIVED: 'ComplaintReceived'
};

// Complaint Status
export const ComplaintStatus = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
};

// Day of Week
export const DayOfWeek = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
};

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string} role - 'Patient' | 'Doctor' | 'Admin'
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [dateOfBirth]
 * @property {string} [profileImageUrl]
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Appointment
 * @property {number} id
 * @property {number} patientId
 * @property {string} patientName
 * @property {number} doctorId
 * @property {string} doctorName
 * @property {number} clinicId
 * @property {string} clinicName
 * @property {string} appointmentDate
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} status - 'Confirmed' | 'Cancelled' | 'Completed'
 * @property {string} [notes]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Doctor
 * @property {number} id
 * @property {number} userId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} specialty
 * @property {string} [licenseNumber]
 * @property {string} [bio]
 * @property {string} [profileImageUrl]
 * @property {boolean} isVerified
 * @property {number} rating
 */

/**
 * @typedef {Object} Clinic
 * @property {number} id
 * @property {number} doctorId
 * @property {string} name
 * @property {string} address
 * @property {string} city
 * @property {string} country
 * @property {string} phoneNumber
 * @property {string} email
 * @property {string} [locationEmbedCode]
 * @property {boolean} isVerified
 * @property {OperatingHours[]} operatingHours
 */

/**
 * @typedef {Object} OperatingHours
 * @property {number} id
 * @property {string} dayOfWeek
 * @property {string} startTime
 * @property {string} endTime
 * @property {boolean} isClosed
 */

/**
 * @typedef {Object} Availability
 * @property {number} id
 * @property {number} doctorId
 * @property {number} clinicId
 * @property {string} date
 * @property {string} startTime
 * @property {string} endTime
 * @property {boolean} isAvailable
 * @property {number} maxBookings
 */

/**
 * @typedef {Object} Review
 * @property {number} id
 * @property {number} patientId
 * @property {string} patientName
 * @property {number} doctorId
 * @property {string} doctorName
 * @property {number} rating
 * @property {string} comment
 * @property {string} createdAt
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {number} id
 * @property {number} patientId
 * @property {string} patientName
 * @property {number} doctorId
 * @property {string} doctorName
 * @property {string} visitDate
 * @property {string} [diagnosis]
 * @property {string} [treatment]
 * @property {string} [prescription]
 * @property {string} [notes]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ChatMessage
 * @property {number} id
 * @property {number} senderId
 * @property {string} senderName
 * @property {string} senderRole
 * @property {number} receiverId
 * @property {string} receiverName
 * @property {string} receiverRole
 * @property {string} message
 * @property {string} sentAt
 * @property {boolean} isRead
 */

/**
 * @typedef {Object} Conversation
 * @property {number} otherUserId
 * @property {string} otherUserName
 * @property {string} otherUserRole
 * @property {string} [lastMessage]
 * @property {string} [lastMessageTime]
 * @property {number} unreadCount
 */

/**
 * @typedef {Object} Notification
 * @property {number} id
 * @property {string} title
 * @property {string} message
 * @property {string} type
 * @property {boolean} isRead
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Complaint
 * @property {number} id
 * @property {number} patientId
 * @property {string} [patientName]
 * @property {number} doctorId
 * @property {string} [doctorName]
 * @property {string} subject
 * @property {string} description
 * @property {string} status
 * @property {string} createdAt
 * @property {string} [resolvedAt]
 */

