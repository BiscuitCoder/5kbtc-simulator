
interface HeaderSectionProps {
  satoshiAddress: string
}

export default function HeaderSection({ satoshiAddress }: HeaderSectionProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
          6KBTC 后悔模拟器
        </h1>
      </div>

      <div className="mx-auto mb-6 max-w-4xl">
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300 text-left">
          💡 2011 年 12 月 21 日，知乎上有个大三学生抛出疑问：“手头有 6000 元，求好的理财投资建议？”
          <br/> <br/>
当天，巴比特创始人长铗留下一句后来被反复提及的回复：“买比特币，保存好钱包文件，然后忘掉你有过 6000 元这回事，五年后再看看。”
<br/> <br/>
如今再回头看，这样的 “关键选择时刻” 似乎总在不断重演 —— 如果你做出了认为正确的选择，又会如何呢 ？
          </p>
        </div>
      </div>
    </div>
  )
}
