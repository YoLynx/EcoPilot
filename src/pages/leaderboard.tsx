import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Gift,
  ArrowRight,
  Star,
  Award,
  Loader2,
} from "lucide-react";
import { UserProfile, UserBadge, Reward } from "@/types/database";

// Mock data for the logged-in user
const MOCK_USER = {
  id: "user-123",
  email: "johndoe@example.com",
};

// Mock data for user profiles (leaderboard)
const MOCK_USERS: UserProfile[] = [
  {
    id: "user-101",
    name: "Kartikay Pandey",
    avatar_url: "ktk.jpeg",
    points: 1250,
    reports: 42,
    recycling: 85,
    level: 5,
    next_level_points: 1500,
    rank: 1
  },
  {
    id: "user-102",
    name: "Advait Desai",
    avatar_url: "advait.jpeg",
    points: 980,
    reports: 35,
    recycling: 72,
    level: 4,
    next_level_points: 1200,
    rank: 2
  },
  {
    id: "user-103",
    name: "Abhay Upadhyay",
    avatar_url: "abhay.jpeg",
    points: 875,
    reports: 29,
    recycling: 65,
    level: 4,
    next_level_points: 1200,
    rank: 3
  },
  {
    id: "user-104",
    name: "Oliver Kumar",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-104",
    points: 720,
    reports: 25,
    recycling: 60,
    level: 3,
    next_level_points: 800,
    rank: 4
  },
  {
    id: "user-105",
    name: "Amelia Johnson",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-105",
    points: 680,
    reports: 23,
    recycling: 55,
    level: 3,
    next_level_points: 800,
    rank: 5
  },
  {
    id: "user-123", // Current user
    name: "Tanish Bhamare",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-123",
    points: 580,
    reports: 18,
    recycling: 70,
    level: 3,
    next_level_points: 800,
    rank: 6
  },
  {
    id: "user-106",
    name: "Liam Patel",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-106",
    points: 520,
    reports: 16,
    recycling: 48,
    level: 2,
    next_level_points: 600,
    rank: 7
  },
  {
    id: "user-107",
    name: "Harper Lee",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-107",
    points: 480,
    reports: 14,
    recycling: 45,
    level: 2,
    next_level_points: 600,
    rank: 8
  },
  {
    id: "user-108",
    name: "Ethan Wright",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-108",
    points: 410,
    reports: 12,
    recycling: 40,
    level: 2,
    next_level_points: 600,
    rank: 9
  },
  {
    id: "user-109",
    name: "Mia Garcia",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-109",
    points: 380,
    reports: 10,
    recycling: 35,
    level: 2,
    next_level_points: 600,
    rank: 10
  }
];

// Mock rewards data
const MOCK_REWARDS: Reward[] = [
  {
    id: "reward-001",
    name: "10% Discount Coupon",
    description: "Get 10% off on eco-friendly products at participating stores",
    points: 200,
    image_url: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=300&q=80"
  },
  {
    id: "reward-002",
    name: "Plant a Tree",
    description: "We'll plant a tree in your name in areas that need reforestation",
    points: 500,
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80"
  },
  {
    id: "reward-003",
    name: "Eco-friendly Kit",
    description: "Receive a kit with reusable items to reduce your environmental footprint",
    points: 750,
    image_url: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&q=80"
  },
  {
    id: "reward-004",
    name: "Community Event Ticket",
    description: "Free entry to our next community cleanup or environmental workshop",
    points: 300,
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80"
  },
  {
    id: "reward-005",
    name: "Reusable Water Bottle",
    description: "High-quality stainless steel water bottle to reduce plastic waste",
    points: 350,
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80"
  }
];

// Mock user badges
const MOCK_USER_BADGES: Record<string, string[]> = {
  "user-101": ["Sustainability Hero", "Master Recycler", "Community Champion"],
  "user-102": ["Waste Warrior", "Eco Influencer"],
  "user-103": ["Clean Streets Advocate", "Green Initiative Leader"],
  "user-104": ["Recycling Expert"],
  "user-105": ["Environmental Advocate"],
  "user-123": ["First Report", "Recycling Champion"], // Current user
  "user-106": ["Newcomer Award"],
  "user-107": ["Green Thumbs Up"],
  "user-108": ["Waste Reducer"],
  "user-109": ["Clean Community Contributor"]
};

export default function LeaderboardPage() {
  const user = MOCK_USER; // Use mock user instead of auth
  const [timeframe, setTimeframe] = useState<string>("all-time");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [userBadges, setUserBadges] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      // Set mock data based on timeframe
      if (timeframe === "weekly") {
        // Sort differently for weekly view (just for demo)
        setUsers([...MOCK_USERS].sort((a, b) => b.reports - a.reports));
      } else if (timeframe === "monthly") {
        // Sort differently for monthly view (just for demo)
        setUsers([...MOCK_USERS].sort((a, b) => b.recycling - a.recycling));
      } else {
        // Default "all-time" sorting by points
        setUsers(MOCK_USERS);
      }
      
      // Find current user profile
      const currentProfile = MOCK_USERS.find(profile => profile.id === user.id) || null;
      setCurrentUserProfile(currentProfile);
      
      // Set rewards and badges
      setRewards(MOCK_REWARDS);
      setUserBadges(MOCK_USER_BADGES);
      
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeframe, user.id]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Community Leaderboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recognize top contributors who are making our community cleaner
              and more sustainable through active participation.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading leaderboard data...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No leaderboard data available yet.
              </p>
              <Button className="mt-4" asChild>
                <a href="/report">Start Contributing</a>
              </Button>
            </div>
          ) : (
            /* Top 3 Users */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Second Place */}
              {users.length > 1 && (
                <div className="order-2 md:order-1">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-silver">
                        <AvatarImage
                          src={
                            users[1].avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${users[1].id}`
                          }
                          alt={users[1].name || "User"}
                        />
                        <AvatarFallback>
                          {(users[1].name || "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-silver text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                        2
                      </div>
                    </div>
                    <h3 className="mt-6 font-semibold text-lg">
                      {users[1].name || "User"}
                    </h3>
                    <p className="text-muted-foreground">
                      {users[1].points} points
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <Medal className="h-4 w-4 text-silver" />
                      <span className="text-sm font-medium">Silver</span>
                    </div>
                  </div>
                </div>
              )}

              {/* First Place */}
              {users.length > 0 && (
                <div className="order-1 md:order-2">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-amber-400">
                        <AvatarImage
                          src={
                            users[0].avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${users[0].id}`
                          }
                          alt={users[0].name || "User"}
                        />
                        <AvatarFallback>
                          {(users[0].name || "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                        1
                      </div>
                    </div>
                    <h3 className="mt-6 font-semibold text-xl">
                      {users[0].name || "User"}
                    </h3>
                    <p className="text-muted-foreground">
                      {users[0].points} points
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-medium">Gold</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {users.length > 2 && (
                <div className="order-3">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-amber-700">
                        <AvatarImage
                          src={
                            users[2].avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${users[2].id}`
                          }
                          alt={users[2].name || "User"}
                        />
                        <AvatarFallback>
                          {(users[2].name || "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                        3
                      </div>
                    </div>
                    <h3 className="mt-6 font-semibold text-lg">
                      {users[2].name || "User"}
                    </h3>
                    <p className="text-muted-foreground">
                      {users[2].points} points
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <Medal className="h-4 w-4 text-amber-700" />
                      <span className="text-sm font-medium">Bronze</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Leaderboard Rankings */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Leaderboard Rankings</CardTitle>
                    <Tabs
                      value={timeframe}
                      onValueChange={setTimeframe}
                      className="w-[400px]"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="all-time">All Time</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardDescription>
                    Users ranked by points earned from waste reporting and
                    recycling activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No users found.</p>
                      </div>
                    ) : (
                      users.map((userProfile, index) => (
                        <div
                          key={userProfile.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${index < 3 ? "bg-muted" : ""} ${userProfile.id === user?.id ? "border border-primary" : ""}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-6 text-center font-medium">
                              {index + 1}
                            </div>
                            <Avatar>
                              <AvatarImage
                                src={
                                  userProfile.avatar_url ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.id}`
                                }
                                alt={userProfile.name || "User"}
                              />
                              <AvatarFallback>
                                {(userProfile.name || "U").charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {userProfile.name || "User"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Level {userProfile.level}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="font-medium">
                                {userProfile.points}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Points
                              </div>
                            </div>

                            <div className="text-right hidden md:block">
                              <div className="font-medium">
                                {userProfile.reports}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Reports
                              </div>
                            </div>

                            <div className="text-right hidden md:block">
                              <div className="font-medium">
                                {userProfile.recycling}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Recycling
                              </div>
                            </div>

                            {userBadges[userProfile.id]?.length > 0 && (
                              <div className="hidden lg:flex gap-1">
                                {userBadges[userProfile.id].map((badge, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <Star className="h-3 w-3" />
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Profile & Rewards */}
            <div className="space-y-8">
              {/* Your Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Your current stats and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : !user ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Sign in to view your profile
                      </p>
                      <Button asChild>
                        <a href="/login">Sign In</a>
                      </Button>
                    </div>
                  ) : !currentUserProfile ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        No profile data found. Start contributing to create your
                        profile!
                      </p>
                      <Button asChild>
                        <a href="/report">Report Waste</a>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={
                              currentUserProfile.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserProfile.id}`
                            }
                            alt={currentUserProfile.name || "User"}
                          />
                          <AvatarFallback>
                            {(currentUserProfile.name || "U").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {currentUserProfile.name || "You"}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>Rank #{currentUserProfile.rank || "--"}</span>
                            <span>•</span>
                            <span>Level {currentUserProfile.level}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            Progress to Level {currentUserProfile.level + 1}
                          </span>
                          <span>
                            {currentUserProfile.points} /{" "}
                            {currentUserProfile.next_level_points}
                          </span>
                        </div>
                        <Progress
                          value={
                            (currentUserProfile.points /
                              currentUserProfile.next_level_points) *
                            100
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-2xl font-bold">
                            {currentUserProfile.points}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Points
                          </div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-2xl font-bold">
                            {currentUserProfile.reports}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Reports
                          </div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-2xl font-bold">
                            {currentUserProfile.recycling}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Recycling
                          </div>
                        </div>
                      </div>

                      {userBadges[currentUserProfile.id]?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Your Badges</h4>
                          <div className="flex flex-wrap gap-2">
                            {userBadges[currentUserProfile.id].map(
                              (badge, i) => (
                                <Badge
                                  key={i}
                                  className="flex items-center gap-1"
                                >
                                  <Award className="h-3 w-3" />
                                  {badge}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                  <CardDescription>
                    Redeem your points for eco-friendly rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : rewards.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        No rewards available at the moment.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rewards.slice(0, 3).map((reward) => (
                        <div
                          key={reward.id}
                          className="flex gap-4 items-center"
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={reward.image_url}
                              alt={reward.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">
                              {reward.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {reward.description}
                            </p>
                            <div className="mt-1 flex items-center gap-1 text-xs">
                              <Gift className="h-3 w-3" />
                              <span>{reward.points} points</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={
                              currentUserProfile &&
                              currentUserProfile.points >= reward.points
                                ? "default"
                                : "outline"
                            }
                            disabled={
                              !currentUserProfile ||
                              currentUserProfile.points < reward.points
                            }
                          >
                            Redeem
                          </Button>
                        </div>
                      ))}

                      {rewards.length > 3 && (
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          asChild
                        >
                          <a href="/rewards">
                            View All Rewards{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
