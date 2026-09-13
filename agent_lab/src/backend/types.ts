export type CoverageStatus = 'active' | 'inactive';
export type EnrollmentStatus = 'enrolled' | 'terminated' | 'pending';

export interface Member {
  id: string; tenantId: string; name: string; memberNumber: string; dateOfBirth: string;
  ssnLast4: string; email: string; phone: string; addressLine1: string; city: string;
  postalCode: string; planId: string; coverageStatus: CoverageStatus; revision: number;
}
export interface Dependent {
  id: string; memberId: string; name: string; relationship: string; planId: string;
  enrollmentStatus: EnrollmentStatus; revision: number;
}
export interface Plan { id: string; name: string; benefits: string[]; revision: number; }
export interface Claim {
  id: string; memberId: string; description: string; amountCents: number; status: 'submitted' | 'processing' | 'paid' | 'denied'; submittedAt: string; revision: number;
}
export interface ServiceNote {
  id: string; memberId: string; authorId: string; body: string; createdAt: string; revision: number;
}
