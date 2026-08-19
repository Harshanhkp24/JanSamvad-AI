import {
  DistrictId,
  CitizenRecord,
  RepresentativeRecord,
  OppositionRecord,
  OfficerRecord,
  ProjectRecord,
  FeedPost,
  GrievanceRecord,
  OppositionQuestion,
  NotificationItem
} from '../types'

export interface DistrictDataSet {
  id: DistrictId
  name: string
  state: string
  pincodes: string[]
  representative: RepresentativeRecord
  opposition: OppositionRecord
  officers: OfficerRecord[]
  citizens: CitizenRecord[]
  projects: ProjectRecord[]
  posts: FeedPost[]
  grievances: GrievanceRecord[]
  oppositionQuestions: OppositionQuestion[]
  notifications: NotificationItem[]
}

export const INITIAL_DATA: Record<DistrictId, DistrictDataSet> = {
  faridabad: {
    id: 'faridabad',
    name: 'Faridabad',
    state: 'Haryana',
    pincodes: ['121001', '121002', '121003', '121004', '121005', '121006', '121007', '121008'],
    representative: {
      id: 'rep-fbd-01',
      name: 'Aarav Sharma',
      title: 'District Representative — Faridabad',
      districtId: 'faridabad',
      districtName: 'Faridabad',
      partyName: "People's Development Front",
      role: 'representative',
      bio: 'Committed to transparent public works, reliable drinking water, modern roads, and rapid civic grievance redressal across Faridabad.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    opposition: {
      id: 'opp-fbd-01',
      name: 'Rohan Mehta',
      title: 'Opposition Representative — Faridabad',
      districtId: 'faridabad',
      districtName: 'Faridabad',
      partyName: 'Democratic Accountability Forum',
      role: 'opposition',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    officers: [
      {
        id: 'off-fbd-01',
        name: 'Anita Sharma',
        designation: 'Assistant Engineer',
        department: 'Water Supply Department',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        role: 'officer'
      },
      {
        id: 'off-fbd-02',
        name: 'Rajiv Mehta',
        designation: 'Executive Engineer',
        department: 'Water Supply Department',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        role: 'officer'
      },
      {
        id: 'off-fbd-03',
        name: 'Vikram Seth',
        designation: 'Superintending Engineer',
        department: 'Public Works Department',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        role: 'officer'
      },
      {
        id: 'off-fbd-04',
        name: 'Suresh Rao',
        designation: 'Assistant Commissioner',
        department: 'Drainage Department',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        role: 'officer'
      },
      {
        id: 'off-fbd-05',
        name: 'Sunita Deshmukh',
        designation: 'Director',
        department: 'Parks & Recreation Department',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        role: 'officer'
      }
    ],
    citizens: [
      {
        id: 'cit-fbd-01',
        name: 'Rahul Sharma',
        governmentId: 'GOV-HR-FBD-10021',
        maskedGovId: '********021',
        pinCode: '121001',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        representativeName: 'Aarav Sharma',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cit-fbd-02',
        name: 'Aisha Khan',
        governmentId: 'GOV-HR-FBD-10022',
        maskedGovId: '********022',
        pinCode: '121003',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        representativeName: 'Aarav Sharma',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cit-fbd-03',
        name: 'Arjun Verma',
        governmentId: 'GOV-HR-FBD-10023',
        maskedGovId: '********023',
        pinCode: '121006',
        districtId: 'faridabad',
        districtName: 'Faridabad',
        representativeName: 'Aarav Sharma',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
      }
    ],
    projects: [
      {
        id: 'proj-fbd-01',
        districtId: 'faridabad',
        sector: 'Sector 15',
        name: 'Water Supply Pipeline Expansion',
        department: 'Water Supply Department',
        status: 'Ongoing',
        progressPercentage: 68,
        budgetCr: 2.4,
        currentExpenditureCr: 2.1,
        startDate: 'June 2026',
        expectedCompletion: 'September 2026',
        whyExists: 'The project aims to resolve chronic low water pressure and provide continuous drinking water supply for residential blocks across Sector 15.',
        expectedOutcome: 'Direct pipeline connection to 12,000 households with automated pressure balancing valves.',
        coordinates: [28.4089, 77.3178],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Water Supply Department',
          departmentHead: {
            name: 'Rajiv Mehta',
            designation: 'Executive Engineer',
            department: 'Water Supply Department'
          },
          projectOfficer: {
            name: 'Anita Sharma',
            designation: 'Assistant Engineer',
            department: 'Water Supply Department',
            contactPhone: '+91 129 2234011',
            contactEmail: 'anita.sharma@faridabad.gov.demo'
          },
          contractor: {
            companyName: 'ABC Infrastructure Services Ltd',
            registrationNumber: 'HR-PWD-A-44912',
            role: 'Primary EPC Contractor',
            contactPerson: 'Mr. S. K. Gupta'
          }
        },
        liveUpdates: [
          {
            id: 'upd-fbd-101',
            date: '19 August 2026 — 4:30 PM',
            description: 'Pipeline installation completed in Block A. Hydrostatic pressure testing underway.',
            progressPercentage: 68,
            author: 'Anita Sharma (Assistant Engineer)'
          },
          {
            id: 'upd-fbd-102',
            date: '17 August 2026 — 11:00 AM',
            description: 'Underground trenching finished along Main Market Avenue; pipe laying begun.',
            progressPercentage: 60,
            author: 'Anita Sharma (Assistant Engineer)'
          },
          {
            id: 'upd-fbd-103',
            date: '12 August 2026 — 2:00 PM',
            description: 'Underground pipeline inspection completed by Municipal QA team.',
            progressPercentage: 52,
            author: 'Rajiv Mehta (Executive Engineer)'
          }
        ],
        progressHistory: [
          { month: 'June', progressPercentage: 25 },
          { month: 'July', progressPercentage: 48 },
          { month: 'August', progressPercentage: 68 }
        ],
        ratings: [
          {
            id: 'rat-01',
            citizenName: 'Rahul Sharma',
            rating: 4,
            comment: 'Work is moving fast on Main Avenue. Hope road restoration happens immediately after.',
            date: '18 August 2026'
          },
          {
            id: 'rat-02',
            citizenName: 'Pooja Aggarwal',
            rating: 3.5,
            comment: 'Water supply has improved slightly, but pressure is still inconsistent in morning peak hours.',
            date: '15 August 2026'
          }
        ],
        averageRating: 3.8
      },
      {
        id: 'proj-fbd-02',
        districtId: 'faridabad',
        sector: 'Sector 10',
        name: 'Park Construction Project',
        department: 'Parks & Recreation Department',
        status: 'Ongoing',
        progressPercentage: 45,
        budgetCr: 1.2,
        currentExpenditureCr: 0.7,
        startDate: 'July 2026',
        expectedCompletion: 'October 2026',
        whyExists: 'Developing a 4-acre ecological community park with walking tracks, children play area, and solar lighting.',
        expectedOutcome: 'Green public recreation zone catering to over 8,000 residents.',
        coordinates: [28.3742, 77.3195],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Parks & Recreation Department',
          departmentHead: {
            name: 'Sunita Deshmukh',
            designation: 'Director',
            department: 'Parks & Recreation Department'
          },
          projectOfficer: {
            name: 'Mohit Batra',
            designation: 'Horticulture Officer',
            department: 'Parks & Recreation Department',
            contactPhone: '+91 129 2248102'
          },
          contractor: {
            companyName: 'GreenTech Urban Landscapes',
            registrationNumber: 'HR-HORT-B-8910',
            role: 'Landscaping & Civil Contractor'
          }
        },
        liveUpdates: [
          {
            id: 'upd-fbd-201',
            date: '18 August 2026 — 2:00 PM',
            description: 'Perimeter jogging track paved with permeable pavers. Tree sapling plantation phase 1 completed.',
            progressPercentage: 45,
            author: 'Mohit Batra (Horticulture Officer)'
          }
        ],
        progressHistory: [
          { month: 'July', progressPercentage: 20 },
          { month: 'August', progressPercentage: 45 }
        ],
        ratings: [
          {
            id: 'rat-03',
            citizenName: 'Sunil Chawla',
            rating: 4.5,
            comment: 'The open amphitheater and jogging track layout looks wonderful.',
            date: '17 August 2026'
          }
        ],
        averageRating: 4.1
      },
      {
        id: 'proj-fbd-03',
        districtId: 'faridabad',
        sector: 'Sector 7',
        name: 'Road Repair and Resurfacing',
        department: 'Public Works Department',
        status: 'Completed',
        progressPercentage: 100,
        budgetCr: 3.8,
        currentExpenditureCr: 3.7,
        startDate: 'April 2026',
        expectedCompletion: 'July 2026',
        whyExists: 'Complete reconstruction and asphalt overlay of the 4.2 km main arterial corridor connecting Sector 7 to Mathura Road.',
        expectedOutcome: 'Pothole-free corridor with thermoplastic lane markings and pedestrian walkways.',
        coordinates: [28.3680, 77.3300],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Public Works Department',
          departmentHead: {
            name: 'Vikram Seth',
            designation: 'Superintending Engineer',
            department: 'Public Works Department'
          },
          projectOfficer: {
            name: 'Pramod Tyagi',
            designation: 'Executive Engineer (Roads)',
            department: 'Public Works Department',
            contactPhone: '+91 129 2239088'
          },
          contractor: {
            companyName: 'National Paving & Infra Corp',
            registrationNumber: 'HR-PWD-AA-1002',
            role: 'Highway Contractor'
          }
        },
        liveUpdates: [
          {
            id: 'upd-fbd-301',
            date: '28 July 2026 — 5:00 PM',
            description: 'Final quality audit passed. Road open for full vehicular traffic.',
            progressPercentage: 100,
            author: 'Pramod Tyagi (Executive Engineer)'
          }
        ],
        progressHistory: [
          { month: 'April', progressPercentage: 30 },
          { month: 'May', progressPercentage: 65 },
          { month: 'June', progressPercentage: 90 },
          { month: 'July', progressPercentage: 100 }
        ],
        ratings: [
          {
            id: 'rat-04',
            citizenName: 'Aisha Khan',
            rating: 4.8,
            comment: 'Commuting time reduced significantly. Excellent smooth surface and clear reflector markers.',
            date: '02 August 2026'
          }
        ],
        averageRating: 4.8
      },
      {
        id: 'proj-fbd-04',
        districtId: 'faridabad',
        sector: 'Sector 12',
        name: 'Street Light Installation & Smart Grid',
        department: 'Electrical Department',
        status: 'Ongoing',
        progressPercentage: 72,
        budgetCr: 0.9,
        currentExpenditureCr: 0.75,
        startDate: 'May 2026',
        expectedCompletion: 'September 2026',
        whyExists: 'Replacing broken sodium vapor fixtures with 450 energy-efficient smart LED street light poles with dusk-to-dawn sensors.',
        expectedOutcome: '100% illumination along residential lanes and market avenues for women safety and reduced energy bills.',
        coordinates: [28.3980, 77.3200],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Electrical Department',
          departmentHead: {
            name: 'Harish Singhal',
            designation: 'Chief Electrical Engineer',
            department: 'Electrical Department'
          },
          projectOfficer: {
            name: 'Vikas Hooda',
            designation: 'Assistant Engineer (Electrical)',
            department: 'Electrical Department'
          },
          contractor: {
            companyName: 'BrightCity Solutions Pvt Ltd',
            registrationNumber: 'HR-ELEC-C-4512',
            role: 'Smart Lighting EPC'
          }
        },
        liveUpdates: [
          {
            id: 'upd-fbd-401',
            date: '15 August 2026 — 11:30 AM',
            description: '320 out of 450 smart LED fixtures erected and energized.',
            progressPercentage: 72,
            author: 'Vikas Hooda (Assistant Engineer)'
          }
        ],
        progressHistory: [
          { month: 'May', progressPercentage: 20 },
          { month: 'June', progressPercentage: 45 },
          { month: 'July', progressPercentage: 62 },
          { month: 'August', progressPercentage: 72 }
        ],
        ratings: [],
        averageRating: 4.2
      },
      {
        id: 'proj-fbd-05',
        districtId: 'faridabad',
        sector: 'Sector 8',
        name: 'Drainage System Improvement & Desilting',
        department: 'Drainage Department',
        status: 'Delayed',
        progressPercentage: 54,
        budgetCr: 2.9,
        currentExpenditureCr: 2.5,
        startDate: 'March 2026',
        expectedCompletion: 'July 2026 (Revised: Oct 2026)',
        whyExists: 'Upgrading the old stormwater drain cross-section to stop severe monsoon waterlogging in low-lying residential clusters.',
        expectedOutcome: 'High-discharge reinforced concrete boxed culverts draining directly into Badshahpur canal.',
        coordinates: [28.3705, 77.3250],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Drainage Department',
          departmentHead: {
            name: 'Suresh Rao',
            designation: 'Assistant Commissioner',
            department: 'Drainage Department'
          },
          projectOfficer: {
            name: 'Dinesh Kaushik',
            designation: 'Sub-Divisional Officer (Drainage)',
            department: 'Drainage Department',
            contactPhone: '+91 129 2210944'
          },
          contractor: {
            companyName: 'Apex Hydro Infra Projects',
            registrationNumber: 'HR-IRR-A-9012',
            role: 'Drainage Contractor'
          }
        },
        liveUpdates: [
          {
            id: 'upd-fbd-501',
            date: '14 August 2026 — 3:00 PM',
            description: 'Sub-surface utility clash with telecom fiber optic duct delayed culvert casting by 3 weeks. Rerouting completed.',
            progressPercentage: 54,
            author: 'Dinesh Kaushik (SDO Drainage)'
          }
        ],
        progressHistory: [
          { month: 'March', progressPercentage: 15 },
          { month: 'April', progressPercentage: 30 },
          { month: 'May', progressPercentage: 45 },
          { month: 'June', progressPercentage: 50 },
          { month: 'July', progressPercentage: 54 }
        ],
        ratings: [
          {
            id: 'rat-05',
            citizenName: 'Manish Rawat',
            rating: 2.5,
            comment: 'Work has been stalled for weeks causing traffic jams during rain. Please expedite completion.',
            date: '10 August 2026'
          }
        ],
        averageRating: 2.8
      },
      // Planned Projects
      {
        id: 'proj-fbd-06',
        districtId: 'faridabad',
        sector: 'Sector 18',
        name: 'New Underground Water Tank & Booster Station',
        department: 'Water Supply Department',
        status: 'Planned',
        progressPercentage: 0,
        budgetCr: 1.8,
        currentExpenditureCr: 0.0,
        startDate: 'October 2026',
        expectedCompletion: 'March 2027',
        whyExists: 'Constructing 20-lakh liter capacity underground reservoir to feed Sectors 17 & 18.',
        expectedOutcome: 'Sufficient storage buffer during canal maintenance cycles.',
        coordinates: [28.4120, 77.3050],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Water Supply Department',
          departmentHead: {
            name: 'Rajiv Mehta',
            designation: 'Executive Engineer',
            department: 'Water Supply Department'
          },
          projectOfficer: {
            name: 'Anita Sharma',
            designation: 'Assistant Engineer',
            department: 'Water Supply Department'
          },
          contractor: {
            companyName: 'Tender in Technical Evaluation Stage',
            registrationNumber: 'N/A',
            role: 'Prospective Bidder'
          }
        },
        liveUpdates: [
          {
            id: 'upd-fbd-601',
            date: '10 August 2026 — 10:00 AM',
            description: 'Financial bid opened. Administrative sanction approved by Municipal Council.',
            progressPercentage: 0,
            author: 'Rajiv Mehta (Executive Engineer)'
          }
        ],
        progressHistory: [{ month: 'August', progressPercentage: 0 }],
        ratings: [],
        averageRating: 0
      },
      {
        id: 'proj-fbd-07',
        districtId: 'faridabad',
        sector: 'Sector 9',
        name: "Children's Park & Senior Citizen Green Track",
        department: 'Parks & Recreation Department',
        status: 'Planned',
        progressPercentage: 0,
        budgetCr: 0.6,
        currentExpenditureCr: 0.0,
        startDate: 'September 2026',
        expectedCompletion: 'December 2026',
        whyExists: 'Transforming unused municipal plot into an eco-friendly community play area.',
        expectedOutcome: 'Safe recreational space with rubberized play flooring.',
        coordinates: [28.3810, 77.3220],
        accountability: {
          representativeName: 'Aarav Sharma',
          representativeParty: "People's Development Front",
          departmentName: 'Parks & Recreation Department',
          departmentHead: {
            name: 'Sunita Deshmukh',
            designation: 'Director',
            department: 'Parks & Recreation Department'
          },
          projectOfficer: {
            name: 'Mohit Batra',
            designation: 'Horticulture Officer',
            department: 'Parks & Recreation Department'
          },
          contractor: {
            companyName: 'Tendering Stage',
            registrationNumber: 'N/A',
            role: 'To be assigned'
          }
        },
        liveUpdates: [],
        progressHistory: [{ month: 'August', progressPercentage: 0 }],
        ratings: [],
        averageRating: 0
      }
    ],
    posts: [
      {
        id: 'post-fbd-01',
        districtId: 'faridabad',
        authorId: 'rep-fbd-01',
        authorName: 'Aarav Sharma',
        authorRole: 'District Representative — Faridabad',
        partyName: "People's Development Front",
        timestamp: '2026-08-19T14:30:00Z',
        relativeTime: '2 hours ago',
        content: 'The Sector 15 water supply pipeline project has reached 68% completion. Main line trenching is complete across Block A and hydrostatic pressure testing is underway. The next phase of household pipeline installation is scheduled to begin this week.',
        sector: 'Sector 15',
        postType: 'Project Update',
        attachedProjectId: 'proj-fbd-01',
        attachedProject: {
          id: 'proj-fbd-01',
          name: 'Water Supply Pipeline Expansion',
          sector: 'Sector 15',
          progressPercentage: 68,
          budgetCr: 2.4,
          department: 'Water Supply Department',
          status: 'Ongoing'
        },
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
        likes: 245,
        supportsCount: 245,
        commentsCount: 38,
        viewsCount: 1240,
        comments: [
          {
            id: 'c-01',
            citizenName: 'Rahul Sharma',
            content: 'Great to see regular updates! Please ensure road restoration starts right behind the pipe laying.',
            timestamp: '1 hour ago',
            likes: 14
          },
          {
            id: 'c-02',
            citizenName: 'Devendra Malik',
            content: 'Can the Assistant Engineer share the exact date for Block C tap connection testing?',
            timestamp: '45 mins ago',
            likes: 8
          }
        ],
        oppositionResponse: {
          id: 'opp-claim-01',
          postId: 'post-fbd-01',
          authorName: 'Rohan Mehta',
          authorRole: 'Opposition Representative — Faridabad',
          claimCategory: 'Progress Discrepancy',
          content: 'The department’s project dashboard currently reports 68% progress. Residents in Block B have also submitted unresolved complaints regarding incomplete connections. Clarification is required on the reported 80% claim made during last week’s press briefing.',
          timestamp: '1 hour ago',
          supportingDataUrl: '#',
          citizenSupports: 142
        },
        govResponse: {
          id: 'gov-resp-01',
          postId: 'post-fbd-01',
          officerName: 'Rajiv Mehta',
          officerDesignation: 'Executive Engineer',
          department: 'Water Supply Department',
          content: 'Clarification: The 80% figure mentioned in the review refers strictly to civil trenching and primary trunk line laying. Cumulative project progress including individual household feeder meters stands at 68%. Block B household connections are scheduled for 22nd August.',
          timestamp: '30 mins ago'
        }
      },
      {
        id: 'post-fbd-02',
        districtId: 'faridabad',
        authorId: 'rep-fbd-01',
        authorName: 'Aarav Sharma',
        authorRole: 'District Representative — Faridabad',
        partyName: "People's Development Front",
        timestamp: '2026-08-19T11:00:00Z',
        relativeTime: '5 hours ago',
        content: 'Construction of the new community park in Sector 10 has entered its second phase. Walking tracks, green zones, and solar lamp posts are being installed. Citizens can track the project’s progress directly through the Projects section.',
        sector: 'Sector 10',
        postType: 'Development Milestone',
        attachedProjectId: 'proj-fbd-02',
        attachedProject: {
          id: 'proj-fbd-02',
          name: 'Park Construction Project',
          sector: 'Sector 10',
          progressPercentage: 45,
          budgetCr: 1.2,
          department: 'Parks & Recreation Department',
          status: 'Ongoing'
        },
        imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80',
        likes: 189,
        supportsCount: 189,
        commentsCount: 22,
        viewsCount: 950,
        comments: [
          {
            id: 'c-03',
            citizenName: 'Sunil Chawla',
            content: 'Please ensure adequate seating benches and shaded gazebos for senior citizens.',
            timestamp: '3 hours ago',
            likes: 19
          }
        ]
      },
      {
        id: 'post-fbd-03',
        districtId: 'faridabad',
        authorId: 'rep-fbd-01',
        authorName: 'Aarav Sharma',
        authorRole: 'District Representative — Faridabad',
        partyName: "People's Development Front",
        timestamp: '2026-08-18T10:00:00Z',
        relativeTime: '1 day ago',
        content: 'Delighted to share that Sector 7 Road Resurfacing is 100% completed and fully opened for traffic. Quality inspection reports confirm smooth riding quality and durable asphalt grade.',
        sector: 'Sector 7',
        postType: 'Development Milestone',
        attachedProjectId: 'proj-fbd-03',
        attachedProject: {
          id: 'proj-fbd-03',
          name: 'Road Repair and Resurfacing',
          sector: 'Sector 7',
          progressPercentage: 100,
          budgetCr: 3.8,
          department: 'Public Works Department',
          status: 'Completed'
        },
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        likes: 310,
        supportsCount: 310,
        commentsCount: 45,
        viewsCount: 1800,
        comments: []
      }
    ],
    grievances: [
      {
        id: 'grv-fbd-01',
        complaintNumber: 'GRV-FBD-1024',
        districtId: 'faridabad',
        sector: 'Sector 15',
        title: 'Low Water Pressure in Residential Area — Sector 15',
        description: 'Water pressure in Block B 2nd floor flats has dropped to near zero during morning hours since pipeline digging began.',
        category: 'WATER_SUPPLY',
        department: 'Water Supply Department',
        priority: 'High',
        status: 'InProgress',
        createdAt: '16 August 2026',
        citizenName: 'Rahul Sharma',
        projectId: 'proj-fbd-01',
        projectName: 'Water Supply Pipeline Expansion',
        locationDetails: 'House No. 142, Block B, Sector 15',
        aiDepartmentConfidence: 94,
        resolutionRemarks: 'Assigned to AE Anita Sharma. Booster valve adjustment scheduled for today.'
      },
      {
        id: 'grv-fbd-02',
        complaintNumber: 'GRV-FBD-1025',
        districtId: 'faridabad',
        sector: 'Sector 7',
        title: 'Damaged Road Near Main Market — Sector 7',
        description: 'Potholes on the approach road near Sector 7 shopping center.',
        category: 'ROAD_DAMAGE',
        department: 'Public Works Department',
        priority: 'Medium',
        status: 'Resolved',
        createdAt: '10 July 2026',
        resolvedAt: '25 July 2026',
        citizenName: 'Aisha Khan',
        projectId: 'proj-fbd-03',
        projectName: 'Road Repair and Resurfacing',
        locationDetails: 'Near Market Entry Gate 2',
        aiDepartmentConfidence: 96,
        feedbackRating: 5,
        feedbackComment: 'Resurfacing was completed cleanly as part of the Sector 7 master road project. Commute is very smooth now.',
        resolutionRemarks: 'Pothole patch work merged into full corridor asphalt overlay.'
      },
      {
        id: 'grv-fbd-03',
        complaintNumber: 'GRV-FBD-1026',
        districtId: 'faridabad',
        sector: 'Sector 12',
        title: 'Street Lights Not Working — Sector 12',
        description: 'Three consecutive street lamp poles in Lane 4 are completely dark after 7 PM.',
        category: 'STREET_LIGHT',
        department: 'Electrical Department',
        priority: 'Medium',
        status: 'Open',
        createdAt: '18 August 2026',
        citizenName: 'Arjun Verma',
        projectId: 'proj-fbd-04',
        projectName: 'Street Light Installation & Smart Grid',
        locationDetails: 'Lane 4, opposite Community Center',
        aiDepartmentConfidence: 91
      },
      {
        id: 'grv-fbd-04',
        complaintNumber: 'GRV-FBD-1027',
        districtId: 'faridabad',
        sector: 'Sector 8',
        title: 'Blocked Drain Causing Waterlogging — Sector 8',
        description: 'Stagnant wastewater pooling on main road due to clogged stormwater drain near roundabout.',
        category: 'DRAINAGE',
        department: 'Drainage Department',
        priority: 'Critical',
        status: 'InProgress',
        createdAt: '15 August 2026',
        citizenName: 'Manish Rawat',
        projectId: 'proj-fbd-05',
        projectName: 'Drainage System Improvement & Desilting',
        locationDetails: 'Sector 8 / 9 Dividing Road Roundabout',
        aiDepartmentConfidence: 93,
        resolutionRemarks: 'Emergency suction tanker deployed; desilting work in progress under project proj-fbd-05.'
      },
      {
        id: 'grv-fbd-05',
        complaintNumber: 'GRV-FBD-1028',
        districtId: 'faridabad',
        sector: 'Sector 10',
        title: 'Park Equipment Damaged — Sector 10',
        description: 'Broken swing link in old children play zone.',
        category: 'PARKS_RECREATION',
        department: 'Parks & Recreation Department',
        priority: 'Low',
        status: 'Resolved',
        createdAt: '01 August 2026',
        resolvedAt: '08 August 2026',
        citizenName: 'Sunil Chawla',
        projectId: 'proj-fbd-02',
        projectName: 'Park Construction Project',
        locationDetails: 'Sector 10 Old Park Corner',
        aiDepartmentConfidence: 88,
        feedbackRating: 4,
        feedbackComment: 'The broken swing was replaced with a new safety swing.',
        resolutionRemarks: 'Replaced under ongoing park renovation contract.'
      }
    ],
    oppositionQuestions: [
      {
        id: 'q-fbd-101',
        questionId: 'Q-FBD-101',
        districtId: 'faridabad',
        projectId: 'proj-fbd-05',
        projectName: 'Drainage System Improvement & Desilting (Sector 8)',
        department: 'Drainage Department',
        questionText: 'Why has the Sector 8 drainage project exceeded its expected July 2026 completion date while expenditure has reached ₹2.5 Cr out of the sanctioned ₹2.9 Cr?',
        claimCategory: 'Delay',
        raisedBy: 'Rohan Mehta (Opposition Representative)',
        raisedDate: '05 August 2026',
        status: 'Answered',
        govResponseText: 'The delay was necessitated due to the discovery of unmapped underground optical fiber cables crossing the drain trajectory. Rerouting has been completed and project delivery revised to October 2026 with no budget cost overrun.',
        responseOfficerName: 'Suresh Rao',
        responseOfficerDesignation: 'Assistant Commissioner (Drainage)',
        responseDate: '12 August 2026',
        citizenSupports: 215
      },
      {
        id: 'q-fbd-102',
        questionId: 'Q-FBD-102',
        districtId: 'faridabad',
        projectId: 'proj-fbd-01',
        projectName: 'Water Supply Pipeline Expansion (Sector 15)',
        department: 'Water Supply Department',
        questionText: 'What quality testing protocols were conducted on the ductile iron pipes laid in Block A to prevent future underground leakage?',
        claimCategory: 'Quality Concern',
        raisedBy: 'Rohan Mehta (Opposition Representative)',
        raisedDate: '15 August 2026',
        status: 'Under Review',
        citizenSupports: 84
      }
    ],
    notifications: [
      {
        id: 'notif-fbd-01',
        targetRole: 'all',
        districtId: 'faridabad',
        title: 'New Project Update',
        message: 'Aarav Sharma published a progress update for Sector 15 Water Pipeline (68% complete).',
        timestamp: '2 hours ago',
        read: false,
        link: '/projects/proj-fbd-01',
        type: 'project'
      },
      {
        id: 'notif-fbd-02',
        targetRole: 'citizen',
        districtId: 'faridabad',
        title: 'Grievance Update',
        message: 'Your grievance GRV-FBD-1024 has been assigned to AE Anita Sharma.',
        timestamp: '1 day ago',
        read: true,
        link: '/complaints/grv-fbd-01',
        type: 'grievance'
      },
      {
        id: 'notif-fbd-03',
        targetRole: 'all',
        districtId: 'faridabad',
        title: 'Opposition Question Answered',
        message: 'Drainage Department published an official response to Question Q-FBD-101 on Sector 8 Drainage.',
        timestamp: '7 days ago',
        read: true,
        link: '/scrutiny',
        type: 'gov_response'
      }
    ]
  },

  gurugram: {
    id: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    pincodes: ['122001', '122002', '122003', '122008', '122018', '122022', '122050'],
    representative: {
      id: 'rep-ggm-01',
      name: 'Meera Kapoor',
      title: 'District Representative — Gurugram',
      districtId: 'gurugram',
      districtName: 'Gurugram',
      partyName: 'Civic Progress Alliance',
      role: 'representative',
      bio: 'Leading sustainable urban infrastructure, modern drainage corridors, smart mobility, and public accountability for Gurugram district.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    opposition: {
      id: 'opp-ggm-01',
      name: 'Sana Khan',
      title: 'Opposition Representative — Gurugram',
      districtId: 'gurugram',
      districtName: 'Gurugram',
      partyName: 'Citizens United Party',
      role: 'opposition',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    officers: [
      {
        id: 'off-ggm-01',
        name: 'Deepak Malhotra',
        designation: 'Executive Engineer (Civil)',
        department: 'Public Works Department',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        role: 'officer'
      },
      {
        id: 'off-ggm-02',
        name: 'Kavita Jain',
        designation: 'Chief Engineer',
        department: 'Drainage Department',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        role: 'officer'
      },
      {
        id: 'off-ggm-03',
        name: 'Harish Singhal',
        designation: 'Divisional Engineer',
        department: 'Electrical Department',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        role: 'officer'
      },
      {
        id: 'off-ggm-04',
        name: 'Ananya Roy',
        designation: 'Joint Director',
        department: 'Parks Department',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        role: 'officer'
      }
    ],
    citizens: [
      {
        id: 'cit-ggm-01',
        name: 'Priya Singh',
        governmentId: 'GOV-HR-GGM-20021',
        maskedGovId: '********021',
        pinCode: '122001',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        representativeName: 'Meera Kapoor',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cit-ggm-02',
        name: 'Rohan Mehta (Citizen)',
        governmentId: 'GOV-HR-GGM-20022',
        maskedGovId: '********022',
        pinCode: '122002',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        representativeName: 'Meera Kapoor',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'cit-ggm-03',
        name: 'Sana Kapoor',
        governmentId: 'GOV-HR-GGM-20023',
        maskedGovId: '********023',
        pinCode: '122018',
        districtId: 'gurugram',
        districtName: 'Gurugram',
        representativeName: 'Meera Kapoor',
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      }
    ],
    projects: [
      {
        id: 'proj-ggm-01',
        districtId: 'gurugram',
        sector: 'Sector 29',
        name: 'Public Park Renovation & Cultural Plaza',
        department: 'Parks Department',
        status: 'Ongoing',
        progressPercentage: 52,
        budgetCr: 2.1,
        currentExpenditureCr: 1.4,
        startDate: 'May 2026',
        expectedCompletion: 'November 2026',
        whyExists: 'Modernizing the central public park in Sector 29 with open air theatre, rainwater harvesting ponds, and pedestrian plaza.',
        expectedOutcome: 'Vibrant green civic hub attracting thousands of visitors every weekend.',
        coordinates: [28.4682, 77.0633],
        accountability: {
          representativeName: 'Meera Kapoor',
          representativeParty: 'Civic Progress Alliance',
          departmentName: 'Parks Department',
          departmentHead: {
            name: 'Ananya Roy',
            designation: 'Joint Director',
            department: 'Parks Department'
          },
          projectOfficer: {
            name: 'Karan Singhal',
            designation: 'Senior Horticulture Officer',
            department: 'Parks Department',
            contactPhone: '+91 124 4567890'
          },
          contractor: {
            companyName: 'DLF Urban Greenworks Pvt Ltd',
            registrationNumber: 'HR-GGM-PARK-01',
            role: 'Urban Landscaping Contractor'
          }
        },
        liveUpdates: [
          {
            id: 'upd-ggm-101',
            date: '19 August 2026 — 10:00 AM',
            description: 'Amphitheatre stepped seating concrete casting finished.',
            progressPercentage: 52,
            author: 'Karan Singhal (Senior Horticulture Officer)'
          }
        ],
        progressHistory: [
          { month: 'May', progressPercentage: 15 },
          { month: 'June', progressPercentage: 30 },
          { month: 'July', progressPercentage: 42 },
          { month: 'August', progressPercentage: 52 }
        ],
        ratings: [
          {
            id: 'rat-ggm-01',
            citizenName: 'Priya Singh',
            rating: 4.2,
            comment: 'Excited for the open stage and lake cleaning. Looks promising.',
            date: '17 August 2026'
          }
        ],
        averageRating: 4.2
      },
      {
        id: 'proj-ggm-02',
        districtId: 'gurugram',
        sector: 'Sector 14',
        name: 'Road Resurfacing and Smart Intersections',
        department: 'Public Works Department',
        status: 'Ongoing',
        progressPercentage: 61,
        budgetCr: 4.5,
        currentExpenditureCr: 3.2,
        startDate: 'April 2026',
        expectedCompletion: 'October 2026',
        whyExists: 'Widening the main market sector corridor, laying bituminous mastic asphalt, and setting up intelligent traffic signal timing.',
        expectedOutcome: 'Zero bottleneck flow connecting Old Railway Road with MG Road.',
        coordinates: [28.4725, 77.0450],
        accountability: {
          representativeName: 'Meera Kapoor',
          representativeParty: 'Civic Progress Alliance',
          departmentName: 'Public Works Department',
          departmentHead: {
            name: 'Deepak Malhotra',
            designation: 'Executive Engineer (Civil)',
            department: 'Public Works Department'
          },
          projectOfficer: {
            name: 'Rohit Chauhan',
            designation: 'Assistant Engineer (Roads)',
            department: 'Public Works Department'
          },
          contractor: {
            companyName: 'Prime Highways & Urban Infrastructure',
            registrationNumber: 'HR-PWD-GGM-902',
            role: 'EPC Highway Contractor'
          }
        },
        liveUpdates: [
          {
            id: 'upd-ggm-201',
            date: '16 August 2026 — 6:00 PM',
            description: 'Bitumen base layer complete for entire 3.1 km stretch; signal sensor loops installed.',
            progressPercentage: 61,
            author: 'Rohit Chauhan (Assistant Engineer)'
          }
        ],
        progressHistory: [
          { month: 'April', progressPercentage: 20 },
          { month: 'May', progressPercentage: 35 },
          { month: 'June', progressPercentage: 48 },
          { month: 'July', progressPercentage: 55 },
          { month: 'August', progressPercentage: 61 }
        ],
        ratings: [],
        averageRating: 4.0
      },
      {
        id: 'proj-ggm-03',
        districtId: 'gurugram',
        sector: 'Sector 43',
        name: 'Storm Water Drain Improvement & Micro-Tunnels',
        department: 'Drainage Department',
        status: 'Delayed',
        progressPercentage: 47,
        budgetCr: 3.4,
        currentExpenditureCr: 2.9,
        startDate: 'February 2026',
        expectedCompletion: 'June 2026 (Revised: Nov 2026)',
        whyExists: 'Building high-capacity underground box drains to eradicate severe monsoon submergence on Golf Course Extension road link.',
        expectedOutcome: 'Direct discharge into Najafgarh master drain basin.',
        coordinates: [28.4550, 77.0850],
        accountability: {
          representativeName: 'Meera Kapoor',
          representativeParty: 'Civic Progress Alliance',
          departmentName: 'Drainage Department',
          departmentHead: {
            name: 'Kavita Jain',
            designation: 'Chief Engineer',
            department: 'Drainage Department'
          },
          projectOfficer: {
            name: 'Alok Saxena',
            designation: 'Executive Engineer (Drainage)',
            department: 'Drainage Department',
            contactPhone: '+91 124 2339011'
          },
          contractor: {
            companyName: 'BlueWave Infrastructure Ltd',
            registrationNumber: 'HR-DRAIN-A-778',
            role: 'Underground Tunneling Contractor'
          }
        },
        liveUpdates: [
          {
            id: 'upd-ggm-301',
            date: '12 August 2026 — 4:00 PM',
            description: 'Micro-tunnel boring machine faced rocky strata at 8m depth; specialized drill bit imported and deployed.',
            progressPercentage: 47,
            author: 'Alok Saxena (Executive Engineer)'
          }
        ],
        progressHistory: [
          { month: 'February', progressPercentage: 15 },
          { month: 'March', progressPercentage: 25 },
          { month: 'April', progressPercentage: 35 },
          { month: 'May', progressPercentage: 42 },
          { month: 'June', progressPercentage: 45 },
          { month: 'July', progressPercentage: 47 }
        ],
        ratings: [
          {
            id: 'rat-ggm-02',
            citizenName: 'Rohan Mehta',
            rating: 2.0,
            comment: 'Traffic diversions around Sector 43 metro have been mismanaged for months. Please hurry up.',
            date: '11 August 2026'
          }
        ],
        averageRating: 2.3
      },
      {
        id: 'proj-ggm-04',
        districtId: 'gurugram',
        sector: 'Sector 56',
        name: 'Street Lighting Modernization & Solar Smart Poles',
        department: 'Electrical Department',
        status: 'Ongoing',
        progressPercentage: 74,
        budgetCr: 1.5,
        currentExpenditureCr: 1.2,
        startDate: 'May 2026',
        expectedCompletion: 'September 2026',
        whyExists: 'Replacing traditional sodium lights with 600 smart LED poles equipped with CCTV feeds and panic buttons.',
        expectedOutcome: 'High safety score for women commuters and 40% reduction in municipal power usage.',
        coordinates: [28.4230, 77.1050],
        accountability: {
          representativeName: 'Meera Kapoor',
          representativeParty: 'Civic Progress Alliance',
          departmentName: 'Electrical Department',
          departmentHead: {
            name: 'Harish Singhal',
            designation: 'Divisional Engineer',
            department: 'Electrical Department'
          },
          projectOfficer: {
            name: 'Gaurav Vats',
            designation: 'Sub-Divisional Officer',
            department: 'Electrical Department'
          },
          contractor: {
            companyName: 'Lumos Power & Automation Infra',
            registrationNumber: 'HR-ELEC-GGM-112',
            role: 'Smart Pole EPC'
          }
        },
        liveUpdates: [
          {
            id: 'upd-ggm-401',
            date: '17 August 2026 — 12:00 PM',
            description: '450 smart poles powered and connected to District Integrated Command & Control Centre.',
            progressPercentage: 74,
            author: 'Gaurav Vats (SDO)'
          }
        ],
        progressHistory: [
          { month: 'May', progressPercentage: 25 },
          { month: 'June', progressPercentage: 50 },
          { month: 'July', progressPercentage: 65 },
          { month: 'August', progressPercentage: 74 }
        ],
        ratings: [
          {
            id: 'rat-ggm-03',
            citizenName: 'Sana Kapoor',
            rating: 4.6,
            comment: 'The illumination on Sector 56 Huda market road is excellent now at night.',
            date: '18 August 2026'
          }
        ],
        averageRating: 4.6
      },
      // Planned Projects
      {
        id: 'proj-ggm-05',
        districtId: 'gurugram',
        sector: 'Sector 57',
        name: 'Integrated Community Facility & Digital Library',
        department: 'Public Facilities Department',
        status: 'Planned',
        progressPercentage: 0,
        budgetCr: 5.2,
        currentExpenditureCr: 0.0,
        startDate: 'November 2026',
        expectedCompletion: 'May 2027',
        whyExists: 'Building a 3-storey civic centre with e-library, indoor sports auditorium, and senior citizen wellness room.',
        expectedOutcome: 'Multi-purpose public center serving 15,000 residents across Sectors 56 & 57.',
        coordinates: [28.4180, 77.1080],
        accountability: {
          representativeName: 'Meera Kapoor',
          representativeParty: 'Civic Progress Alliance',
          departmentName: 'Public Facilities Department',
          departmentHead: {
            name: 'Deepak Malhotra',
            designation: 'Executive Engineer (Civil)',
            department: 'Public Facilities Department'
          },
          projectOfficer: {
            name: 'Rohit Chauhan',
            designation: 'Assistant Engineer',
            department: 'Public Facilities Department'
          },
          contractor: {
            companyName: 'Bidding Under Technical Review',
            registrationNumber: 'N/A',
            role: 'Prospective Contractor'
          }
        },
        liveUpdates: [],
        progressHistory: [{ month: 'August', progressPercentage: 0 }],
        ratings: [],
        averageRating: 0
      },
      {
        id: 'proj-ggm-06',
        districtId: 'gurugram',
        sector: 'Sector 44',
        name: 'Green Corridor & Urban Biodiversity Park',
        department: 'Parks Department',
        status: 'Planned',
        progressPercentage: 0,
        budgetCr: 2.8,
        currentExpenditureCr: 0.0,
        startDate: 'October 2026',
        expectedCompletion: 'February 2027',
        whyExists: 'Developing 6 km continuous green non-motorized cycling and walking track with native trees.',
        expectedOutcome: 'Reduced carbon footprint and clean pedestrian connectivity between HUDA City Centre and Sector 44.',
        coordinates: [28.4520, 77.0700],
        accountability: {
          representativeName: 'Meera Kapoor',
          representativeParty: 'Civic Progress Alliance',
          departmentName: 'Parks Department',
          departmentHead: {
            name: 'Ananya Roy',
            designation: 'Joint Director',
            department: 'Parks Department'
          },
          projectOfficer: {
            name: 'Karan Singhal',
            designation: 'Senior Horticulture Officer',
            department: 'Parks Department'
          },
          contractor: {
            companyName: 'Planning Phase',
            registrationNumber: 'N/A',
            role: 'To be assigned'
          }
        },
        liveUpdates: [],
        progressHistory: [{ month: 'August', progressPercentage: 0 }],
        ratings: [],
        averageRating: 0
      }
    ],
    posts: [
      {
        id: 'post-ggm-01',
        districtId: 'gurugram',
        authorId: 'rep-ggm-01',
        authorName: 'Meera Kapoor',
        authorRole: 'District Representative — Gurugram',
        partyName: 'Civic Progress Alliance',
        timestamp: '2026-08-19T13:00:00Z',
        relativeTime: '3 hours ago',
        content: 'Reviewing progress on the Sector 29 Public Park and Cultural Plaza. The open amphitheatre stepped seating has been cast and rainwater retention pond landscaping is underway. We are on track for a public opening in November.',
        sector: 'Sector 29',
        postType: 'Project Update',
        attachedProjectId: 'proj-ggm-01',
        attachedProject: {
          id: 'proj-ggm-01',
          name: 'Public Park Renovation & Cultural Plaza',
          sector: 'Sector 29',
          progressPercentage: 52,
          budgetCr: 2.1,
          department: 'Parks Department',
          status: 'Ongoing'
        },
        imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80',
        likes: 278,
        supportsCount: 278,
        commentsCount: 31,
        viewsCount: 1450,
        comments: [
          {
            id: 'c-ggm-01',
            citizenName: 'Priya Singh',
            content: 'Great project for families! Please ensure ample solar lighting along the walking tracks.',
            timestamp: '2 hours ago',
            likes: 12
          }
        ],
        oppositionResponse: {
          id: 'opp-claim-ggm-01',
          postId: 'post-ggm-01',
          authorName: 'Sana Khan',
          authorRole: 'Opposition Representative — Gurugram',
          claimCategory: 'Delay',
          content: 'While Sector 29 receives continuous attention, the vital Sector 43 storm drain project remains stalled at 47% despite ₹2.9 Cr expenditure. Monsoon flooding continues to harass thousands of daily commuters on Golf Course Road.',
          timestamp: '2 hours ago',
          supportingDataUrl: '#',
          citizenSupports: 168
        },
        govResponse: {
          id: 'gov-resp-ggm-01',
          postId: 'post-ggm-01',
          officerName: 'Kavita Jain',
          officerDesignation: 'Chief Engineer',
          department: 'Drainage Department',
          content: 'Drainage Department Update: For Sector 43, specialized diamond-head cutter bits have been mobilized to drill through hard underground rock strata. Night shifts are deployed to deliver the trunk link by November 2026.',
          timestamp: '1 hour ago'
        }
      },
      {
        id: 'post-ggm-02',
        districtId: 'gurugram',
        authorId: 'rep-ggm-01',
        authorName: 'Meera Kapoor',
        authorRole: 'District Representative — Gurugram',
        partyName: 'Civic Progress Alliance',
        timestamp: '2026-08-18T15:30:00Z',
        relativeTime: '1 day ago',
        content: 'Sector 56 Smart LED lighting grid has crossed 74% completion with 450 poles energized. CCTV and emergency SOS integration with the Police Command Center is complete.',
        sector: 'Sector 56',
        postType: 'Development Milestone',
        attachedProjectId: 'proj-ggm-04',
        attachedProject: {
          id: 'proj-ggm-04',
          name: 'Street Lighting Modernization & Solar Smart Poles',
          sector: 'Sector 56',
          progressPercentage: 74,
          budgetCr: 1.5,
          department: 'Electrical Department',
          status: 'Ongoing'
        },
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
        likes: 340,
        supportsCount: 340,
        commentsCount: 42,
        viewsCount: 2100,
        comments: []
      }
    ],
    grievances: [
      {
        id: 'grv-ggm-01',
        complaintNumber: 'GRV-GGM-2010',
        districtId: 'gurugram',
        sector: 'Sector 43',
        title: 'Severe Waterlogging Near Metro Station — Sector 43',
        description: 'Underpass and slip road inundated with 2 feet deep water after evening downpour due to blocked drain culvert.',
        category: 'DRAINAGE',
        department: 'Drainage Department',
        priority: 'Critical',
        status: 'InProgress',
        createdAt: '17 August 2026',
        citizenName: 'Priya Singh',
        projectId: 'proj-ggm-03',
        projectName: 'Storm Water Drain Improvement & Micro-Tunnels',
        locationDetails: 'Sector 43 Rapid Metro Pillar 114',
        aiDepartmentConfidence: 97,
        resolutionRemarks: 'Mobile dewatering pump placed on site; permanent box drain under construction.'
      },
      {
        id: 'grv-ggm-02',
        complaintNumber: 'GRV-GGM-2011',
        districtId: 'gurugram',
        sector: 'Sector 14',
        title: 'Road Potholes Near Girls College — Sector 14',
        description: 'Deep crater causing hazard for two-wheelers outside college gate.',
        category: 'ROAD_DAMAGE',
        department: 'Public Works Department',
        priority: 'High',
        status: 'Resolved',
        createdAt: '02 August 2026',
        resolvedAt: '12 August 2026',
        citizenName: 'Sana Kapoor',
        projectId: 'proj-ggm-02',
        projectName: 'Road Resurfacing and Smart Intersections',
        locationDetails: 'Opposite Government College Gate',
        aiDepartmentConfidence: 95,
        feedbackRating: 5,
        feedbackComment: 'The road section was re-asphalted completely with smooth finish.',
        resolutionRemarks: 'Completed as part of the Sector 14 master corridor contract.'
      },
      {
        id: 'grv-ggm-03',
        complaintNumber: 'GRV-GGM-2012',
        districtId: 'gurugram',
        sector: 'Sector 56',
        title: 'Flickering Street Light — Sector 56',
        description: 'Smart pole lamp fixture near Block B park flickering intermittently.',
        category: 'STREET_LIGHT',
        department: 'Electrical Department',
        priority: 'Low',
        status: 'Open',
        createdAt: '19 August 2026',
        citizenName: 'Rohan Mehta',
        projectId: 'proj-ggm-04',
        projectName: 'Street Lighting Modernization & Solar Smart Poles',
        locationDetails: 'Block B, Park facing Gate 1',
        aiDepartmentConfidence: 92
      }
    ],
    oppositionQuestions: [
      {
        id: 'q-ggm-201',
        questionId: 'Q-GGM-201',
        districtId: 'gurugram',
        projectId: 'proj-ggm-03',
        projectName: 'Storm Water Drain Improvement (Sector 43)',
        department: 'Drainage Department',
        questionText: 'Why has the Sector 43 drainage project missed its original June 2026 completion deadline? What is the penalty levied on the contractor for the delay?',
        claimCategory: 'Delay',
        raisedBy: 'Sana Khan (Opposition Representative)',
        raisedDate: '01 August 2026',
        status: 'Answered',
        govResponseText: 'Geological survey discrepancy encountered unexpected granite bedrock at 8m depth requiring specialized non-explosive hydraulic tunneling. Penalty clause is held in abeyance pending statutory revised timeline of November 2026.',
        responseOfficerName: 'Kavita Jain',
        responseOfficerDesignation: 'Chief Engineer (Drainage)',
        responseDate: '08 August 2026',
        citizenSupports: 184
      }
    ],
    notifications: [
      {
        id: 'notif-ggm-01',
        targetRole: 'all',
        districtId: 'gurugram',
        title: 'District Representative Update',
        message: 'Meera Kapoor posted an update on Sector 29 Public Park Renovation.',
        timestamp: '3 hours ago',
        read: false,
        link: '/projects/proj-ggm-01',
        type: 'project'
      },
      {
        id: 'notif-ggm-02',
        targetRole: 'citizen',
        districtId: 'gurugram',
        title: 'Grievance Verified',
        message: 'Grievance GRV-GGM-2011 has been resolved with 5-star citizen verification.',
        timestamp: '7 days ago',
        read: true,
        link: '/complaints/grv-ggm-02',
        type: 'grievance'
      }
    ]
  }
}
