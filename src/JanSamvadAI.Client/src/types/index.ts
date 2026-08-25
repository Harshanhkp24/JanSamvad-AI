export type DistrictId = 'faridabad' | 'gurugram'

export type UserRole = 'citizen' | 'representative' | 'opposition' | 'officer' | 'admin'

export interface CitizenRecord {
  id: string
  name: string
  governmentId: string // e.g. GOV-HR-FBD-10021
  maskedGovId: string // e.g. ********021
  pinCode: string
  districtId: DistrictId
  districtName: string
  representativeName: string
  role: 'citizen'
  avatar?: string
}

export interface RepresentativeRecord {
  id: string
  name: string
  title: string
  districtId: DistrictId
  districtName: string
  partyName: string
  role: 'representative'
  avatar?: string
  bio: string
}

export interface OppositionRecord {
  id: string
  name: string
  title: string
  districtId: DistrictId
  districtName: string
  partyName: string
  role: 'opposition'
  avatar?: string
}

export interface OfficerRecord {
  id: string
  name: string
  designation: string
  department: string
  districtId: DistrictId
  districtName: string
  role: 'officer'
  avatar?: string
}

export type AnyUser = CitizenRecord | RepresentativeRecord | OppositionRecord | OfficerRecord | {
  id: string
  name: string
  role: 'admin'
  districtId: DistrictId
  districtName: string
  governmentId?: string
}

export interface ProjectOfficer {
  name: string
  designation: string
  department: string
  contactPhone?: string
  contactEmail?: string
}

export interface DepartmentHead {
  name: string
  designation: string
  department: string
}

export interface ProjectContractor {
  companyName: string
  registrationNumber: string
  role: string
  contactPerson?: string
}

export interface AccountabilityNode {
  representativeName: string
  representativeParty: string
  departmentName: string
  departmentHead: DepartmentHead
  projectOfficer: ProjectOfficer
  contractor: ProjectContractor
}

export interface LiveProjectUpdate {
  id: string
  date: string // e.g. "19 August 2026 — 4:30 PM"
  description: string
  progressPercentage?: number
  author: string
}

export interface ProgressHistoryPoint {
  month: string // e.g. "June", "July", "August"
  progressPercentage: number
}

export interface CitizenProjectRating {
  id: string
  citizenName: string
  rating: number // 1-5
  comment: string
  date: string
}

export interface ProjectRecord {
  id: string
  districtId: DistrictId
  sector: string // e.g. "Sector 15"
  name: string
  department: string
  status: 'Ongoing' | 'Completed' | 'Delayed' | 'Planned'
  progressPercentage: number
  budgetCr: number // e.g. 2.4 (₹ Crores)
  currentExpenditureCr: number // e.g. 2.1 (₹ Crores)
  startDate: string // e.g. "June 2026"
  expectedCompletion: string // e.g. "September 2026"
  whyExists: string
  expectedOutcome: string
  coordinates: [number, number] // [lat, lng]
  accountability: AccountabilityNode
  liveUpdates: LiveProjectUpdate[]
  progressHistory: ProgressHistoryPoint[]
  ratings: CitizenProjectRating[]
  averageRating: number // e.g. 4.1
}

export type PostType = 'Project Update' | 'Development Milestone' | 'Public Announcement' | 'Emergency/Public Notice' | 'General Update'

export type ClaimCategory = 
  | 'Progress Discrepancy'
  | 'Budget Concern'
  | 'Delay'
  | 'Quality Concern'
  | 'Transparency Concern'
  | 'Citizen Impact'
  | 'Missing Information'
  | 'Contractor Concern'
  | 'Public Safety'
  | 'Environmental Concern'

export interface CitizenComment {
  id: string
  citizenName: string
  content: string
  timestamp: string
  likes: number
}

export interface OppositionClaim {
  id: string
  postId: string
  authorName: string
  authorRole: string // e.g. "Opposition Representative — Faridabad"
  claimCategory: ClaimCategory
  content: string
  timestamp: string
  supportingDataUrl?: string
  citizenSupports: number
  supportedByUser?: boolean
}

export interface GovResponse {
  id: string
  postId: string
  officerName: string
  officerDesignation: string
  department: string
  content: string
  timestamp: string
}

export interface FeedPost {
  id: string
  districtId: DistrictId
  authorId: string
  authorName: string
  authorRole: string
  partyName: string
  timestamp: string
  relativeTime: string
  content: string
  sector: string
  postType: PostType
  attachedProjectId?: string
  attachedProject?: {
    id: string
    name: string
    sector: string
    progressPercentage: number
    budgetCr: number
    department: string
    status: string
  }
  imageUrl?: string
  likes: number
  likedByUser?: boolean
  supportsCount: number
  commentsCount: number
  viewsCount: number
  comments: CitizenComment[]
  oppositionResponse?: OppositionClaim
  govResponse?: GovResponse
}

export interface GrievanceRecord {
  id: string
  complaintNumber: string // e.g. "GRV-FBD-1024"
  districtId: DistrictId
  sector: string
  title: string
  description: string
  category: string
  department: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Open' | 'InProgress' | 'Resolved' | 'Rejected'
  createdAt: string
  resolvedAt?: string
  citizenName: string
  projectId?: string
  projectName?: string
  locationDetails: string
  aiDepartmentConfidence: number;
  feedbackRating?: number;
  feedbackComment?: string;
  resolutionRemarks?: string;
  potentialDuplicates?: Array<{
    id: string;
    complaintId1: string;
    complaintNumber1: string;
    title1: string;
    complaintId2: string;
    complaintNumber2: string;
    title2: string;
    similarityScore: number;
    verifiedById?: string;
  }>;
}

export type QuestionStatus = 'Pending Response' | 'Under Review' | 'Answered' | 'Clarification Requested' | 'Closed'

export interface OppositionQuestion {
  id: string
  questionId: string // e.g. "Q-102"
  districtId: DistrictId
  projectId?: string
  projectName: string
  department: string
  questionText: string
  claimCategory: ClaimCategory
  raisedBy: string
  raisedDate: string
  status: QuestionStatus
  govResponseText?: string
  responseOfficerName?: string
  responseOfficerDesignation?: string
  responseDate?: string
  citizenSupports: number
  supportedByUser?: boolean
}

export interface NotificationItem {
  id: string
  targetRole: UserRole | 'all'
  districtId: DistrictId
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
  type: 'project' | 'grievance' | 'opposition' | 'gov_response' | 'social'
}
