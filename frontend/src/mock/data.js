// Mock data for OkGadi AI Transport Engine

export const mockVehicles = [
  {
    id: 'VH001',
    name: 'Tata Ultra T.7',
    type: 'Heavy Truck',
    status: 'active',
    healthScore: 87,
    breakdownRisk: 23,
    telemetryCompleteness: 95,
    location: 'Mumbai Depot',
    driver: 'DRV001',
    lastMaintenance: '2025-06-15',
    nextMaintenance: '2025-08-15',
    telemetry: {
      engineTemp: 82,
      speed: 65,
      rpm: 2200,
      fuelLevel: 78,
      oilPressure: 45
    },
    anomalies: ['High RPM fluctuation'],
    totalTrips: 234,
    totalKm: 45620
  },
  {
    id: 'VH002',
    name: 'Ashok Leyland 3118',
    type: 'Medium Truck',
    status: 'active',
    healthScore: 92,
    breakdownRisk: 12,
    telemetryCompleteness: 98,
    location: 'Delhi Hub',
    driver: 'DRV002',
    lastMaintenance: '2025-07-01',
    nextMaintenance: '2025-09-01',
    telemetry: {
      engineTemp: 78,
      speed: 70,
      rpm: 2100,
      fuelLevel: 85,
      oilPressure: 48
    },
    anomalies: [],
    totalTrips: 189,
    totalKm: 38450
  },
  {
    id: 'VH003',
    name: 'Mahindra Blazo X',
    type: 'Heavy Truck',
    status: 'maintenance',
    healthScore: 45,
    breakdownRisk: 78,
    telemetryCompleteness: 67,
    location: 'Bangalore Service',
    driver: null,
    lastMaintenance: '2025-05-20',
    nextMaintenance: '2025-07-20',
    telemetry: {
      engineTemp: 95,
      speed: 0,
      rpm: 0,
      fuelLevel: 34,
      oilPressure: 32
    },
    anomalies: ['Engine overheating', 'Low oil pressure', 'Sensor malfunction'],
    totalTrips: 312,
    totalKm: 67890
  },
  {
    id: 'VH004',
    name: 'BharatBenz 2823R',
    type: 'Heavy Truck',
    status: 'active',
    healthScore: 95,
    breakdownRisk: 8,
    telemetryCompleteness: 99,
    location: 'Chennai Depot',
    driver: 'DRV003',
    lastMaintenance: '2025-07-10',
    nextMaintenance: '2025-09-10',
    telemetry: {
      engineTemp: 76,
      speed: 68,
      rpm: 2050,
      fuelLevel: 92,
      oilPressure: 50
    },
    anomalies: [],
    totalTrips: 156,
    totalKm: 32100
  },
  {
    id: 'VH005',
    name: 'Eicher Pro 6031',
    type: 'Medium Truck',
    status: 'active',
    healthScore: 71,
    breakdownRisk: 35,
    telemetryCompleteness: 82,
    location: 'Pune Hub',
    driver: 'DRV004',
    lastMaintenance: '2025-06-05',
    nextMaintenance: '2025-08-05',
    telemetry: {
      engineTemp: 88,
      speed: 62,
      rpm: 2300,
      fuelLevel: 56,
      oilPressure: 42
    },
    anomalies: ['Irregular fuel consumption'],
    totalTrips: 267,
    totalKm: 54320
  }
];

export const mockDrivers = [
  {
    id: 'DRV001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    experience: 8,
    status: 'active',
    currentVehicle: 'VH001',
    currentTrip: 'TRP001',
    totalTrips: 456,
    performanceScore: 88,
    riskContribution: 15,
    licenseExpiry: '2027-03-15',
    incidents: 2,
    onTimeDelivery: 94
  },
  {
    id: 'DRV002',
    name: 'Amit Singh',
    phone: '+91 98765 43211',
    experience: 12,
    status: 'active',
    currentVehicle: 'VH002',
    currentTrip: 'TRP002',
    totalTrips: 678,
    performanceScore: 95,
    riskContribution: 8,
    licenseExpiry: '2026-11-20',
    incidents: 0,
    onTimeDelivery: 98
  },
  {
    id: 'DRV003',
    name: 'Suresh Patil',
    phone: '+91 98765 43212',
    experience: 15,
    status: 'active',
    currentVehicle: 'VH004',
    currentTrip: null,
    totalTrips: 892,
    performanceScore: 92,
    riskContribution: 10,
    licenseExpiry: '2028-01-10',
    incidents: 1,
    onTimeDelivery: 96
  },
  {
    id: 'DRV004',
    name: 'Vikram Desai',
    phone: '+91 98765 43213',
    experience: 6,
    status: 'active',
    currentVehicle: 'VH005',
    currentTrip: 'TRP003',
    totalTrips: 234,
    performanceScore: 76,
    riskContribution: 28,
    licenseExpiry: '2026-08-05',
    incidents: 5,
    onTimeDelivery: 87
  },
  {
    id: 'DRV005',
    name: 'Mohammed Ali',
    phone: '+91 98765 43214',
    experience: 10,
    status: 'inactive',
    currentVehicle: null,
    currentTrip: null,
    totalTrips: 523,
    performanceScore: 90,
    riskContribution: 12,
    licenseExpiry: '2027-05-18',
    incidents: 1,
    onTimeDelivery: 95
  }
];

export const mockRoutes = [
  {
    id: 'RT001',
    name: 'Mumbai - Delhi Express',
    distance: 1420,
    avgDuration: 26,
    terrain: 'Highway',
    weatherImpact: 'Low',
    status: 'active',
    activeTrips: 3,
    avgBreakdownRate: 12,
    tollCost: 3200,
    fuelCost: 15600
  },
  {
    id: 'RT002',
    name: 'Bangalore - Chennai Route',
    distance: 350,
    avgDuration: 7,
    terrain: 'Highway',
    weatherImpact: 'Medium',
    status: 'active',
    activeTrips: 5,
    avgBreakdownRate: 8,
    tollCost: 850,
    fuelCost: 3850
  },
  {
    id: 'RT003',
    name: 'Delhi - Jaipur Highway',
    distance: 280,
    avgDuration: 5,
    terrain: 'Highway',
    weatherImpact: 'High',
    status: 'active',
    activeTrips: 2,
    avgBreakdownRate: 15,
    tollCost: 620,
    fuelCost: 3080
  },
  {
    id: 'RT004',
    name: 'Mumbai - Pune Express',
    distance: 150,
    avgDuration: 3,
    terrain: 'Highway',
    weatherImpact: 'Low',
    status: 'active',
    activeTrips: 8,
    avgBreakdownRate: 5,
    tollCost: 380,
    fuelCost: 1650
  },
  {
    id: 'RT005',
    name: 'Kolkata - Bhubaneswar',
    distance: 445,
    avgDuration: 9,
    terrain: 'Mixed',
    weatherImpact: 'High',
    status: 'active',
    activeTrips: 1,
    avgBreakdownRate: 22,
    tollCost: 1050,
    fuelCost: 4895
  }
];

export const mockTrips = [
  {
    id: 'TRP001',
    route: 'RT001',
    vehicle: 'VH001',
    driver: 'DRV001',
    status: 'in-progress',
    loadWeight: 18000,
    startTime: '2025-07-20T06:00:00',
    expectedEnd: '2025-07-21T08:00:00',
    breakdownRisk: 23,
    aiConfidence: 87,
    predictedIssues: ['High RPM under load'],
    progress: 45
  },
  {
    id: 'TRP002',
    route: 'RT002',
    vehicle: 'VH002',
    driver: 'DRV002',
    status: 'in-progress',
    loadWeight: 12000,
    startTime: '2025-07-20T08:00:00',
    expectedEnd: '2025-07-20T15:00:00',
    breakdownRisk: 12,
    aiConfidence: 94,
    predictedIssues: [],
    progress: 68
  },
  {
    id: 'TRP003',
    route: 'RT004',
    vehicle: 'VH005',
    driver: 'DRV004',
    status: 'completed',
    loadWeight: 9000,
    startTime: '2025-07-19T10:00:00',
    expectedEnd: '2025-07-19T13:00:00',
    actualEnd: '2025-07-19T13:15:00',
    breakdownRisk: 35,
    aiConfidence: 76,
    predictedIssues: ['Driver fatigue risk'],
    progress: 100
  }
];

export const mockAlerts = [
  {
    id: 'ALR001',
    type: 'critical',
    title: 'High Breakdown Risk',
    message: 'Vehicle VH003 shows 78% breakdown probability',
    timestamp: '2025-07-20T10:30:00',
    read: false,
    vehicle: 'VH003'
  },
  {
    id: 'ALR002',
    type: 'warning',
    title: 'Low AI Confidence',
    message: 'Trip TRP003 prediction confidence below 80%',
    timestamp: '2025-07-20T09:15:00',
    read: false,
    trip: 'TRP003'
  },
  {
    id: 'ALR003',
    type: 'info',
    title: 'Maintenance Due',
    message: 'Vehicle VH001 maintenance scheduled in 5 days',
    timestamp: '2025-07-20T08:00:00',
    read: true,
    vehicle: 'VH001'
  },
  {
    id: 'ALR004',
    type: 'warning',
    title: 'Telemetry Quality Issue',
    message: 'Vehicle VH005 telemetry completeness dropped to 82%',
    timestamp: '2025-07-20T07:45:00',
    read: true,
    vehicle: 'VH005'
  },
  {
    id: 'ALR005',
    type: 'critical',
    title: 'Route Weather Alert',
    message: 'Heavy rain predicted on RT003 - Delhi to Jaipur',
    timestamp: '2025-07-20T11:00:00',
    read: false,
    route: 'RT003'
  }
];

export const mockAnalytics = {
  failureTrends: [
    { month: 'Jan', failures: 12, predictions: 14 },
    { month: 'Feb', failures: 9, predictions: 11 },
    { month: 'Mar', failures: 15, predictions: 16 },
    { month: 'Apr', failures: 7, predictions: 8 },
    { month: 'May', failures: 11, predictions: 10 },
    { month: 'Jun', failures: 6, predictions: 7 },
    { month: 'Jul', failures: 4, predictions: 5 }
  ],
  riskByRoute: [
    { route: 'Mumbai-Delhi', risk: 12 },
    { route: 'Bangalore-Chennai', risk: 8 },
    { route: 'Delhi-Jaipur', risk: 15 },
    { route: 'Mumbai-Pune', risk: 5 },
    { route: 'Kolkata-Bhubaneswar', risk: 22 }
  ],
  weatherCorrelation: [
    { weather: 'Clear', breakdowns: 5 },
    { weather: 'Rain', breakdowns: 18 },
    { weather: 'Fog', breakdowns: 12 },
    { weather: 'Storm', breakdowns: 25 }
  ],
  aiConfidenceTimeline: [
    { week: 'Week 1', confidence: 65 },
    { week: 'Week 2', confidence: 72 },
    { week: 'Week 3', confidence: 78 },
    { week: 'Week 4', confidence: 83 },
    { week: 'Week 5', confidence: 87 },
    { week: 'Week 6', confidence: 89 },
    { week: 'Week 7', confidence: 91 },
    { week: 'Week 8', confidence: 93 }
  ]
};