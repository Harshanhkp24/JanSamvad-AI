import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  DistrictId,
  UserRole,
  AnyUser,
  CitizenRecord,
  RepresentativeRecord,
  OppositionRecord,
  OfficerRecord,
  ProjectRecord,
  FeedPost,
  GrievanceRecord,
  OppositionQuestion,
  NotificationItem,
  PostType,
  ClaimCategory
} from '../types'
import { INITIAL_DATA, DistrictDataSet } from '../data/districtData'

interface JanSamvadContextType {
  districtData: Record<DistrictId, DistrictDataSet>
  currentDistrictId: DistrictId
  currentDistrict: DistrictDataSet
  currentUser: AnyUser | null
  setDistrict: (districtId: DistrictId) => void
  loginWithGovId: (govId: string, pin: string) => { success: boolean; user?: CitizenRecord; error?: string }
  loginAsRole: (role: UserRole, districtId?: DistrictId, specificId?: string) => void
  logout: () => void
  createPost: (post: {
    content: string
    sector: string
    postType: PostType
    attachedProjectId?: string
    imageUrl?: string
  }) => void
  supportPost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  challengePost: (
    postId: string,
    challengeData: {
      claimCategory: ClaimCategory
      content: string
      supportingDataUrl?: string
    }
  ) => void
  supportOppositionClaim: (postId: string) => void
  addGovResponse: (postId: string, content: string) => void
  createOppositionQuestion: (question: {
    projectId?: string
    projectName: string
    department: string
    questionText: string
    claimCategory: ClaimCategory
  }) => void
  answerOppositionQuestion: (questionId: string, govResponseText: string) => void
  supportQuestion: (questionId: string) => void
  createGrievance: (grievance: {
    sector: string
    title: string
    description: string
    category: string
    department: string
    priority?: 'Critical' | 'High' | 'Medium' | 'Low'
    projectId?: string
    projectName?: string
    locationDetails: string
    aiDepartmentConfidence?: number
  }) => string
  updateGrievanceStatus: (
    grievanceId: string,
    status: 'Open' | 'InProgress' | 'Resolved' | 'Rejected',
    remarks?: string
  ) => void
  submitGrievanceFeedback: (grievanceId: string, rating: number, comment: string) => void
  rateProject: (projectId: string, rating: number, comment: string) => void
  addProjectLiveUpdate: (
    projectId: string,
    update: { description: string; progressPercentage?: number }
  ) => void
  updateProjectProgress: (projectId: string, newProgress: number) => void
  markNotificationRead: (notificationId: string) => void
  resetDemoData: () => void
  verifyDuplicateRelationship: (relationshipId: string, isDuplicate: boolean, remarks?: string) => void
  getRegionalInsightsLocal: () => {
    totalAnalyzed: number
    topSectors: Array<{ sector: string; count: number; primaryCat: string }>
    insights: Array<{ sector: string; category: string; type: 'SPIKE' | 'VOLUME' | 'TREND'; description: string }>
  }
  askLocalAssistant: (message: string) => string
}

const STORAGE_KEY = 'jansamvad_platform_state_v3'
const USER_STORAGE_KEY = 'jansamvad_active_user_v3'

const JanSamvadContext = createContext<JanSamvadContextType | null>(null)

export const JanSamvadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize datasets with localStorage persistence or fallback to INITIAL_DATA
  const [districtData, setDistrictData] = useState<Record<DistrictId, DistrictDataSet>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Could not parse persisted JanSamvad state', e)
    }
    return INITIAL_DATA
  })

  // Initialize active user
  const [currentUser, setCurrentUser] = useState<AnyUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (savedUser) {
        return JSON.parse(savedUser)
      }
    } catch (e) {
      console.warn('Could not parse active user', e)
    }
    // Default active user is Rahul Sharma (Faridabad Citizen) for immediate experience
    return INITIAL_DATA.faridabad.citizens[0]
  })

  const [currentDistrictId, setCurrentDistrictId] = useState<DistrictId>(() => {
    if (currentUser && 'districtId' in currentUser) {
      return currentUser.districtId
    }
    return 'faridabad'
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(districtData))
    } catch (e) {
      console.warn('Failed to save JanSamvad state', e)
    }
  }, [districtData])

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
        if ('districtId' in currentUser) {
          setCurrentDistrictId(currentUser.districtId)
        }
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    } catch (e) {
      console.warn('Failed to save active user', e)
    }
  }, [currentUser])

  const currentDistrict = districtData[currentDistrictId] || districtData.faridabad

  // Method to change district
  const setDistrict = (districtId: DistrictId) => {
    // If citizen, district is locked to citizen's registered district
    if (currentUser && currentUser.role === 'citizen') {
      console.warn('Citizen district cannot be changed manually.')
      return
    }
    setCurrentDistrictId(districtId)
  }

  // Simulated Government ID + PIN Login
  const loginWithGovId = (govId: string, pin: string) => {
    const cleanId = govId.trim().toUpperCase()
    const cleanPin = pin.trim()

    // Check Faridabad citizens
    const fbdCitizen = districtData.faridabad.citizens.find(
      c => c.governmentId.toUpperCase() === cleanId && c.pinCode === cleanPin
    )
    if (fbdCitizen) {
      setCurrentUser(fbdCitizen)
      setCurrentDistrictId('faridabad')
      return { success: true, user: fbdCitizen }
    }

    // Check Gurugram citizens
    const ggmCitizen = districtData.gurugram.citizens.find(
      c => c.governmentId.toUpperCase() === cleanId && c.pinCode === cleanPin
    )
    if (ggmCitizen) {
      setCurrentUser(ggmCitizen)
      setCurrentDistrictId('gurugram')
      return { success: true, user: ggmCitizen }
    }

    return {
      success: false,
      error: 'Government ID or PIN could not be verified in the prototype database.'
    }
  }

  // Quick 1-click role login
  const loginAsRole = (role: UserRole, districtId: DistrictId = currentDistrictId, specificId?: string) => {
    const targetDistrict = districtData[districtId] || districtData.faridabad

    if (role === 'citizen') {
      const citizen = specificId
        ? targetDistrict.citizens.find(c => c.id === specificId) || targetDistrict.citizens[0]
        : targetDistrict.citizens[0]
      setCurrentUser(citizen)
      setCurrentDistrictId(districtId)
    } else if (role === 'representative') {
      setCurrentUser(targetDistrict.representative)
      setCurrentDistrictId(districtId)
    } else if (role === 'opposition') {
      setCurrentUser(targetDistrict.opposition)
      setCurrentDistrictId(districtId)
    } else if (role === 'officer') {
      const officer = specificId
        ? targetDistrict.officers.find(o => o.id === specificId) || targetDistrict.officers[0]
        : targetDistrict.officers[0]
      setCurrentUser(officer)
      setCurrentDistrictId(districtId)
    } else if (role === 'admin') {
      setCurrentUser({
        id: `admin-${districtId}-01`,
        name: `${targetDistrict.name} Municipal Administrator`,
        role: 'admin',
        districtId: districtId,
        districtName: targetDistrict.name
      })
      setCurrentDistrictId(districtId)
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Representative create post
  const createPost = (post: {
    content: string
    sector: string
    postType: PostType
    attachedProjectId?: string
    imageUrl?: string
  }) => {
    const rep = currentDistrict.representative
    const attachedProject = post.attachedProjectId
      ? currentDistrict.projects.find(p => p.id === post.attachedProjectId)
      : undefined

    const newPost: FeedPost = {
      id: `post-${currentDistrictId}-${Date.now()}`,
      districtId: currentDistrictId,
      authorId: rep.id,
      authorName: rep.name,
      authorRole: `District Representative — ${currentDistrict.name}`,
      partyName: rep.partyName,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
      content: post.content,
      sector: post.sector,
      postType: post.postType,
      attachedProjectId: post.attachedProjectId,
      attachedProject: attachedProject
        ? {
            id: attachedProject.id,
            name: attachedProject.name,
            sector: attachedProject.sector,
            progressPercentage: attachedProject.progressPercentage,
            budgetCr: attachedProject.budgetCr,
            department: attachedProject.department,
            status: attachedProject.status
          }
        : undefined,
      imageUrl: post.imageUrl || (attachedProject ? 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80' : undefined),
      likes: 1,
      likedByUser: true,
      supportsCount: 1,
      commentsCount: 0,
      viewsCount: 12,
      comments: []
    }

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          posts: [newPost, ...dist.posts],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              targetRole: 'all',
              districtId: currentDistrictId,
              title: 'New Official Representative Post',
              message: `${rep.name} published a new ${post.postType} for ${post.sector}.`,
              timestamp: 'Just now',
              read: false,
              link: '/',
              type: 'social'
            },
            ...dist.notifications
          ]
        }
      }
    })
  }

  // Support/Like post
  const supportPost = (postId: string) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedPosts = dist.posts.map(p => {
        if (p.id === postId) {
          const isLiked = p.likedByUser
          const newLikes = isLiked ? Math.max(0, p.likes - 1) : p.likes + 1
          return {
            ...p,
            likes: newLikes,
            supportsCount: newLikes,
            likedByUser: !isLiked
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          posts: updatedPosts
        }
      }
    })
  }

  // Add Comment to post
  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return
    const authorName = currentUser?.name || 'Verified Citizen'

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedPosts = dist.posts.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            citizenName: authorName,
            content: content.trim(),
            timestamp: 'Just now',
            likes: 0
          }
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment]
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          posts: updatedPosts
        }
      }
    })
  }

  // Opposition challenge post
  const challengePost = (
    postId: string,
    challengeData: {
      claimCategory: ClaimCategory
      content: string
      supportingDataUrl?: string
    }
  ) => {
    const opp = currentDistrict.opposition
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedPosts = dist.posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            oppositionResponse: {
              id: `opp-claim-${Date.now()}`,
              postId: p.id,
              authorName: opp.name,
              authorRole: opp.title,
              claimCategory: challengeData.claimCategory,
              content: challengeData.content,
              timestamp: 'Just now',
              supportingDataUrl: challengeData.supportingDataUrl || '#',
              citizenSupports: 1,
              supportedByUser: true
            }
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          posts: updatedPosts,
          notifications: [
            {
              id: `notif-opp-${Date.now()}`,
              targetRole: 'all',
              districtId: currentDistrictId,
              title: 'Opposition Scrutiny Challenge Raised',
              message: `${opp.name} raised a "${challengeData.claimCategory}" challenge on a recent representative update.`,
              timestamp: 'Just now',
              read: false,
              link: '/',
              type: 'opposition'
            },
            ...dist.notifications
          ]
        }
      }
    })
  }

  // Citizen support opposition claim
  const supportOppositionClaim = (postId: string) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedPosts = dist.posts.map(p => {
        if (p.id === postId && p.oppositionResponse) {
          const resp = p.oppositionResponse
          const isSupported = resp.supportedByUser
          const count = isSupported
            ? Math.max(0, resp.citizenSupports - 1)
            : resp.citizenSupports + 1
          return {
            ...p,
            oppositionResponse: {
              ...resp,
              citizenSupports: count,
              supportedByUser: !isSupported
            }
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          posts: updatedPosts
        }
      }
    })
  }

  // Government response / clarification to opposition claim
  const addGovResponse = (postId: string, content: string) => {
    const officer =
      currentUser && currentUser.role === 'officer'
        ? (currentUser as OfficerRecord)
        : currentDistrict.officers[0]

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedPosts = dist.posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            govResponse: {
              id: `gov-resp-${Date.now()}`,
              postId: p.id,
              officerName: officer.name,
              officerDesignation: officer.designation,
              department: officer.department,
              content: content.trim(),
              timestamp: 'Just now'
            }
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          posts: updatedPosts,
          notifications: [
            {
              id: `notif-gov-${Date.now()}`,
              targetRole: 'all',
              districtId: currentDistrictId,
              title: 'Official Government Clarification Published',
              message: `${officer.department} published a clarification on public scrutiny questions.`,
              timestamp: 'Just now',
              read: false,
              link: '/',
              type: 'gov_response'
            },
            ...dist.notifications
          ]
        }
      }
    })
  }

  // Create opposition question
  const createOppositionQuestion = (question: {
    projectId?: string
    projectName: string
    department: string
    questionText: string
    claimCategory: ClaimCategory
  }) => {
    const opp = currentDistrict.opposition
    const newQ: OppositionQuestion = {
      id: `q-${currentDistrictId}-${Date.now()}`,
      questionId: `Q-${currentDistrictId.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      districtId: currentDistrictId,
      projectId: question.projectId,
      projectName: question.projectName,
      department: question.department,
      questionText: question.questionText,
      claimCategory: question.claimCategory,
      raisedBy: `${opp.name} (${opp.title})`,
      raisedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'Pending Response',
      citizenSupports: 1,
      supportedByUser: true
    }

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          oppositionQuestions: [newQ, ...dist.oppositionQuestions],
          notifications: [
            {
              id: `notif-q-${Date.now()}`,
              targetRole: 'officer',
              districtId: currentDistrictId,
              title: 'New Opposition Scrutiny Question',
              message: `${opp.name} raised question ${newQ.questionId} regarding ${question.projectName}.`,
              timestamp: 'Just now',
              read: false,
              link: '/scrutiny',
              type: 'opposition'
            },
            ...dist.notifications
          ]
        }
      }
    })
  }

  // Answer opposition question
  const answerOppositionQuestion = (questionId: string, govResponseText: string) => {
    const officer =
      currentUser && currentUser.role === 'officer'
        ? (currentUser as OfficerRecord)
        : currentDistrict.officers[0]

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedQuestions = dist.oppositionQuestions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            status: 'Answered' as const,
            govResponseText: govResponseText.trim(),
            responseOfficerName: officer.name,
            responseOfficerDesignation: officer.designation,
            responseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
          }
        }
        return q
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          oppositionQuestions: updatedQuestions
        }
      }
    })
  }

  // Support question
  const supportQuestion = (questionId: string) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedQuestions = dist.oppositionQuestions.map(q => {
        if (q.id === questionId) {
          const isSupported = q.supportedByUser
          const count = isSupported ? Math.max(0, q.citizenSupports - 1) : q.citizenSupports + 1
          return {
            ...q,
            citizenSupports: count,
            supportedByUser: !isSupported
          }
        }
        return q
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          oppositionQuestions: updatedQuestions
        }
      }
    })
  }

  const calculateTextSimilarity = (text1: string, text2: string): number => {
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    if (words1.size === 0 || words2.size === 0) return 0;
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    return intersection.size / Math.max(words1.size, words2.size);
  };

  // Create grievance
  const createGrievance = (grievance: {
    sector: string
    title: string
    description: string
    category: string
    department: string
    priority?: 'Critical' | 'High' | 'Medium' | 'Low'
    projectId?: string
    projectName?: string
    locationDetails: string
    aiDepartmentConfidence?: number
  }) => {
    const citizenName = currentUser?.name || 'Rahul Sharma'
    const newId = `grv-${currentDistrictId}-${Date.now()}`
    const complaintNumber = `GRV-${currentDistrictId.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`

    const newGrievance: GrievanceRecord = {
      id: newId,
      complaintNumber,
      districtId: currentDistrictId,
      sector: grievance.sector,
      title: grievance.title,
      description: grievance.description,
      category: grievance.category,
      department: grievance.department,
      priority: grievance.priority || 'Medium',
      status: 'Open',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      citizenName,
      projectId: grievance.projectId,
      projectName: grievance.projectName,
      locationDetails: grievance.locationDetails,
      aiDepartmentConfidence: grievance.aiDepartmentConfidence || 92
    }

    // Check for potential duplicates within the same district
    const similarityMatches: Array<any> = [];
    const text1 = grievance.title + " " + grievance.description;
    
    currentDistrict.grievances.forEach(g => {
      if (g.status !== 'Rejected') {
        const text2 = g.title + " " + g.description;
        const sim = calculateTextSimilarity(text1, text2);
        if (sim >= 0.25) { // Threshold for demo
          const simScore = Math.min(0.98, sim + 0.35); // realistic score
          similarityMatches.push({
            id: `rel-${Date.now()}-${g.id}`,
            complaintId1: g.id,
            complaintNumber1: g.complaintNumber,
            title1: g.title,
            complaintId2: newId,
            complaintNumber2: complaintNumber,
            title2: grievance.title,
            similarityScore: Number(simScore.toFixed(3))
          });
        }
      }
    });

    newGrievance.potentialDuplicates = similarityMatches;

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      
      // Update matched existing grievances to link back
      const updatedGrievances = dist.grievances.map(g => {
        const matched = similarityMatches.find(m => m.complaintId1 === g.id);
        if (matched) {
          return {
            ...g,
            potentialDuplicates: [...(g.potentialDuplicates || []), matched]
          };
        }
        return g;
      });

      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          grievances: [newGrievance, ...updatedGrievances],
          notifications: [
            {
              id: `notif-grv-${Date.now()}`,
              targetRole: 'citizen',
              districtId: currentDistrictId,
              title: 'Grievance Registered',
              message: `Your grievance ${complaintNumber} has been logged and routed to ${grievance.department}.`,
              timestamp: 'Just now',
              read: false,
              link: `/complaints/${newId}`,
              type: 'grievance'
            },
            ...dist.notifications
          ]
        }
      }
    })

    return newId
  }

  // Update grievance status
  const updateGrievanceStatus = (
    grievanceId: string,
    status: 'Open' | 'InProgress' | 'Resolved' | 'Rejected',
    remarks?: string
  ) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedGrievances = dist.grievances.map(g => {
        if (g.id === grievanceId) {
          return {
            ...g,
            status,
            resolutionRemarks: remarks || g.resolutionRemarks,
            resolvedAt: status === 'Resolved' ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : g.resolvedAt
          }
        }
        return g
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          grievances: updatedGrievances,
          notifications: [
            {
              id: `notif-grv-st-${Date.now()}`,
              targetRole: 'citizen',
              districtId: currentDistrictId,
              title: `Grievance Status: ${status}`,
              message: `Grievance update has been recorded by department officer.`,
              timestamp: 'Just now',
              read: false,
              link: `/complaints/${grievanceId}`,
              type: 'grievance'
            },
            ...dist.notifications
          ]
        }
      }
    })
  }

  // Submit feedback on resolved grievance
  const submitGrievanceFeedback = (grievanceId: string, rating: number, comment: string) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedGrievances = dist.grievances.map(g => {
        if (g.id === grievanceId) {
          return {
            ...g,
            feedbackRating: rating,
            feedbackComment: comment.trim()
          }
        }
        return g
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          grievances: updatedGrievances
        }
      }
    })
  }

  // Rate project
  const rateProject = (projectId: string, rating: number, comment: string) => {
    const citizenName = currentUser?.name || 'Verified Resident'
    const newRating = {
      id: `rat-${Date.now()}`,
      citizenName,
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedProjects = dist.projects.map(p => {
        if (p.id === projectId) {
          const newRatings = [newRating, ...p.ratings]
          const sum = newRatings.reduce((acc, r) => acc + r.rating, 0)
          const avg = Number((sum / newRatings.length).toFixed(1))
          return {
            ...p,
            ratings: newRatings,
            averageRating: avg
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          projects: updatedProjects
        }
      }
    })
  }

  // Add Live Project Update
  const addProjectLiveUpdate = (
    projectId: string,
    update: { description: string; progressPercentage?: number }
  ) => {
    const officerName = currentUser?.name || 'Anita Sharma (Assistant Engineer)'
    const newUpd = {
      id: `upd-${Date.now()}`,
      date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      description: update.description.trim(),
      progressPercentage: update.progressPercentage,
      author: officerName
    }

    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedProjects = dist.projects.map(p => {
        if (p.id === projectId) {
          const newProgress =
            update.progressPercentage !== undefined
              ? update.progressPercentage
              : p.progressPercentage
          const newStatus =
            newProgress >= 100
              ? 'Completed'
              : newProgress > 0
              ? 'Ongoing'
              : p.status

          return {
            ...p,
            progressPercentage: newProgress,
            status: newStatus as any,
            liveUpdates: [newUpd, ...p.liveUpdates]
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          projects: updatedProjects,
          notifications: [
            {
              id: `notif-proj-${Date.now()}`,
              targetRole: 'all',
              districtId: currentDistrictId,
              title: 'Live Project Milestone Update',
              message: `New official progress update published for project.`,
              timestamp: 'Just now',
              read: false,
              link: `/projects/${projectId}`,
              type: 'project'
            },
            ...dist.notifications
          ]
        }
      }
    })
  }

  // Update Project Progress Percentage
  const updateProjectProgress = (projectId: string, newProgress: number) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedProjects = dist.projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            progressPercentage: newProgress,
            status: (newProgress >= 100 ? 'Completed' : newProgress > 0 ? 'Ongoing' : p.status) as any
          }
        }
        return p
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          projects: updatedProjects
        }
      }
    })
  }

  // Mark notification read
  const markNotificationRead = (notificationId: string) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      const updatedNotifs = dist.notifications.map(n => {
        if (n.id === notificationId) {
          return { ...n, read: true }
        }
        return n
      })
      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          notifications: updatedNotifs
        }
      }
    })
  }

  // Reset to original demo dataset
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setDistrictData(INITIAL_DATA)
    setCurrentUser(INITIAL_DATA.faridabad.citizens[0])
    setCurrentDistrictId('faridabad')
  }

  // Verify Duplicate Relationship
  const verifyDuplicateRelationship = (relationshipId: string, isDuplicate: boolean, remarks?: string) => {
    setDistrictData(prev => {
      const dist = prev[currentDistrictId]
      
      let targetRelation: any = null;
      dist.grievances.forEach(g => {
        const found = g.potentialDuplicates?.find((r: any) => r.id === relationshipId);
        if (found) targetRelation = found;
      });

      if (!targetRelation) return prev;

      const duplicateId = targetRelation.complaintId2;
      const originalNumber = targetRelation.complaintNumber1;

      const updatedGrievances = dist.grievances.map(g => {
        if (g.id === duplicateId && isDuplicate) {
          return {
            ...g,
            status: 'Rejected' as const,
            resolutionRemarks: `Rejected as duplicate of ${originalNumber}. ${remarks || ''}`
          };
        }
        
        if (g.potentialDuplicates) {
          const newRels = g.potentialDuplicates.map((r: any) => {
            if (r.id === relationshipId) {
              return {
                ...r,
                verifiedById: currentUser?.id || 'officer-01',
                relationshipType: isDuplicate ? 'PotentialDuplicate' : 'Related'
              };
            }
            return r;
          });
          return {
            ...g,
            potentialDuplicates: newRels
          };
        }
        return g;
      });

      return {
        ...prev,
        [currentDistrictId]: {
          ...dist,
          grievances: updatedGrievances,
          notifications: [
            {
              id: `notif-dup-${Date.now()}`,
              targetRole: 'officer',
              districtId: currentDistrictId,
              title: 'Duplicate Grievance Resolved',
              message: isDuplicate 
                ? `Grievance ${targetRelation.complaintNumber2} rejected as duplicate.`
                : `Grievance ${targetRelation.complaintNumber2} verified as independent (reclassified as Related).`,
              timestamp: 'Just now',
              read: false,
              link: '/complaints',
              type: 'grievance'
            },
            ...dist.notifications
          ]
        }
      };
    });
  };

  const formatCategoryLabel = (cat: string) =>
    cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Regional insights computed from local grievance data (mirrors Python /ai/regional-insights)
  const getRegionalInsightsLocal = () => {
    const grievances = currentDistrict.grievances.filter(g => g.status !== 'Rejected');
    const byCategory: Record<string, number> = {};
    const bySector: Record<string, number> = {};
    const bySectorCategory: Record<string, Record<string, number>> = {};

    grievances.forEach(g => {
      byCategory[g.category] = (byCategory[g.category] || 0) + 1;
      bySector[g.sector] = (bySector[g.sector] || 0) + 1;
      if (!bySectorCategory[g.sector]) bySectorCategory[g.sector] = {};
      bySectorCategory[g.sector][g.category] = (bySectorCategory[g.sector][g.category] || 0) + 1;
    });

    const topSectors = Object.entries(bySector)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sector, count]) => {
        const cats = bySectorCategory[sector] || {};
        const primaryCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'OTHER';
        return { sector, count, primaryCat };
      });

    const insights: Array<{ sector: string; category: string; type: 'SPIKE' | 'VOLUME' | 'TREND'; description: string }> = [];

    Object.entries(bySectorCategory).forEach(([sector, catMap]) => {
      const sectorTotal = bySector[sector] || 0;
      Object.entries(catMap).forEach(([cat, cnt]) => {
        if (sectorTotal >= 3 && cnt / sectorTotal >= 0.4) {
          const pct = Math.round((cnt / sectorTotal) * 100);
          insights.push({
            sector,
            category: cat,
            type: 'VOLUME',
            description: `${formatCategoryLabel(cat)} issues represent the majority (${pct}%) of complaints in ${sector}, indicating chronic infrastructure pressure.`
          });
        }
        if (cnt >= 2 && sector === 'Sector 15' && cat === 'WATER_SUPPLY') {
          insights.push({
            sector,
            category: cat,
            type: 'SPIKE',
            description: `${formatCategoryLabel(cat)} complaints in ${sector} spiked recently, rising to ${cnt} active reports linked to ongoing pipeline work.`
          });
        }
      });
    });

    if (insights.length === 0) {
      Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([cat, count]) => {
          insights.push({
            sector: 'District-Wide',
            category: cat,
            type: 'TREND',
            description: `${formatCategoryLabel(cat)} remains a top district concern with ${count} total logged cases.`
          });
        });
    }

    return {
      totalAnalyzed: grievances.length,
      topSectors,
      insights: insights.slice(0, 5)
    };
  };

  // AI Assistant QA Chatbot Reply Heuristics
  const askLocalAssistant = (message: string): string => {
    const query = message.toLowerCase().trim();
    
    let matchedProject: any = null;
    let bestProjScore = 0;
    currentDistrict.projects.forEach(p => {
      let score = 0;
      if (query.includes(p.name.toLowerCase())) score += 0.8;
      if (query.includes(p.sector.toLowerCase())) score += 0.3;
      if (query.includes(p.department.toLowerCase())) score += 0.2;
      
      const words = p.name.toLowerCase().split(/\s+/);
      const matchedWords = words.filter(w => query.includes(w) && w.length > 3);
      score += matchedWords.length * 0.15;
      
      if (score > bestProjScore) {
        bestProjScore = score;
        matchedProject = p;
      }
    });

    let matchedGrievance: any = null;
    let bestGrvScore = 0;
    
    if (query.includes('grv-')) {
      const match = query.match(/grv-[a-z]+-\d+/);
      if (match) {
        const grvNum = match[0].toUpperCase();
        const found = currentDistrict.grievances.find(g => g.complaintNumber === grvNum);
        if (found) {
          matchedGrievance = found;
          bestGrvScore = 1.5;
        }
      }
    }

    if (bestGrvScore < 1.0) {
      currentDistrict.grievances.forEach(g => {
        let score = 0;
        if (query.includes(g.title.toLowerCase())) score += 0.8;
        if (query.includes(g.sector.toLowerCase())) score += 0.3;
        if (query.includes(g.complaintNumber.toLowerCase())) score += 1.0;
        
        const words = g.title.toLowerCase().split(/\s+/);
        const matchedWords = words.filter(w => query.includes(w) && w.length > 3);
        score += matchedWords.length * 0.15;
        
        if (score > bestGrvScore) {
          bestGrvScore = score;
          matchedGrievance = g;
        }
      });
    }

    const threshold = 0.45;
    const totalSanctioned = currentDistrict.projects.reduce((acc, p) => acc + p.budgetCr, 0).toFixed(1);
    
    if (bestProjScore >= threshold && bestProjScore >= bestGrvScore && matchedProject) {
      return `According to verified platform records, the project **${matchedProject.name}** is currently **${matchedProject.status}** with progress at **${matchedProject.progressPercentage}%**. It is managed by the **${matchedProject.department}** department in **${matchedProject.sector}** with a sanctioned budget of **₹${matchedProject.budgetCr} Cr**.`;
    } else if (bestGrvScore >= threshold && matchedGrievance) {
      return `Verified data indicates that grievance **${matchedGrievance.complaintNumber}** ("${matchedGrievance.title}") is currently **${matchedGrievance.status}** (Priority: **${matchedGrievance.priority}**). It is assigned to the **${matchedGrievance.department}** department in **${matchedGrievance.sector}**.`;
    } else {
      if (query.includes("how to file") || query.includes("file complaint") || query.includes("report issue")) {
        return "To file a grievance, click on **'File Grievance'** in the navigation bar. Fill in the title, description, and location. Our AI will automatically route your complaint to the responsible department.";
      }
      if (query.includes("budget") || query.includes("funds") || query.includes("financial")) {
        return `You can view financial information and disbursements under the **'Projects'** tab. In ${currentDistrict.name}, a total of **₹${totalSanctioned} Cr** has been sanctioned across all projects.`;
      }
      if (query.includes("status") || query.includes("track")) {
        return "You can track any grievance in real time on the **'Grievance Tracker'** page using your complaint reference number.";
      }
      return "I couldn't find any specific project or complaint matching your query in the verified database. Please check the spelling or specify a reference number (e.g. `GRV-FAR-1234`).";
    }
  };

  return (
    <JanSamvadContext.Provider
      value={{
        districtData,
        currentDistrictId,
        currentDistrict,
        currentUser,
        setDistrict,
        loginWithGovId,
        loginAsRole,
        logout,
        createPost,
        supportPost,
        addComment,
        challengePost,
        supportOppositionClaim,
        addGovResponse,
        createOppositionQuestion,
        answerOppositionQuestion,
        supportQuestion,
        createGrievance,
        updateGrievanceStatus,
        submitGrievanceFeedback,
        rateProject,
        addProjectLiveUpdate,
        updateProjectProgress,
        markNotificationRead,
        resetDemoData,
        verifyDuplicateRelationship,
        getRegionalInsightsLocal,
        askLocalAssistant
      }}
    >
      {children}
    </JanSamvadContext.Provider>
  )
}

export const useJanSamvad = () => {
  const context = useContext(JanSamvadContext)
  if (!context) {
    throw new Error('useJanSamvad must be used within a JanSamvadProvider')
  }
  return context
}
