import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <ModeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App
