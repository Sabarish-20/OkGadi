import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Truck,
  Activity,
  AlertTriangle,
  TrendingUp,
  Brain,
  Shield,
  CheckCircle2
} from 'lucide-react';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, tripsRes, alertsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/vehicles/'),
          axios.get('http://localhost:8000/api/trips/'),
          axios.get('http://localhost:8000/api/alerts/')
        ]);

        setVehicles(vehiclesRes.data);
        setTrips(tripsRes.data);
        setAlerts(alertsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Live animation: Increase progress by 5% every 5 seconds for active trips
    const interval = setInterval(() => {
      setTrips(currentTrips =>
        currentTrips.map(trip => {
          if (trip.status === 'in-progress' && trip.progress < 100) {
            const newProgress = Math.min(trip.progress + 5, 100);
            return {
              ...trip,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'in-progress'
            };
          }
          return trip;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const tripsToday = trips.filter(t => t.status === 'in-progress').length;
  const highRiskVehicles = vehicles.filter(v => v.breakdownRisk > 50).length;
  const avgRisk = vehicles.length > 0
    ? Math.round(vehicles.reduce((sum, v) => sum + v.breakdownRisk, 0) / vehicles.length)
    : 0;
  const aiConfidence = 93; // This could be calculated or fetched
  const criticalAlerts = alerts.filter(a => !a.read && a.type === 'critical').length;

  const kpiCards = [
    {
      title: 'Active Vehicles',
      value: activeVehicles,
      total: vehicles.length,
      icon: Truck,
      color: 'blue',
      trend: '+2 from yesterday'
    },
    {
      title: 'Trips Today',
      value: tripsToday,
      total: 12,
      icon: Activity,
      color: 'teal',
      trend: '3 completed'
    },
    {
      title: 'High Risk Vehicles',
      value: highRiskVehicles,
      total: vehicles.length,
      icon: AlertTriangle,
      color: 'orange',
      trend: criticalAlerts + ' critical alerts'
    },
    {
      title: 'Avg Breakdown Risk',
      value: avgRisk + '%',
      icon: TrendingUp,
      color: avgRisk < 30 ? 'green' : 'orange',
      trend: 'Down 5% this week'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      teal: 'from-teal-500 to-teal-600',
      orange: 'from-orange-500 to-orange-600',
      green: 'from-green-500 to-green-600'
    };
    return colors[color] || colors.blue;
  };

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (risk < 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      maintenance: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Critical Alerts Banner */}
      {criticalAlerts > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Critical Alerts Detected</p>
              <p className="text-sm opacity-90">{criticalAlerts} vehicles require immediate attention</p>
            </div>
          </div>
          <Badge className="bg-white text-red-600 hover:bg-white">{criticalAlerts}</Badge>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{kpi.title}</p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
                    {kpi.total && (
                      <span className="text-lg text-gray-500">/ {kpi.total}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{kpi.trend}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(kpi.color)} shadow-lg`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI System Health */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>AI System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">AI Confidence</span>
                <span className="text-2xl font-bold text-blue-600">{aiConfidence}%</span>
              </div>
              <Progress value={aiConfidence} className="h-3" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge className="bg-green-600">Stable</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Learning</span>
                </div>
                <span className="text-sm font-semibold">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-teal-600" />
                  <span className="text-sm font-medium">Predictions</span>
                </div>
                <span className="text-sm font-semibold">892 today</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                AI learned from <span className="font-semibold text-blue-600">50 new trips</span> in the last 24 hours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-teal-600" />
                <span>Active Trips</span>
              </div>
              <Badge variant="outline">{trips.filter(t => t.status === 'in-progress').length} Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trips.filter(t => t.status === 'in-progress').map((trip) => (
                <div key={trip.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{trip.id}</h4>
                        <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Vehicle: {trip.vehicle} • Driver: {trip.driver}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(trip.breakdownRisk)}`}>
                        {trip.breakdownRisk}% Risk
                      </div>
                      <p className="text-xs text-gray-500 mt-1">AI: {trip.aiConfidence}%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-semibold">{trip.progress}%</span>
                    </div>
                    <Progress value={trip.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span>Fleet Overview</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Health</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Telemetry</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{vehicle.name}</p>
                        <p className="text-sm text-gray-500">{vehicle.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 max-w-[100px]">
                          <Progress value={vehicle.healthScore} className="h-2" />
                        </div>
                        <span className="text-sm font-semibold">{vehicle.healthScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRiskColor(vehicle.breakdownRisk)}>
                        {vehicle.breakdownRisk}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold">{vehicle.telemetryCompleteness}%</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {vehicle.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;