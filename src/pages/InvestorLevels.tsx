import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { BadgeLevel } from "@/components/ui/badge-level";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Clock, Diamond, Gem, Headphones, Medal, Star, Crown, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { USER_LEVEL_THRESHOLDS, formatUserLevel } from "@/utils/userLevelUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { InvestorKey } from "@/utils/translations/investor";
import { useInvestorTranslation } from "@/hooks/useInvestorTranslation";
const InvestorLevels = () => {
  const {
    t
  } = useLanguage();
  const tInvestor = useInvestorTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Definizione dei livelli con icone associate
  const levels = [{
    id: 'starter',
    name: tInvestor('starter'),
    icon: Medal,
    color: "bg-gradient-to-r from-[#D3D3D3] to-[#A9A9A9]",
    textColor: "text-black",
    threshold: USER_LEVEL_THRESHOLDS.starter,
    events: 1,
    earlyAccess: "Base",
    support: "Standard",
    description: tInvestor('starterLevelDesc') || "Begin your investment journey with access to our basic platform features."
  }, {
    id: 'bronze',
    name: tInvestor('bronze'),
    icon: Medal,
    color: "bg-gradient-to-r from-[#CD7F32] to-[#B87333]",
    textColor: "text-white",
    threshold: USER_LEVEL_THRESHOLDS.bronze,
    events: 2,
    earlyAccess: "Limited",
    support: "Priority",
    description: tInvestor('bronzeLevelDesc') || "Unlock your first tier of premium features with access to more exclusive events."
  }, {
    id: 'silver',
    name: tInvestor('silver'),
    icon: Award,
    color: "bg-gradient-to-r from-[#C0C0C0] to-[#A8A9AD]",
    textColor: "text-white",
    threshold: USER_LEVEL_THRESHOLDS.silver,
    events: 4,
    earlyAccess: "Early",
    support: "Priority",
    description: tInvestor('silverLevelDesc') || "Gain enhanced visibility and access to more premium investment opportunities."
  }, {
    id: 'gold',
    name: tInvestor('gold'),
    icon: Crown,
    color: "bg-gradient-to-r from-[#FFD700] to-[#FFC300]",
    textColor: "text-black",
    threshold: USER_LEVEL_THRESHOLDS.gold,
    events: 8,
    earlyAccess: "Advanced",
    support: "Priority Plus",
    description: tInvestor('goldLevelDesc') || "Join our gold tier for premium benefits and early access to high-yield investments."
  }, {
    id: 'ruby',
    name: tInvestor('ruby'),
    icon: Gem,
    color: "bg-gradient-to-r from-[#9B111E] to-[#C41E3A]",
    textColor: "text-white",
    threshold: USER_LEVEL_THRESHOLDS.ruby,
    events: 12,
    earlyAccess: "Premium",
    support: "Dedicated Line",
    description: tInvestor('rubyLevelDesc') || "Experience exclusive investment opportunities with personalized guidance."
  }, {
    id: 'emerald',
    name: tInvestor('emerald'),
    icon: Gem,
    color: "bg-gradient-to-r from-[#50C878] to-[#2E8B57]",
    textColor: "text-white",
    threshold: USER_LEVEL_THRESHOLDS.emerald,
    events: 16,
    earlyAccess: "VIP",
    support: "Direct Consultant",
    description: tInvestor('emeraldLevelDesc') || "Enjoy significant privileges with our emerald tier including direct consultant support."
  }, {
    id: 'platinum',
    name: tInvestor('platinum'),
    icon: Star,
    color: "bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC]",
    textColor: "text-black",
    threshold: USER_LEVEL_THRESHOLDS.platinum,
    events: "Unlimited",
    earlyAccess: "Exclusive",
    support: "Personal Manager",
    description: tInvestor('platinumLevelDesc') || "Access our platinum benefits including a personal investment manager."
  }, {
    id: 'diamond',
    name: tInvestor('diamond'),
    icon: Diamond,
    color: "bg-gradient-to-r from-[#B9F2FF] to-[#E0FFFF]",
    textColor: "text-black",
    threshold: USER_LEVEL_THRESHOLDS.diamond,
    events: "All Access",
    earlyAccess: "First Look",
    support: "Director Access",
    description: tInvestor('diamondLevelDesc') || "Enjoy our pinnacle tier with unparalleled access and investment opportunities."
  }];

  // Funzione per formattare la soglia di investimento
  const formatThreshold = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    } else {
      return `€${amount}`;
    }
  };

  // Varianti per le animazioni
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  const benefitVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <DashboardLayout title={tInvestor('investorLevels')} subtitle={tInvestor('investorLevelsSubtitle') || "Discover the benefits of each investment tier"}>
      <div className="container mx-auto py-0 px-0">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-50 to-white">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-3xl font-bold tracking-tight mb-2">{tInvestor('investorLevelsTitle') || "Investor Levels Program"}</CardTitle>
            <CardDescription className="text-lg max-w-3xl mx-auto">
              {tInvestor('investorLevelsDescription') || "Our exclusive program rewards investors with enhanced benefits and opportunities as they increase their investment portfolio with us."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Level Tabs */}
            <Tabs defaultValue="overview" className="w-full" onValueChange={value => setSelectedLevel(value !== "overview" ? value : null)}>
              <div className="flex justify-center mb-8">
                <TabsList className="bg-gray-100 p-1">
                  <TabsTrigger value="overview" className="px-4 py-2">
                    {tInvestor('overview')}
                  </TabsTrigger>
                  {levels.map(level => <TabsTrigger key={level.id} value={level.id} className="px-4 py-2">
                      {level.name}
                    </TabsTrigger>)}
                </TabsList>
              </div>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" variants={containerVariants} initial="hidden" animate="visible">
                  {levels.map(level => <motion.div key={level.id} variants={itemVariants}>
                      <Card className={`group h-full border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${level.id === "diamond" ? "border-blue-300 ring-2 ring-blue-200" : ""}`}>
                        <CardHeader className={`${level.color} ${level.textColor} pb-4`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <level.icon size={18} className="mr-1" />
                              <h3 className="text-xl font-bold">{level.name}</h3>
                            </div>
                            <Badge variant="outline" className="bg-white/20 backdrop-blur-sm">
                              {formatThreshold(level.threshold)}+
                            </Badge>
                          </div>
                          
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 text-sm py-0 my-[10px]">
                            <li className="flex gap-2 items-center">
                              <Calendar size={16} className="text-easyroi-gold" />
                              <span>
                                <strong>{tInvestor('events')}:</strong> {level.events}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                              <Rocket size={16} className="text-easyroi-gold" />
                              <span>
                                <strong>{tInvestor('earlyAccess')}:</strong> {level.earlyAccess}
                              </span>
                            </li>
                            <li className="flex gap-2 items-center">
                              <Headphones size={16} className="text-easyroi-gold" />
                              <span>
                                <strong>{tInvestor('support')}:</strong> {level.support}
                              </span>
                            </li>
                          </ul>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                            <Button variant="ghost" className={`w-full ${level.color} ${level.textColor} hover:opacity-90`} onClick={() => setSelectedLevel(level.id)}>
                              {tInvestor('seeDetails')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>)}
                </motion.div>
                
                <div className="bg-gray-50 rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">{tInvestor('levelBenefitsComparison') || "Benefits Comparison"}</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tInvestor('level')}
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tInvestor('investmentRequired')}
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tInvestor('events')}
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tInvestor('earlyAccess')}
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tInvestor('support')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {levels.map((level, idx) => <tr key={level.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <BadgeLevel level={level.id as any} />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatThreshold(level.threshold)}+
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {level.events}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {level.earlyAccess}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {level.support}
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{tInvestor('readyToProgress') || "Ready to progress to the next level?"}</h3>
                  <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
                    {tInvestor('progressNextLevelDescription') || "Increase your investment portfolio to unlock exclusive benefits and premium opportunities."}
                  </p>
                  <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 px-8">
                    {tInvestor('contactAdvisor')}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Individual Level Tabs */}
              {levels.map(level => <TabsContent key={level.id} value={level.id}>
                  <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                duration: 0.5
              }} className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      {/* Level Info Card */}
                      <div className="w-full md:w-1/3">
                        <Card className={`${level.color} ${level.textColor} overflow-hidden`}>
                          <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-2">
                              <level.icon size={48} />
                            </div>
                            <CardTitle className="text-3xl font-bold">
                              {level.name} {tInvestor('investor')}
                            </CardTitle>
                            <CardDescription className={`${level.textColor} opacity-85 font-medium`}>
                              {tInvestor('investmentFrom')} {formatThreshold(level.threshold)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="bg-white/20 backdrop-blur-sm p-6 text-center">
                            <p className="mb-4">{level.description}</p>
                            <Button className="bg-white text-gray-800 hover:bg-gray-100">
                              {tInvestor('upgradeNow')}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Benefits Details */}
                      <div className="w-full md:w-2/3">
                        <h2 className="text-2xl font-bold mb-6">
                          {level.name} {tInvestor('levelBenefits')}
                        </h2>
                        
                        <div className="space-y-8">
                          <motion.div variants={benefitVariants} initial="hidden" animate="visible">
                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-6 w-6 text-easyroi-gold" />
                                  <CardTitle className="text-xl">{tInvestor('exclusiveEvents')}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4">
                                  {tInvestor('exclusiveEventsDescription') || "Access to invitation-only networking events, property previews, and investment seminars."}
                                </p>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <span className="font-semibold">{level.name} {tInvestor('level')}: </span>
                                  <span>{level.events} {tInvestor('eventsPerYear')}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                          
                          <motion.div variants={benefitVariants} initial="hidden" animate="visible">
                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                  <Rocket className="h-6 w-6 text-easyroi-gold" />
                                  <CardTitle className="text-xl">{tInvestor('earlyAccess')}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4">
                                  {tInvestor('earlyAccessDescription') || "Priority access to new development projects and investment opportunities before they are publicly available."}
                                </p>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <span className="font-semibold">{level.name} {tInvestor('level')}: </span>
                                  <span>{level.earlyAccess} {tInvestor('access')}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                          
                          <motion.div variants={benefitVariants} initial="hidden" animate="visible">
                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                  <Headphones className="h-6 w-6 text-easyroi-gold" />
                                  <CardTitle className="text-xl">{tInvestor('prioritySupport')}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4">
                                  {tInvestor('prioritySupportDescription') || "Dedicated support team to assist with all your investment needs and inquiries."}
                                </p>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <span className="font-semibold">{level.name} {tInvestor('level')}: </span>
                                  <span>{level.support}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                        
                        <div className="mt-8 text-center">
                          <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90">
                            {tInvestor('exploreAllLevels')}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonials for higher levels */}
                    {['gold', 'ruby', 'emerald', 'platinum', 'diamond'].includes(level.id) && <div className="mt-16">
                        <Separator className="mb-8" />
                        <h3 className="text-2xl font-bold text-center mb-8">
                          {tInvestor('whatInvestorsSay') || "What our investors say"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="bg-gray-50">
                            <CardContent className="pt-6">
                              <p className="italic text-gray-600 mb-4">
                                "The exclusive events have been invaluable for networking and finding new investment opportunities. The early access to projects has given me a significant advantage."
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-easyroi-navy flex items-center justify-center text-white font-bold">
                                  {level.id.charAt(0).toUpperCase()}A
                                </div>
                                <div>
                                  <p className="font-medium">Alessandro P.</p>
                                  <p className="text-sm text-gray-500">{level.name} {tInvestor('investor')} {tInvestor('since')} 2022</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-gray-50">
                            <CardContent className="pt-6">
                              <p className="italic text-gray-600 mb-4">
                                "The dedicated support team has made managing my investments effortless. I appreciate the personalized attention and exclusive opportunities this level provides."
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-easyroi-gold flex items-center justify-center text-white font-bold">
                                  {level.id.charAt(0).toUpperCase()}M
                                </div>
                                <div>
                                  <p className="font-medium">Maria L.</p>
                                  <p className="text-sm text-gray-500">{level.name} {tInvestor('investor')} {tInvestor('since')} 2021</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>}
                  </motion.div>
                </TabsContent>)}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
};
export default InvestorLevels;