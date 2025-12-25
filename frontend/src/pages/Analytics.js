import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Brain,
  AlertTriangle,
  Cloud,
  Calendar
} from 'lucide-react';
import { mockAnalytics } from '../mock/data';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const COLORS = ['#3B82F6', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Risk Analytics & Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive analytics and AI learning metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prediction Accuracy</p>
                <p className="text-3xl font-bold text-green-600">94.3%</p>
                <div className="flex items-center space-x-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+2.1% from last month</span>
                </div>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prevented Breakdowns</p>
                <p className="text-3xl font-bold text-blue-600">47</p>
                <div className="flex items-center space-x-1 mt-2 text-sm text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8 from last week</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">False Positives</p>
                <p className="text-3xl font-bold text-orange-600">5.2%</p>
                <div className="flex items-center space-x-1 mt-2 text-sm text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>-1.3% improvement</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Quality Score</p>
                <p className="text-3xl font-bold text-teal-600">91%</p>
                <div className="flex items-center space-x-1 mt-2 text-sm text-teal-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Excellent</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Failure Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Predictions vs Actual</CardTitle>
            <CardDescription>Monthly comparison of AI predictions and actual breakdowns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAnalytics.failureTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="predictions" stroke="#3B82F6" strokeWidth={2} name="AI Predictions" />
                <Line type="monotone" dataKey="failures" stroke="#EF4444" strokeWidth={2} name="Actual Failures" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk by Route */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution by Route</CardTitle>
            <CardDescription>Average breakdown risk percentage per route</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.riskByRoute}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="route" angle={-15} textAnchor="end" height={80} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="risk" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Risk %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weather Correlation */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Impact on Breakdowns</CardTitle>
            <CardDescription>Breakdown correlation with weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.weatherCorrelation}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="weather" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="breakdowns" fill="#14B8A6" radius={[8, 8, 0, 0]} name="Breakdowns" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Confidence Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>AI Learning Confidence Over Time</CardTitle>
            <CardDescription>Model confidence improvement through continuous learning</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAnalytics.aiConfidenceTimeline}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis domain={[60, 100]} className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#8B5CF6" 
                  strokeWidth={3} 
                  name="Confidence %"
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Quality & Model Performance */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Precision</span>
                <span className="font-semibold text-green-600">92.8%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '92.8%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Recall</span>
                <span className="font-semibold text-blue-600">95.1%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '95.1%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">F1 Score</span>
                <span className="font-semibold text-purple-600">93.9%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '93.9%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Completeness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Telemetry Data</span>
                <span className="font-semibold text-teal-600">89%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Maintenance Records</span>
                <span className="font-semibold text-orange-600">96%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600" style={{ width: '96%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Driver Behavior</span>
                <span className="font-semibold text-blue-600">87%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '87%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <span className="text-sm font-medium">Model Status</span>
              <span className="text-sm font-semibold text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <span className="text-sm font-medium">Last Training</span>
              <span className="text-sm font-semibold text-blue-600">2h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <span className="text-sm font-medium">Training Data</span>
              <span className="text-sm font-semibold text-purple-600">12,543</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
              <span className="text-sm font-medium">Model Version</span>
              <span className="text-sm font-semibold text-teal-600">v2.4.1</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI Accuracy Improved</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Model accuracy increased by 2.1% after learning from 50 new trip completions this week
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Weather Impact Alert</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Storm conditions increase breakdown risk by 18%. Consider route alternatives for high-risk vehicles
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Preventive Success</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI-driven preventive maintenance prevented 47 potential breakdowns, saving ₹4.2L this month
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Driver Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Top 3 drivers show 12% lower risk contribution. Consider their patterns for training programs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;