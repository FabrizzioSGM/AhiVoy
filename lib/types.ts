// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "embarcador" | "transportista" | "admin";

export type VerificationStatus = "pending" | "in_review" | "approved" | "rejected" | "needs_action";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  createdAt: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
}

// ─── Companies ──────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  userId: string;
  legalName: string;
  tradeName?: string;
  rfc: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  industry?: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

// ─── Carrier Profile ─────────────────────────────────────────────────────────

export type OperatorType = "empresa" | "independiente";

export interface CarrierProfile {
  id: string;
  userId: string;
  companyId?: string;
  operatorType: OperatorType;
  licenseNumber: string;
  operatingStates: string[];
  specialties: string[];
  totalTrips: number;
  onTimeRate: number;
  claimRate: number;
  avgRating: number;
  reputationTier: "nuevo" | "verificado" | "confiable" | "elite";
  verificationStatus: VerificationStatus;
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export type VehicleType =
  | "torton"
  | "rabon"
  | "trailer"
  | "camion_3.5t"
  | "camion_5t"
  | "camioneta"
  | "full";

export interface Vehicle {
  id: string;
  carrierId: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  plates: string;
  vin?: string;
  capacityKg: number;
  capacityM3?: number;
  hasRefrigeration: boolean;
  verificationStatus: VerificationStatus;
  insuranceExpiry: string;
  documentIds: string[];
}

// ─── Documents ───────────────────────────────────────────────────────────────

export type DocumentType =
  | "ine"
  | "licencia_conducir"
  | "tarjeta_circulacion"
  | "seguro_vigente"
  | "acta_constitutiva"
  | "comprobante_domicilio"
  | "constancia_sat"
  | "caratula_bancaria"
  | "foto_unidad";

export interface Document {
  id: string;
  ownerId: string;
  ownerType: "user" | "vehicle" | "company";
  type: DocumentType;
  fileName: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  expiresAt?: string;
  uploadedAt: string;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export type RouteStatus = "draft" | "published" | "matched" | "in_transit" | "completed" | "cancelled";

export interface ReturnRoute {
  id: string;
  carrierId: string;
  vehicleId: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  departureDateFrom: string;
  departureDateTo: string;
  availableCapacityKg: number;
  availableCapacityM3?: number;
  pricePerKm?: number;
  estimatedDistance: number;
  acceptedCargoTypes: string[];
  restrictions?: string;
  status: RouteStatus;
  potentialEarnings?: number;
  createdAt: string;
}

// ─── Shipment Requests ───────────────────────────────────────────────────────

export type ShipmentStatus =
  | "draft"
  | "published"
  | "matching"
  | "matched"
  | "confirmed"
  | "escrow_funded"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled"
  | "disputed";

export interface ShipmentRequest {
  id: string;
  shipperId: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  cargoDescription: string;
  cargoType: string;
  weightKg: number;
  volumeM3?: number;
  requiredDate: string;
  isFragile: boolean;
  requiresRefrigeration: boolean;
  declaredValue: number;
  status: ShipmentStatus;
  estimatedPrice?: number;
  aiParsed?: boolean;
  rawInput?: string;
  createdAt: string;
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export type MatchStatus =
  | "suggested"
  | "viewed"
  | "negotiating"
  | "accepted"
  | "rejected"
  | "expired";

export interface Match {
  id: string;
  shipmentId: string;
  routeId: string;
  carrierId: string;
  shipperId: string;
  matchScore: number;
  detourKm: number;
  estimatedPrice: number;
  carrierEarnings: number;
  shipperSavings: number;
  status: MatchStatus;
  expiresAt: string;
  createdAt: string;
}

// ─── Negotiations ─────────────────────────────────────────────────────────────

export interface NegotiationMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderRole: UserRole;
  messageType: "text" | "offer" | "counter_offer" | "accept" | "reject";
  content: string;
  offerAmount?: number;
  createdAt: string;
}

// ─── Payments & Escrow ───────────────────────────────────────────────────────

export type PaymentStatus =
  | "pending"
  | "escrow_funded"
  | "held"
  | "released"
  | "refunded"
  | "disputed";

export interface Payment {
  id: string;
  matchId: string;
  shipmentId: string;
  amount: number;
  platformFee: number;
  carrierAmount: number;
  currency: "MXN";
  status: PaymentStatus;
  escrowFundedAt?: string;
  releasedAt?: string;
  cfdiUrl?: string;
  createdAt: string;
}

// ─── Tracking ────────────────────────────────────────────────────────────────

export type TrackingEventType =
  | "escrow_funded"
  | "carrier_confirmed"
  | "pickup_en_route"
  | "pickup_arrived"
  | "pickup_completed"
  | "in_transit"
  | "delivery_en_route"
  | "delivery_arrived"
  | "delivery_completed"
  | "incident_reported"
  | "delivered";

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  eventType: TrackingEventType;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  notes?: string;
  photoUrls?: string[];
  reportedBy: string;
  createdAt: string;
}

// ─── Delivery Proof ──────────────────────────────────────────────────────────

export interface DeliveryProof {
  id: string;
  shipmentId: string;
  photoUrls: string[];
  recipientName: string;
  recipientSignatureUrl?: string;
  lat: number;
  lng: number;
  confirmedAt: string;
  confirmedByShipper: boolean;
}

// ─── Ratings ─────────────────────────────────────────────────────────────────

export interface Rating {
  id: string;
  shipmentId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerRole: UserRole;
  overall: number;
  punctuality: number;
  communication: number;
  documentation: number;
  cargoCondition?: number;
  comment?: string;
  createdAt: string;
}

// ─── Claims ──────────────────────────────────────────────────────────────────

export type ClaimStatus = "open" | "in_review" | "resolved_shipper" | "resolved_carrier" | "closed";

export interface Claim {
  id: string;
  shipmentId: string;
  claimantId: string;
  claimantRole: UserRole;
  reason: string;
  description: string;
  evidenceUrls: string[];
  status: ClaimStatus;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | "match_found"
  | "offer_received"
  | "offer_accepted"
  | "escrow_funded"
  | "pickup_confirmed"
  | "delivery_confirmed"
  | "payment_released"
  | "document_approved"
  | "document_rejected"
  | "new_rating"
  | "claim_update";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface StepItem {
  step: number;
  title: string;
  description: string;
  icon?: string;
}
