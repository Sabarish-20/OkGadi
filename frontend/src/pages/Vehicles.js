import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Truck,
  Plus,
  Edit,
  Trash2,
  Activity,
  AlertTriangle,
  Gauge,
  ThermometerSun,
  Fuel,
  Wrench,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';

const Vehicles = () => {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/vehicles/');
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: 'Error',
        description: 'Failed to fetch vehicles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (risk < 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      maintenance: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    };
    return colors[status] || colors.active;
  };

  const handleDelete = (vehicleId) => {
    // In a real app, this would call DELETE API
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    toast({
      title: 'Vehicle Deleted',
      description: 'Vehicle has been removed from the fleet'
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicle Fleet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage vehicle health & telemetry</p>
        </div>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>Enter vehicle details to add to fleet</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Vehicle Name</Label>
                  <Input placeholder="e.g., Tata Ultra T.7" />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heavy">Heavy Truck</SelectItem>
                      <SelectItem value="medium">Medium Truck</SelectItem>
                      <SelectItem value="light">Light Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Add Vehicle</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">All ({vehicles.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({vehicles.filter(v => v.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance ({vehicles.filter(v => v.status === 'maintenance').length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${vehicle.status === 'active' ? 'bg-gradient-to-br from-blue-500 to-teal-500' :
                      vehicle.status === 'maintenance' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                        'bg-gray-500'
                    }`}>
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.id}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Health Score</span>
                  <span className="text-lg font-bold text-blue-600">{vehicle.healthScore}%</span>
                </div>
                <Progress value={vehicle.healthScore} className="h-2" />
              </div>

              {/* Risk & Telemetry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Breakdown Risk</p>
                  <Badge className={getRiskColor(vehicle.breakdownRisk)}>
                    {vehicle.breakdownRisk}%
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Telemetry</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{vehicle.telemetryCompleteness}%</p>
                </div>
              </div>

              {/* Telemetry Data */}
              {vehicle.status === 'active' && vehicle.telemetry && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm">
                    <ThermometerSun className="h-4 w-4 text-orange-500" />
                    <span>{vehicle.telemetry.engineTemp}°C</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <span>{vehicle.telemetry.speed} km/h</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span>{vehicle.telemetry.rpm} RPM</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Fuel className="h-4 w-4 text-green-500" />
                    <span>{vehicle.telemetry.fuelLevel}%</span>
                  </div>
                </div>
              )}

              {/* Anomalies */}
              {vehicle.anomalies?.length > 0 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-orange-900 dark:text-orange-400 mb-1">Anomalies Detected</p>
                      {vehicle.anomalies.map((anomaly, idx) => (
                        <p key={idx} className="text-xs text-orange-700 dark:text-orange-500">• {anomaly}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Trips</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{vehicle.totalTrips}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total KM</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{vehicle.totalKm.toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              {isAdmin && (
                <div className="flex space-x-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedVehicle(vehicle)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                        <DialogDescription>Update vehicle details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select defaultValue={vehicle.status}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input defaultValue={vehicle.location} />
                        </div>
                        <Button className="w-full">Update Vehicle</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No vehicles found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Vehicles;