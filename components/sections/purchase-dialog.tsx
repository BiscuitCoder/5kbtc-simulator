import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface PurchaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PurchaseDialog({ open, onOpenChange }: PurchaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center py-12 px-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-green-600 mb-6 flex flex-col items-center gap-4">
            <img src="/img1.png" className="rounded-xl" />
            <span>我的朋友，请勤劳致富！</span>
            <span>早起早睡，梦里什么都有！</span>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 text-lg cursor-pointer"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
