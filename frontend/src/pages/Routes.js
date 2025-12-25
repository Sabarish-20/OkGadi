import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Route as RouteIcon, 
  Plus, 
  Edit, 
  Trash2,
  MapPin,
  TrendingUp,
  Cloud,
  DollarSign,
  Activity
} from 'lucide-react';
import { mockRoutes } from '../mock/data';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';

const Routes = () => {
  const { isAdmin } = useAuth();
  const [routes, setRoutes] = useState(mockRoutes);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWeatherColor = (impact) => {
    if (impact === 'Low') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    if (impact === 'Medium') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
  };

  const getRiskColor = (risk) => {
    if (risk < 10) return 'text-green-600';
    if (risk < 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleDelete = (routeId) => {
    setRoutes(routes.filter(r => r.id !== routeId));
    toast({
      title: 'Route Deleted',
      description: 'Route has been removed from the system'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Route Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage routes and analyze performance metrics</p>
        </div>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
                <DialogDescription>Enter route details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Route Name</Label>
                  <Input placeholder="e.g., Mumbai - Delhi Express" />
                </div>
                <div className="space-y-2">
                  <Label>Distance (km)</Label>
                  <Input type="number" placeholder="Distance in kilometers" />
                </div>
                <div className="space-y-2">
                  <Label>Terrain</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terrain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Highway">Highway</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                      <SelectItem value="Mountain">Mountain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Add Route</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <Input
        placeholder="Search routes..."
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{routes.length}</p>
              </div>
              <RouteIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Trips</p>
                <p className="text-2xl font-bold text-teal-600">{routes.reduce((sum, r) => sum + r.activeTrips, 0)}</p>
              </div>
              <Activity className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Distance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(routes.reduce((sum, r) => sum + r.distance, 0) / routes.length)} km
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(routes.reduce((sum, r) => sum + r.avgBreakdownRate, 0) / routes.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Distance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Terrain</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Weather</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Active</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost</th>
                  {isAdmin && <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{route.name}</p>
                        <p className="text-sm text-gray-500">{route.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{route.distance} km</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900 dark:text-white">{route.avgDuration}h</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{route.terrain}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getWeatherColor(route.weatherImpact)}>
                        {route.weatherImpact}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-teal-600">{route.activeTrips} trips</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${getRiskColor(route.avgBreakdownRate)}`}>
                        {route.avgBreakdownRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900 dark:text-white">₹{(route.tollCost + route.fuelCost).toLocaleString()}</span>
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
                                <DialogTitle>Edit Route</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select defaultValue={route.status}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button className="w-full">Update Route</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(route.id)}
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

export default Routes;