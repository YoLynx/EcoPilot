import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SetupHelper } from "@/components/setup-helper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  BarChart,
  MapPin,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Loader2,
  Calendar,
  User,
  Trash2,
  Info,
} from "lucide-react";
import { WasteReport } from "@/types/database";

type StatusType = "Pending" | "In Progress" | "Collected";

// Mock data for dashboard
const MOCK_USER = {
  id: "user-123",
  email: "johndoe@example.com"
};

const MOCK_REPORTS: WasteReport[] = [
  {
    id: "Empty Bottles",
    user_id: "user-123",
    type: "Recyclable",
    status: "Pending",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      formatted_address: "Juhu Chowpatty, Mumbai",
    },
    description: "Large pile of plastic bottles and containers",
    reported_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    collected_at: null,
    image_url: "plastic_bottles.jpg",
    urgent: false,
  },
  {
    id: "WR-1002",
    user_id: "user-123",
    type: "Biodegradable",
    status: "In Progress",
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      formatted_address: "Los Angeles, CA, USA",
    },
    description: "Food waste and garden trimmings",
    reported_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    collected_at: null,
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80&random=2",
    urgent: false,
  },
  {
    id: "WR-1003",
    user_id: "user-123",
    type: "Hazardous",
    status: "Pending",
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      formatted_address: "Chicago, IL, USA",
    },
    description: "Old paint cans and household chemicals",
    reported_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    collected_at: null,
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80&random=3",
    urgent: true,
  },
  {
    id: "WR-1004",
    user_id: "user-123",
    type: "E-Waste",
    status: "Collected",
    location: {
      latitude: 29.7604,
      longitude: -95.3698,
      formatted_address: "Houston, TX, USA",
    },
    description: "Broken electronics and old computer parts",
    reported_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    collected_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80&random=4",
    urgent: false,
  },
  {
    id: "WR-1005",
    user_id: "user-123",
    type: "Recyclable",
    status: "Collected",
    location: {
      latitude: 33.4484,
      longitude: -112.0740,
      formatted_address: "Phoenix, AZ, USA",
    },
    description: "Mixed waste including paper, plastic, and metal",
    reported_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    collected_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days ago
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80&random=5",
    urgent: false,
  }
];

// Helper functions for styling
const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "Recyclable":
      return "outline";
    case "Biodegradable":
      return "secondary";
    case "Hazardous":
      return "destructive";
    case "E-Waste":
      return "default";
    default:
      return "outline";
  }
};

const getStatusColor = (status: StatusType) => {
  switch (status) {
    case "Pending":
      return "bg-amber-500";
    case "In Progress":
      return "bg-blue-500";
    case "Collected":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status: StatusType) => {
  switch (status) {
    case "Pending":
      return <Clock className="h-3 w-3" />;
    case "In Progress":
      return <Truck className="h-3 w-3" />;
    case "Collected":
      return <CheckCircle2 className="h-3 w-3" />;
    default:
      return null;
  }
};

export default function DashboardPage() {
  // Use mock user instead of auth
  const user = MOCK_USER;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    collected: 0,
    percentChange: {
      total: 0,
      pending: 0,
      inProgress: 0,
      collected: 0,
    },
  });

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      if (user) {
        // Use mock data instead of fetching from supabase
        setReports(MOCK_REPORTS);
        
        // Calculate stats from the mock data
        const pending = MOCK_REPORTS.filter(r => r.status === "Pending").length;
        const inProgress = MOCK_REPORTS.filter(r => r.status === "In Progress").length;
        const collected = MOCK_REPORTS.filter(r => r.status === "Collected").length;
        
        setStats({
          total: MOCK_REPORTS.length,
          pending,
          inProgress,
          collected,
          percentChange: {
            total: 12,
            pending: -5,
            inProgress: 8,
            collected: 15,
          },
        });
      }
      setLoading(false);
    }, 1000); // 1 second delay to simulate loading
    
    return () => clearTimeout(timer);
  }, [user]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log("Search query updated:", e.target.value);
  };

  // Filter reports based on search query and filters
  const filteredReports = reports.filter((report) => {
    // Search filter
    const locationStr =
      typeof report.location === "string"
        ? report.location
        : report.location?.formatted_address || "";

    const matchesSearch =
      searchQuery === "" ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locationStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === "all" || report.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Waste Management Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage waste reports across the community
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <BarChart className="h-4 w-4" /> Analytics
              </Button>
              <Button className="gap-2 bg-nature-600 hover:bg-nature-700 transition-colors">
                <MapPin className="h-4 w-4" /> View Map
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.percentChange.total > 0 ? "+" : ""}
                  {stats.percentChange.total}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.percentChange.pending > 0 ? "+" : ""}
                  {stats.percentChange.pending}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.percentChange.inProgress > 0 ? "+" : ""}
                  {stats.percentChange.inProgress}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.collected}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.percentChange.collected > 0 ? "+" : ""}
                  {stats.percentChange.collected}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by ID, location, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-[180px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Collected">Collected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Recyclable">Recyclable</SelectItem>
                    <SelectItem value="Biodegradable">Biodegradable</SelectItem>
                    <SelectItem value="Hazardous">Hazardous</SelectItem>
                    <SelectItem value="E-Waste">E-Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading reports...</span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {reports.length === 0
                      ? "No waste reports found. Start by reporting waste!"
                      : "No waste reports match your filters"}
                  </p>
                  {reports.length === 0 && (
                    <Button className="mt-4" asChild>
                      <a href="/report">Report Waste</a>
                    </Button>
                  )}
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card
                    key={report.id}
                    className={report.urgent ? "border-red-500" : ""}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/4 h-48 md:h-auto relative">
                        <img
                          src={
                            report.image_url ||
                            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80"
                          }
                          alt={`Waste report ${report.id}`}
                          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                        />
                        {report.urgent && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Urgent
                          </div>
                        )}
                      </div>

                      <div className="p-6 md:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {report.id}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">
                                {typeof report.location === "string"
                                  ? report.location
                                  : report.location?.formatted_address ||
                                    "Unknown location"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getTypeBadgeVariant(report.type)}>
                              {report.type}
                            </Badge>
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`h-2 w-2 rounded-full ${getStatusColor(report.status as StatusType)}`}
                              />
                              <span className="text-sm font-medium flex items-center gap-1">
                                {getStatusIcon(report.status as StatusType)}
                                {report.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {report.description}
                        </p>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="text-sm text-muted-foreground">
                            Reported:{" "}
                            {new Date(report.reported_at).toLocaleString()}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                            >
                              View Details
                            </Button>
                            {report.status !== "Collected" && (
                              <Button size="sm">
                                {report.status === "Pending"
                                  ? "Start Collection"
                                  : "Mark as Collected"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Report Map</CardTitle>
                  <CardDescription>
                    View all waste reports on the map for better geographical
                    context
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden aspect-video relative flex items-center justify-center">
                    <img 
                      src="https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.006&zoom=12&size=800x400&markers=color:red|40.7128,-74.006|34.0522,-118.2437|41.8781,-87.6298|29.7604,-95.3698|33.4484,-112.0740&key=YOUR_API_KEY_HERE"
                      alt="Map with waste report locations"
                      className="w-full h-3/4 object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if Google Maps image fails to load
                        e.currentTarget.src = "waste_map.png";
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <SetupHelper />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Waste Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-3xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>Waste Report {selectedReport.id}</span>
                  {selectedReport.urgent && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Urgent
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Detailed information about this waste report
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-md overflow-hidden aspect-video mb-4">
                    <img
                      src={selectedReport.image_url || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80"}
                      alt={`Waste report ${selectedReport.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-sm text-muted-foreground">
                          {typeof selectedReport.location === "string"
                            ? selectedReport.location
                            : selectedReport.location?.formatted_address || "Unknown location"}
                        </p>
                        {selectedReport.location.latitude && selectedReport.location.longitude && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Coordinates: {selectedReport.location.latitude.toFixed(6)}, {selectedReport.location.longitude.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="flex items-center gap-2 font-medium">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedReport.status as StatusType)}`} />
                        {selectedReport.status}
                      </div>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground">Type</div>
                      <div className="flex items-center gap-2 font-medium">
                        <Badge className={getTypeBadgeVariant(selectedReport.type)}>
                          {selectedReport.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div className="border rounded-md p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Reported on</div>
                        <div className="text-sm font-medium">
                          {new Date(selectedReport.reported_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {selectedReport.collected_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="text-xs text-muted-foreground">Collected on</div>
                          <div className="text-sm font-medium">
                            {new Date(selectedReport.collected_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Reported by</div>
                        <div className="text-sm font-medium">
                          User ID: {selectedReport.user_id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between gap-4 sm:justify-between">
                <div>
                  {selectedReport.status !== "Collected" && (
                    <Button size="sm" variant="destructive" className="gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete Report
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  {selectedReport.status !== "Collected" && (
                    <Button>
                      {selectedReport.status === "Pending"
                        ? "Start Collection"
                        : "Mark as Collected"}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
