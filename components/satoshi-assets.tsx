"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import CountUp from "react-countup"

interface BTCPrice {
  usd: number
  usd_24h_change: number
}

interface SatoshiAssetsProps {
  satoshiBTC: number
  satoshiAddress: string
  cnyAmount?: number
  selectedYear?: number
  purchasePrice?: number
  currentValue?: number
}

export default function SatoshiAssets({
  satoshiBTC,
  satoshiAddress,
  cnyAmount = 5000,
  selectedYear = 2021,
  purchasePrice = 47886.69,
  currentValue = 0
}: SatoshiAssetsProps) {
  const [btcPrice, setBtcPrice] = useState<BTCPrice>({ usd: 100000, usd_24h_change: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
        )
        const data = await response.json()
        setBtcPrice({
          usd: data.bitcoin.usd,
          usd_24h_change: data.bitcoin.usd_24h_change,
        })
      } catch (error) {
        console.log("使用模拟价格数据")
      } finally {
        setLoading(false)
      }
    }

    fetchBTCPrice()
    const interval = setInterval(fetchBTCPrice, 30000) // 每30秒更新一次

    return () => clearInterval(interval)
  }, [])

  const totalValue = satoshiBTC * btcPrice.usd

  // 换算计算
  const dollarWeight = totalValue / 1000 // 假设1kg = $1000
  const dollarTrucks = Math.ceil(dollarWeight / 20000) // 假设每辆卡车可载20吨

  const goldWeight = totalValue / 60000 // 黄金价格约$60,000/kg

  // 黄金换算高速路面计算
  // 四车道高速路宽度约20米，路面高度2厘米
  // 黄金密度19.3g/cm³，每立方米黄金质量19,300kg
  // 每米高速路面需要的黄金体积 = 20m * 0.02m * 1m = 0.4立方米
  // 每米高速路面需要的黄金质量 = 0.4 * 19,300 = 7,720kg
  const goldPerMeter = 7720 // kg/米
  const highwayMeters = Math.floor(goldWeight / goldPerMeter)

  // 计算具体距离对比
  const distances = {
    beijingShanghai: 1464, // 北京到上海
    newYorkLA: 4500,     // 纽约到洛杉矶
    londonTokyo: 9600,   // 伦敦到东京
    earthCircumference: 40075, // 地球赤道周长
  }

  const getDistanceComparison = (meters: number) => {
    if (meters >= distances.earthCircumference) {
      const circles = Math.floor(meters / distances.earthCircumference)
      const remaining = meters % distances.earthCircumference
      return `绕地球${circles}圈还多${remaining.toLocaleString()}公里`
    } else if (meters >= distances.londonTokyo) {
      return `相当于伦敦到东京距离的${Math.floor(meters / distances.londonTokyo)}倍`
    } else if (meters >= distances.newYorkLA) {
      return `相当于纽约到洛杉矶距离的${Math.floor(meters / distances.newYorkLA)}倍`
    } else if (meters >= distances.beijingShanghai) {
      return `相当于北京到上海距离的${Math.floor(meters / distances.beijingShanghai)}倍`
    } else {
      return `相当于北京到上海距离的${(meters / distances.beijingShanghai).toFixed(1)}倍`
    }
  }

  const riceBowlPrice = 20 // 20元人民币一碗
  const riceBowls = Math.floor(totalValue * 6.5 / riceBowlPrice) // 汇率约6.5
  const globalPopulation = 8000000000 // 全球人口约80亿
  const eatingDays = Math.floor(riceBowls / globalPopulation) // 每天一碗

  // 新增有趣的换算
  const spacexLaunches = Math.floor(totalValue / 67000000) // SpaceX Starship发射成本约6700万美元
  const footballClubs = Math.floor(totalValue / 4000000000) // 顶级足球俱乐部市值约40亿美元
  const pinkDiamonds = Math.floor(totalValue / 100000000) // Pink Star钻石价值约1亿美元
  const concertTickets = Math.floor(totalValue / 200) // 演唱会门票平均200美元
  const stadiumsFilled = Math.floor(concertTickets / 50000) // 体育场容纳5万人
  const medicalAidPeople = Math.floor(totalValue / 100) // 基本医疗费用100美元/人
  const townsHelped = Math.floor(medicalAidPeople / 100000) // 小城镇人口10万人

  // 换算项目配置
  const conversionItems = [
    {
      id: 'dollar',
      icon: '💵',
      title: '换成美元',
      value: dollarWeight,
      unit: 'kg',
      description: `需要 ${dollarTrucks} 辆卡车运载`,
      note: '(假设1kg = $1,000，每辆卡车载20吨)',
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      textColor: 'text-green-600',
      textColorLight: 'text-green-700',
      textColorNote: 'text-green-500'
    },
    {
      id: 'gold',
      icon: '🏆',
      title: '换成黄金',
      value: goldWeight,
      unit: 'kg',
      description: '可铺设2cm厚四车道高速路面',
      value2: highwayMeters,
      unit2: '米',
      description2: getDistanceComparison(highwayMeters),
      note: '(四车道高速路宽20米，黄金密度19.3g/cm³)',
      gradient: 'from-yellow-50 to-amber-50',
      border: 'border-yellow-200',
      textColor: 'text-yellow-600',
      textColorLight: 'text-yellow-700',
      textColorNote: 'text-yellow-500'
    },
    {
      id: 'rice',
      icon: '🍜',
      title: '换成猪脚饭',
      value: riceBowls,
      unit: '碗',
      description: `足够全球人类吃 ${eatingDays} 天`,
      note: '(20元/碗，全球80亿人口，每天一碗)',
      gradient: 'from-orange-50 to-red-50',
      border: 'border-orange-200',
      textColor: 'text-orange-600',
      textColorLight: 'text-orange-700',
      textColorNote: 'text-orange-500'
    },
    {
      id: 'spacex',
      icon: '🚀',
      title: 'SpaceX 火箭',
      value: spacexLaunches,
      unit: '次',
      description: 'Starship 超级重型火箭',
      description2: '探索火星之旅',
      note: '(每次发射约6700万美元)',
      gradient: 'from-purple-50 to-indigo-50',
      border: 'border-purple-200',
      textColor: 'text-purple-600',
      textColorLight: 'text-purple-700',
      textColorNote: 'text-purple-500'
    },
    {
      id: 'football',
      icon: '⚽',
      title: '足球俱乐部',
      value: footballClubs,
      unit: '家',
      description: '顶级足球俱乐部',
      description2: '如曼联、巴萨、皇马等',
      note: '(顶级俱乐部市值约40亿美元)',
      gradient: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      textColor: 'text-blue-600',
      textColorLight: 'text-blue-700',
      textColorNote: 'text-blue-500'
    },
    {
      id: 'diamond',
      icon: '💎',
      title: '史上最贵钻石',
      value: pinkDiamonds,
      unit: '颗',
      description: '"Pink Star" 粉钻',
      description2: '世界上最贵的钻石',
      note: '(Pink Star价值约1亿美元)',
      gradient: 'from-pink-50 to-rose-50',
      border: 'border-pink-200',
      textColor: 'text-pink-600',
      textColorLight: 'text-pink-700',
      textColorNote: 'text-pink-500'
    },
    {
      id: 'concert',
      icon: '🎤',
      title: '演唱会门票',
      value: concertTickets,
      unit: '张',
      description: '全球顶级演唱会',
      description2: `相当于 ${stadiumsFilled} 个体育场`,
      note: '(平均票价$200，体育场容纳5万人)',
      gradient: 'from-red-50 to-pink-50',
      border: 'border-red-200',
      textColor: 'text-red-600',
      textColorLight: 'text-red-700',
      textColorNote: 'text-red-500'
    },
    {
      id: 'charity',
      icon: '❤️',
      title: '慈善医疗',
      value: medicalAidPeople,
      unit: '人',
      description: '获得基本医疗服务',
      description2: `相当于 ${townsHelped} 个小城镇`,
      note: '($100/人医疗费用，小城镇10万人)',
      gradient: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-600',
      textColorLight: 'text-emerald-700',
      textColorNote: 'text-emerald-500'
    }
  ]

  if (loading) {
    return (
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
            <span className="animate-pulse">加载中...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-primary/10">
            <div className="h-6 bg-muted rounded animate-pulse mb-6 mx-auto w-32"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="p-4 rounded-lg border border-muted">
                  <div className="text-center">
                    <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="w-8 h-8 text-primary" />
          资产估算
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              ¥{cnyAmount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">{selectedYear}年投入金额</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">
              $<CountUp end={purchasePrice} duration={2} separator="," decimals={0} />
            </div>
            <div className="text-xs text-muted-foreground">{selectedYear}年BTC价格</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              <CountUp end={satoshiBTC} duration={2.5} separator="," decimals={4} />
              <span className="ml-1 text-sm">BTC</span>
            </div>
            <div className="text-xs text-muted-foreground">获得的BTC数量</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              $<CountUp end={currentValue} duration={3} separator="," decimals={0} />
            </div>
            <div className="text-xs text-muted-foreground">当前价值美元</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${
              (currentValue - (cnyAmount / 6.5)) >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              ${Number((currentValue - (cnyAmount / 6.5)).toFixed(0)).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">错失资产</div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
