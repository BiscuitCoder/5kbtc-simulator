
interface HeaderSectionProps {
  satoshiAddress: string
}

export default function HeaderSection({ satoshiAddress }: HeaderSectionProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
          5KBTC 后悔模拟器
        </h1>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            💡 <strong>5KBTC</strong> = 5千人民币购买比特币的概念，模拟你在不同年用 5,000 RMB 买入的比特币价值
          </p>
        </div>
      </div>
    </div>
  )
}
