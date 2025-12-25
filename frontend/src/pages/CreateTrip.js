import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { toast } from '../hooks/use-toast';
import {
  Truck,
  Brain,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  MapPin,
  Weight,
  Cloud,
  Mountain
} from 'lucide-react';
import { mockRoutes } from '../mock/data';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    route: '',
    distance: '',
    loadWeight: 15000,
    terrain: 'highway',
    weather: 'clear'
  });

  const [vehicles, setVehicles] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [showExplainability, setShowExplainability] = useState(false);
  const [simulationLoad, setSimulationLoad] = useState(15000);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleRouteChange = (routeId) => {
    const route = mockRoutes.find(r => r.id === routeId);
    if (route) {
      setFormData({
        ...formData,
        route: routeId,
        distance: route.distance,
        terrain: route.terrain.toLowerCase()
      });
    }
  };

  const calculateAIRecommendation = () => {
    if (!formData.route) {
      toast({
        title: 'Missing Information',
        description: 'Please select a route first',
        variant: 'destructive'
      });
      return;
    }

    // Mock AI calculation
    const availableVehicles = vehicles.filter(v => v.status === 'active');
    const scoredVehicles = availableVehicles.map(vehicle => {
      let riskScore = vehicle.breakdownRisk;

      // Adjust risk based on load
      if (formData.loadWeight > 15000) riskScore += 10;
      if (formData.loadWeight > 20000) riskScore += 15;

      // Adjust for terrain
      if (formData.terrain === 'mixed') riskScore += 5;
      if (formData.terrain === 'mountain') riskScore += 10;

      // Adjust for weather
      if (formData.weather === 'rain') riskScore += 8;
      if (formData.weather === 'storm') riskScore += 15;

      // Adjust for telemetry quality
      if (vehicle.telemetryCompleteness < 80) riskScore += 10;

      const confidence = Math.min(95, vehicle.telemetryCompleteness - (riskScore * 0.3));

      return {
        ...vehicle,
        calculatedRisk: Math.min(95, Math.max(5, riskScore)),
        confidence: Math.round(confidence)
      };
    });

    // Sort by risk (lower is better)
    scoredVehicles.sort((a, b) => a.calculatedRisk - b.calculatedRisk);

    const recommended = scoredVehicles[0];
    const alternatives = scoredVehicles.slice(1, 4);

    if (!recommended) {
      toast({
        title: 'No Vehicles Available',
        description: 'No active vehicles found for this trip.',
        variant: 'destructive'
      });
      return;
    }

    setAiRecommendation({
      recommended,
      alternatives,
      factors: [
        { name: 'Vehicle Health', impact: 'high', value: recommended.healthScore + '%' },
        { name: 'Load Capacity', impact: formData.loadWeight > 15000 ? 'medium' : 'low', value: formData.loadWeight + ' kg' },
        { name: 'Terrain Type', impact: formData.terrain === 'highway' ? 'low' : 'medium', value: formData.terrain },
        { name: 'Weather Conditions', impact: formData.weather === 'clear' ? 'low' : 'high', value: formData.weather },
        { name: 'Telemetry Quality', impact: recommended.telemetryCompleteness > 90 ? 'low' : 'medium', value: recommended.telemetryCompleteness + '%' },
        { name: 'Past Performance', impact: 'medium', value: recommended.totalTrips + ' trips' }
      ]
    });

    setShowExplainability(true);
    toast({
      title: 'AI Recommendation Ready',
      description: 'Best vehicle identified based on predictive analysis'
    });

  };

  const handleVehicleSelect = (selectedVehicle) => {
    const currentRecommended = aiRecommendation.recommended;

    // Calculate factors for the new vehicle
    const newFactors = [
      { name: 'Vehicle Health', impact: 'high', value: selectedVehicle.healthScore + '%' },
      { name: 'Load Capacity', impact: formData.loadWeight > 15000 ? 'medium' : 'low', value: formData.loadWeight + ' kg' },
      { name: 'Terrain Type', impact: formData.terrain === 'highway' ? 'low' : 'medium', value: formData.terrain },
      { name: 'Weather Conditions', impact: formData.weather === 'clear' ? 'low' : 'high', value: formData.weather },
      { name: 'Telemetry Quality', impact: selectedVehicle.telemetryCompleteness > 90 ? 'low' : 'medium', value: selectedVehicle.telemetryCompleteness + '%' },
      { name: 'Past Performance', impact: 'medium', value: selectedVehicle.totalTrips + ' trips' }
    ];

    // Swap lists
    const newAlternatives = aiRecommendation.alternatives
      .filter(v => v.id !== selectedVehicle.id)
      .concat(currentRecommended)
      .sort((a, b) => a.calculatedRisk - b.calculatedRisk);

    setAiRecommendation({
      ...aiRecommendation,
      recommended: selectedVehicle,
      alternatives: newAlternatives,
      factors: newFactors
    });

    toast({
      title: 'Vehicle Updated',
      description: `${selectedVehicle.name} selected as primary vehicle`
    });
  };

  const simulateRiskChange = (newLoad) => {
    setSimulationLoad(newLoad);
    if (aiRecommendation) {
      const loadDiff = (newLoad - formData.loadWeight) / 1000;
      const newRisk = Math.min(95, Math.max(5, aiRecommendation.recommended.calculatedRisk + loadDiff));
      setAiRecommendation({
        ...aiRecommendation,
        recommended: {
          ...aiRecommendation.recommended,
          simulatedRisk: Math.round(newRisk)
        }
      });
    }
  };

  const handleCreateTrip = async () => {
    if (!aiRecommendation) return;

    setSubmitting(true);
    try {
      const tripData = {
        route: formData.route,
        vehicle: aiRecommendation.recommended.id,
        driver: "DRV001", // Hardcoded for now as we don't have driver selection yet
        status: "in-progress",
        loadWeight: formData.loadWeight,
        startTime: new Date().toISOString(),
        expectedEnd: new Date(Date.now() + 86400000).toISOString(), // +1 day
        breakdownRisk: aiRecommendation.recommended.calculatedRisk,
        aiConfidence: aiRecommendation.recommended.confidence,
        predictedIssues: [],
        progress: 0
      };

      await axios.post('http://localhost:8000/api/trips/', tripData);

      toast({
        title: 'Trip Created',
        description: 'New trip has been successfully scheduled.'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating trip:", error);
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (risk < 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getImpactColor = (impact) => {
    if (impact === 'high') return 'text-red-600';
    if (impact === 'medium') return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Trip</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered vehicle allocation with risk prediction</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Enter trip parameters for AI analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select value={formData.route} onValueChange={handleRouteChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoutes.map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name} ({route.distance}km)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="Distance"
                disabled={formData.route}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Load Weight (kg)</Label>
                <span className="text-sm font-semibold text-blue-600">{formData.loadWeight}</span>
              </div>
              <Slider
                value={[formData.loadWeight]}
                onValueChange={(value) => setFormData({ ...formData, loadWeight: value[0] })}
                min={5000}
                max={25000}
                step={1000}
                className="py-4"
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Weight className="h-3 w-3" />
                <span>5,000 kg - 25,000 kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terrain">Terrain Type</Label>
              <Select value={formData.terrain} onValueChange={(value) => setFormData({ ...formData, terrain: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highway">Highway</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="mountain">Mountain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weather">Weather Conditions</Label>
              <Select value={formData.weather} onValueChange={(value) => setFormData({ ...formData, weather: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="fog">Fog</SelectItem>
                  <SelectItem value="storm">Storm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={calculateAIRecommendation}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              Get AI Recommendation
            </Button>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>AI Vehicle Recommendation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!aiRecommendation ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <Brain className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Recommendation Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Fill in the trip details and click "Get AI Recommendation" to receive optimal vehicle allocation
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recommended Vehicle */}
                <div className="p-6 border-2 border-blue-600 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-blue-600">Recommended</Badge>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{aiRecommendation.recommended.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{aiRecommendation.recommended.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getRiskColor(aiRecommendation.recommended.calculatedRisk)}`}>
                        {aiRecommendation.recommended.calculatedRisk}%
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Breakdown Risk</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{aiRecommendation.recommended.confidence}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">AI Confidence</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{aiRecommendation.recommended.healthScore}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Health Score</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-teal-600">{aiRecommendation.recommended.telemetryCompleteness}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Telemetry</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{aiRecommendation.recommended.totalTrips}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Trips</p>
                    </div>
                  </div>

                  {aiRecommendation.recommended.anomalies?.length > 0 && (
                    <div className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-400">Detected Anomalies</p>
                        <p className="text-xs text-orange-700 dark:text-orange-500">{aiRecommendation.recommended.anomalies.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explainability Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <span>Why This Vehicle?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiRecommendation.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{factor.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{factor.value}</p>
                          </div>
                          <Badge variant="outline" className={getImpactColor(factor.impact)}>
                            {factor.impact}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* What-If Simulation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span>What-If Simulation</span>
                    </CardTitle>
                    <CardDescription>Adjust load to see risk changes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Simulated Load Weight</Label>
                        <span className="text-sm font-semibold">{simulationLoad} kg</span>
                      </div>
                      <Slider
                        value={[simulationLoad]}
                        onValueChange={(value) => simulateRiskChange(value[0])}
                        min={5000}
                        max={25000}
                        step={1000}
                      />
                    </div>
                    {aiRecommendation.recommended.simulatedRisk && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Predicted Risk at {simulationLoad}kg:</span>
                          <Badge className={getRiskColor(aiRecommendation.recommended.simulatedRisk)}>
                            {aiRecommendation.recommended.simulatedRisk}%
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Alternative Vehicles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Alternative Vehicles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiRecommendation.alternatives.map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Truck className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{vehicle.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Health</p>
                              <p className="font-semibold">{vehicle.healthScore}%</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getRiskColor(vehicle.calculatedRisk)}>
                                {vehicle.calculatedRisk}% Risk
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVehicleSelect(vehicle)}
                                className="h-7 text-xs"
                              >
                                Select
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    onClick={handleCreateTrip}
                    disabled={submitting}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {submitting ? 'Creating Trip...' : 'Confirm & Create Trip'}
                  </Button>
                  <Button variant="outline" onClick={() => setAiRecommendation(null)} disabled={submitting}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTrip;