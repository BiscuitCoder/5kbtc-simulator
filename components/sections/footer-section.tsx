export default function FooterSection() {
  return (
    <div className="text-center mt-12 text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-4">
        <a href="https://www.coingecko.com/en/coins/bitcoin" target="_blank" rel="noopener noreferrer" className="hover:text-black underline">数据来源: CoinGecko API</a>
        <a href="https://github.com/BiscuitCoder/6kbtc-regret" target="_blank" rel="noopener noreferrer" className="hover:text-black underline">GitHub</a>
      </div>
      <p className="mt-2">⚠️ 本工具仅供娱乐，不构成投资建议</p>
    </div>
  )
}
