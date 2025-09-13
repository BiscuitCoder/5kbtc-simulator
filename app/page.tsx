"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Copy, Coins, Bitcoin } from "lucide-react"
import SatoshiAssets from "@/components/satoshi-assets"
import CountUp from "react-countup"

interface BTCPrice {
  usd: number
  usd_24h_change: number
}

interface ComparisonItem {
  name: string
  price: number
  image: string
  unit: string
  dynasty?: string
  years?: number
}

export default function SatoshiSimulator() {
  const [btcPrice, setBtcPrice] = useState<BTCPrice>({ usd: 100000, usd_24h_change: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // 中本聪估计持有的BTC数量（约100万枚）
  const satoshiBTC = 1100000
  const satoshiAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"

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

  // 宇宙-地球-人类宏大时间轴配置
  const historicalTimeline = [
    // 宇宙时期
    { name: "宇宙大爆炸", startYear: -13800000000, endYear: -13700000000, description: "宇宙诞生的那一刻，万物起源" },
    { name: "原初核合成", startYear: -13700000000, endYear: -10000000000, description: "氢和氦等元素的形成期" },
    { name: "第一代恒星", startYear: -10000000000, endYear: -5000000000, description: "宇宙中最早的恒星诞生" },
    { name: "银河系形成", startYear: -5000000000, endYear: -4600000000, description: "我们所在的星系诞生时期" },

    // 太阳系形成
    { name: "太阳系诞生", startYear: -4600000000, endYear: -4500000000, description: "太阳和行星系统的形成" },
    { name: "地球形成", startYear: -4500000000, endYear: -4400000000, description: "蓝色星球的诞生" },

    // 地球早期历史
    { name: "冥古宙", startYear: -4500000000, endYear: -2500000000, description: "地球最古老的地质时期" },
    { name: "太古宙", startYear: -2500000000, endYear: -541000000, description: "大陆板块开始形成" },
    { name: "元古宙", startYear: -541000000, endYear: -250000000, description: "复杂生命出现前的地质时期" },

    // 生命起源
    { name: "古生宙早期", startYear: -541000000, endYear: -443000000, description: "海洋生命开始出现" },
    { name: "寒武纪大爆发", startYear: -540000000, endYear: -485000000, description: "生命多样性爆炸式增长" },
    { name: "志留纪", startYear: -443000000, endYear: -419000000, description: "鱼类和植物登上陆地" },
    { name: "泥盆纪", startYear: -419000000, endYear: -358000000, description: "森林和昆虫的时代" },

    // 石炭纪和二叠纪
    { name: "石炭纪", startYear: -358000000, endYear: -298000000, description: "巨大昆虫和早期爬行动物" },
    { name: "二叠纪", startYear: -298000000, endYear: -251000000, description: "盘古大陆形成，爬行动物兴盛" },

    // 中生代 - 恐龙时代
    { name: "三叠纪", startYear: -251000000, endYear: -201000000, description: "恐龙的诞生与早期进化" },
    { name: "侏罗纪", startYear: -201000000, endYear: -145000000, description: "恐龙的黄金时代" },
    { name: "白垩纪", startYear: -145000000, endYear: -66000000, description: "恐龙最后的辉煌" },

    // 白垩纪末期大灭绝
    { name: "白垩纪末大灭绝", startYear: -66000000, endYear: -65000000, description: "恐龙灭绝，哺乳动物崛起" },

    // 新生代 - 哺乳动物时代
    { name: "古近纪", startYear: -66000000, endYear: -23000000, description: "早期哺乳动物和灵长类进化" },
    { name: "新近纪", startYear: -23000000, endYear: -2580000, description: "猿类和人类祖先的进化" },

    // 人类进化
    { name: "更新世早期", startYear: -2580000, endYear: -780000, description: "早期人类和直立人出现" },
    { name: "更新世中期", startYear: -780000, endYear: -126000, description: "尼安德特人和智人的祖先" },
    { name: "智人时代", startYear: -300000, endYear: -10000, description: "现代人类的进化与迁徙" },

    // 人类文明史
    { name: "新石器革命", startYear: -10000, endYear: -3000, description: "农业发明，定居生活开始" },
    { name: "苏美尔文明", startYear: -3500, endYear: -2000, description: "世界上最早的文字和城市" },
    { name: "古埃及文明", startYear: -3100, endYear: -30, description: "金字塔与法老的时代" },
    { name: "印度河谷文明", startYear: -3300, endYear: -1300, description: "早期城市规划的典范" },
    { name: "华夏文明起源", startYear: -2070, endYear: -1600, description: "夏朝，中国最早的王朝" },

    // 青铜时代
    { name: "青铜时代", startYear: -3300, endYear: -1200, description: "金属工具和武器的时代" },
    { name: "迈锡尼文明", startYear: -1600, endYear: -1100, description: "特洛伊战争的时代背景" },
    { name: "古希腊城邦", startYear: -800, endYear: -146, description: "民主与哲学的诞生地" },
    { name: "古罗马共和国", startYear: -509, endYear: -27, description: "共和制与扩张的时代" },
    { name: "古罗马帝国", startYear: -27, endYear: 476, description: "帝国与法律的巅峰" },

    // 中世纪
    { name: "拜占庭帝国", startYear: 330, endYear: 1453, description: "千年帝国，东西方桥梁" },
    { name: "阿拉伯帝国", startYear: 632, endYear: 1258, description: "伊斯兰黄金时代的辉煌" },
    { name: "中世纪欧洲", startYear: 476, endYear: 1453, description: "骑士、城堡与十字军东征" },
    { name: "宋朝", startYear: 960, endYear: 1279, description: "中国古代科技与文化的巅峰" },
    { name: "蒙古帝国", startYear: 1206, endYear: 1368, description: "人类历史上最大的陆上帝国" },

    // 文艺复兴与大航海
    { name: "文艺复兴", startYear: 1300, endYear: 1600, description: "艺术、科学与人文主义的复兴" },
    { name: "大航海时代", startYear: 1400, endYear: 1700, description: "地理大发现与殖民扩张" },
    { name: "启蒙运动", startYear: 1685, endYear: 1815, description: "理性与科学思想的觉醒" },
    { name: "工业革命", startYear: 1760, endYear: 1840, description: "蒸汽机与机械化生产的革命" },
    { name: "法国大革命", startYear: 1789, endYear: 1799, description: "自由、平等、博爱的时代转折" },

    // 现代历史
    { name: "维多利亚时代", startYear: 1837, endYear: 1901, description: "大英帝国的黄金时代" },
    { name: "第一次世界大战", startYear: 1914, endYear: 1918, description: "改变世界的毁灭性战争" },
    { name: "大萧条时期", startYear: 1929, endYear: 1939, description: "全球经济危机与社会动荡" },
    { name: "第二次世界大战", startYear: 1939, endYear: 1945, description: "人类历史上最惨烈的战争" },
    { name: "冷战时期", startYear: 1947, endYear: 1991, description: "美苏两大阵营的对峙" },
    { name: "太空竞赛", startYear: 1957, endYear: 1975, description: "人类探索太空的时代" },

    // 现代科技时代
    { name: "数字革命", startYear: 1970, endYear: 2000, description: "计算机与互联网的诞生" },
    { name: "生物科技时代", startYear: 1990, endYear: 2020, description: "基因工程与生命科学的突破" },
    { name: "移动互联网时代", startYear: 2007, endYear: 2020, description: "智能手机与社交网络" },
    { name: "人工智能革命", startYear: 2010, endYear: 2040, description: "机器学习与智能系统的时代" },
    { name: "量子计算时代", startYear: 2020, endYear: 2050, description: "量子科技与未来计算" },

    // 未来展望
    { name: "太空移民时代", startYear: 2030, endYear: 2100, description: "人类迈向星际文明的征程" },
    { name: "后人类时代", startYear: 2100, endYear: 2200, description: "人类与AI共存的未来" },
  ]

  // 根据总年限计算对应的历史时期
  const getHistoricalPeriod = (totalYears: number) => {
    const startYear = getCurrentYear() - totalYears

    // 如果开始年份太久远，返回最早的时期
    if (startYear < historicalTimeline[0].startYear) {
      return {
        ...historicalTimeline[0],
        actualStartYear: startYear
      }
    }

    // 找到对应的历史时期
    for (const period of historicalTimeline) {
      if (startYear >= period.startYear && startYear <= period.endYear) {
        return {
          ...period,
          actualStartYear: startYear
        }
      }
    }

    // 如果没找到匹配的，返回最后一个时期
    return {
      ...historicalTimeline[historicalTimeline.length - 1],
      actualStartYear: startYear
    }
  }

  const comparisonItems: ComparisonItem[] = [
    {
      name: "iPhone 15 Pro Max",
      price: 1199,
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop&crop=center",
      unit: "台",
      years: 275,
    },
    {
      name: "MacBook Pro",
      price: 2499,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center",
      unit: "台",
      years: 370,
    },
    {
      name: "特斯拉Model S",
      price: 89990,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=200&fit=crop&crop=center",
      unit: "辆",
      years: 395,
    },
    {
      name: "北京四合院",
      price: 50000000,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop&crop=center",
      unit: "套",
      years: 1400,
    },
    {
      name: "黄金（1盎司）",
      price: 2000,
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&h=200&fit=crop&crop=center",
      unit: "盎司",
      years: 340,
    },
    {
      name: "航母（福特级）",
      price: 13000000000, // 130亿美元
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      unit: "艘",
      years: 50,
    },
    {
      name: "大型强子对撞机",
      price: 10000000000, // 100亿美元（欧洲核子研究中心的预算）
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop&crop=center",
      unit: "座",
      years: 30,
    },
    {
      name: "SpaceX Starship",
      price: 200000000, // 2亿美元（每次发射成本估算）
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop&crop=center",
      unit: "枚",
      years: 15,
    },
  ]

  const getCurrentYear = () => new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* 飘落的比特币动画 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl money-rain bg-yellow-500 rounded-full border-2 border-white p-2 shadow-muted"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Bitcoin className="text-white"/>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              中本聪模拟器
            </h1>
          </div>

          <div className="flex items-center gap-2 p-4 justify-center">
              <a href={`https://blockchain.com/btc/address/${satoshiAddress}`} target="_blank" className="text-sm font-mono break-all text-blue-500 underline">{satoshiAddress}</a>
              <span>是比特币创世纪地址，中本聪据信持有近110万枚比特币。</span>
            </div>
        </div>

        <SatoshiAssets satoshiBTC={satoshiBTC} satoshiAddress={satoshiAddress} />

        {/* 整合对比区域 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-600">🤯 <CountUp end={satoshiBTC} duration={2.5} separator="," /> BTC = ？</h2>
          <div className="grid grid-cols-1 gap-4">
            {comparisonItems.map((item, index) => {
              const quantity = Math.floor(totalValue / item.price)
              const totalYearsNeeded = quantity * (item.years || 5)
              const historicalPeriod = getHistoricalPeriod(totalYearsNeeded)

              return (
                <Card
                  key={index}
                  className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-card to-muted/30 border-primary/10"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-6">
                      {/* 放大的商品图片 */}
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-2 shadow-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/128x128?text=No+Image'
                          }}
                        />
                      </div>

                      {/* 商品信息区域 */}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-2">
                          <div className="font-bold text-foreground">{item.name}</div>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          单价: ${item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 购买数量部分 */}
                      <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          <CountUp end={quantity} duration={2} separator="," />
                        </div>
                        <div className="text-base text-muted-foreground mb-1">{item.unit}</div>
                        <div className="text-xs text-muted-foreground">可购买数量</div>
                      </div>

                      {/* 总使用年限部分 */}
                      <div className="text-center p-3 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-accent mb-1">
                          <CountUp end={totalYearsNeeded} duration={2.5} separator="," />
                        </div>
                        <div className="text-base text-muted-foreground mb-1">年</div>
                        <div className="text-xs text-muted-foreground">
                          总使用年限
                        </div>
                        <div className="text-xs text-muted-foreground/80">
                          单个寿命: <CountUp end={item.years || 5} duration={1} /> 年
                        </div>
                      </div>
                    </div>

                    {/* 时间线显示 - 宏大宇宙历史时间轴 */}
                    <div className="mt-3 p-4 bg-gradient-to-r from-accent/10 via-primary/5 to-secondary/10 rounded-lg border border-accent/20">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-accent mb-2 flex items-center justify-center gap-2">
                          {historicalPeriod.name.includes('宇宙') && '🌌'}
                          {historicalPeriod.name.includes('地球') && '🌍'}
                          {historicalPeriod.name.includes('生命') && '🧬'}
                          {historicalPeriod.name.includes('恐龙') && '🦕'}
                          {historicalPeriod.name.includes('人类') && '🧑'}
                          {historicalPeriod.name.includes('文明') && '🏛️'}
                          {historicalPeriod.name.includes('时代') && '⚡'}
                          {historicalPeriod.name.includes('革命') && '🔥'}
                          {historicalPeriod.name.includes('大战') && '⚔️'}
                          {!historicalPeriod.name.includes('宇宙') &&
                           !historicalPeriod.name.includes('地球') &&
                           !historicalPeriod.name.includes('生命') &&
                           !historicalPeriod.name.includes('恐龙') &&
                           !historicalPeriod.name.includes('人类') &&
                           !historicalPeriod.name.includes('文明') &&
                           !historicalPeriod.name.includes('时代') &&
                           !historicalPeriod.name.includes('革命') &&
                           !historicalPeriod.name.includes('大战') && '⏳'}
                          {historicalPeriod.name}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {historicalPeriod.description}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-center gap-3 text-sm mb-2">
                          <div className="text-center">
                            <div className="font-medium text-accent">起始时间</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {historicalPeriod.actualStartYear > 0
                                ? `公元${historicalPeriod.actualStartYear}年`
                                : historicalPeriod.actualStartYear < -1000000
                                  ? `${Math.abs(Math.floor(historicalPeriod.actualStartYear / 1000000000))}0亿年前`
                                  : historicalPeriod.actualStartYear < -1000
                                    ? `${Math.abs(Math.floor(historicalPeriod.actualStartYear / 1000000))}百万年前`
                                    : `公元前${Math.abs(historicalPeriod.actualStartYear)}年`
                              }
                            </div>
                          </div>
                          <div className="text-muted-foreground">→</div>
                          <div className="text-center">
                            <div className="font-medium text-primary">现在</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              公元{new Date().getFullYear()}年
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          🚀 这段旅程跨越了
                        </div>
                        <div className="text-xl font-bold text-accent">
                          <CountUp end={totalYearsNeeded} duration={3} separator="," />
                          <span className="text-sm font-normal ml-1">年</span>
                        </div>
                        <div className="text-xs text-muted-foreground/80 mt-2">
                          {totalYearsNeeded > 1000000000 ? '🌌 宇宙尺度' :
                           totalYearsNeeded > 1000000 ? '🌍 地质尺度' :
                           totalYearsNeeded > 100000 ? '🧬 进化尺度' :
                           totalYearsNeeded > 10000 ? '🧑 人类尺度' :
                           totalYearsNeeded > 1000 ? '🏛️ 文明尺度' : '⚡ 现代尺度'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

       

        {/* 页脚 */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>数据来源: CoinGecko API</p>
          <p className="mt-2">⚠️ 本工具仅供娱乐，不构成投资建议</p>
        </div>
      </div>
    </div>
  )
}
