interface HeaderSectionProps {
  satoshiAddress: string
}

export default function HeaderSection({ satoshiAddress }: HeaderSectionProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          中本聪模拟器
        </h1>
      </div>

      <div className="flex items-center gap-2 p-4 justify-center">
        <a
          href={`https://blockchain.com/btc/address/${satoshiAddress}`}
          target="_blank"
          className="text-sm font-mono break-all text-blue-500 underline"
        >
          {satoshiAddress}
        </a>
        <span>是比特币创世纪地址，中本聪据信持有近110万枚比特币。</span>
      </div>
    </div>
  )
}
