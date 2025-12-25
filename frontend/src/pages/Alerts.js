import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  Bell,
  Trash2
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/alerts/');
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    return alert.type === filter;
  });

  const markAsRead = async (alertId) => {
    try {
      await axios.put(`http://localhost:8000/api/alerts/${alertId}/read`);
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      console.error("Error marking alert as read:", error);
      toast({
        title: 'Error',
        description: 'Failed to update alert',
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    // Ideally this should be a bulk API call
    const unreadAlerts = alerts.filter(a => !a.read);
    try {
      await Promise.all(unreadAlerts.map(alert =>
        axios.put(`http://localhost:8000/api/alerts/${alert.id}/read`)
      ));
      setAlerts(alerts.map(alert => ({ ...alert, read: true })));
      toast({
        title: 'All Alerts Marked as Read',
        description: 'All notifications have been marked as read'
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: 'Error',
        description: 'Failed to update some alerts',
        variant: 'destructive'
      });
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`http://localhost:8000/api/alerts/${alertId}`);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast({
        title: 'Alert Deleted',
        description: 'Alert has been removed'
      });
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive'
      });
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-orange-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.read).length;
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.read).length;

  if (loading) {
    return <div className="p-8 text-center">Loading alerts...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts & Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="flex items-center space-x-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                <p className="text-3xl font-bold text-orange-600">{warningCount}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
                <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
              </div>
              <Bell className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({alerts.filter(a => a.type === 'critical').length})</TabsTrigger>
          <TabsTrigger value="warning">Warnings ({alerts.filter(a => a.type === 'warning').length})</TabsTrigger>
          <TabsTrigger value="info">Info ({alerts.filter(a => a.type === 'info').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">You're all caught up! No {filter !== 'all' ? filter : ''} alerts at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`transition-all duration-200 hover:shadow-md border ${getAlertColor(alert.type)
                } ${!alert.read ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                        <Badge className={getBadgeColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        {!alert.read && (
                          <Badge className="bg-blue-600 text-white">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatTimestamp(alert.timestamp)}</span>
                        {alert.vehicle && <span>• Vehicle: {alert.vehicle}</span>}
                        {alert.trip && <span>• Trip: {alert.trip}</span>}
                        {alert.route && <span>• Route: {alert.route}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;