import { Button } from "@/components/ui/button"
import { Keyboard } from "@/components/ui/keyboard"

function App() {

  return (
    <div>
      <Button>Button</Button>
      <Keyboard enableHaptics={true} enableSound={true} theme="mint" />
    </div>
  )
}

export default App
