import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Phone,
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { mockDrivers } from '../mock/data';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';

const Drivers = () => {
  const { isAdmin } = useAuth();
  const [drivers, setDrivers] = useState(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 75) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (score >= 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getRiskColor = (risk) => {
    if (risk < 15) return 'text-green-600';
    if (risk < 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  const handleDelete = (driverId) => {
    setDrivers(drivers.filter(d => d.id !== driverId));
    toast({
      title: 'Driver Removed',
      description: 'Driver has been removed from the system'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track driver performance and risk contributions</p>
        </div>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Enter driver details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Driver Name</Label>
                  <Input placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input type="number" placeholder="Years of experience" />
                </div>
                <Button className="w-full">Add Driver</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <Input
        placeholder="Search drivers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-xs"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{drivers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Drivers</p>
                <p className="text-2xl font-bold text-green-600">{drivers.filter(d => d.status === 'active').length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(drivers.reduce((sum, d) => sum + d.performanceScore, 0) / drivers.length)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">On Time Delivery</p>
                <p className="text-2xl font-bold text-teal-600">
                  {Math.round(drivers.reduce((sum, d) => sum + d.onTimeDelivery, 0) / drivers.length)}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Performance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Experience</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Trips</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">On-Time %</th>
                  {isAdmin && <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{driver.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{driver.id}</span>
                          {driver.currentTrip && (
                            <Badge variant="outline" className="text-xs">On Trip</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getPerformanceColor(driver.performanceScore)}>
                        {driver.performanceScore}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${getRiskColor(driver.riskContribution)}`}>
                        {driver.riskContribution}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900 dark:text-white">{driver.experience} years</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{driver.totalTrips}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{driver.onTimeDelivery}%</span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Driver</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select defaultValue={driver.status}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button className="w-full">Update Driver</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(driver.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
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

export default Drivers;