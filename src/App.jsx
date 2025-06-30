import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Timer, Plus, Download, Upload, Moon, Sun, Settings, MoreVertical, FileText, FileJson, ChevronDown, ChevronUp, Expand, GripVertical, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [workouts, setWorkouts] = useState([])
  const [activeView, setActiveView] = useState('dashboard') // dashboard, create, workout
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [isQuickActionsCollapsed, setIsQuickActionsCollapsed] = useState(false)
  const [fullscreenExercise, setFullscreenExercise] = useState(null)
  const [editingWorkout, setEditingWorkout] = useState(null)

  // Load workouts from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workoutTimerPro_workouts')
    if (savedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(savedWorkouts)
        setWorkouts(parsedWorkouts)
      } catch (error) {
        console.error('Error loading workouts from localStorage:', error)
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('workoutTimerPro_theme')
    if (savedTheme) {
      const isDark = savedTheme === 'dark'
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  // Save workouts to localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('workoutTimerPro_workouts', JSON.stringify(workouts))
  }, [workouts])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('workoutTimerPro_theme', newTheme ? 'dark' : 'light')
  }

  const startWorkout = (workout) => {
    setActiveWorkout(workout)
    setActiveView('workout')
  }

  return (
    <div className={`min-h-screen theme-transition ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b border-glass-border">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-coral rounded-lg flex items-center justify-center">
                {/* <Timer className="w-5 h-5 text-charcoal" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <text x="12" y="18" font-size="18" text-anchor="middle" fill="currentColor">🏋️</text>
                </svg>
              </div>
              <h1 className="heading heading-3 text-off-white">Workout Timer</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleTheme}
                className="btn p-2"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button className="btn p-2" aria-label="Settings">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pb-8">
        {activeView === 'dashboard' && (
          <DashboardView 
            workouts={workouts} 
            setActiveView={setActiveView}
            setWorkouts={setWorkouts}
            startWorkout={startWorkout}
            editingWorkout={editingWorkout}
            setEditingWorkout={setEditingWorkout}
          />
        )}
        
        {activeView === 'create' && (
          <CreateWorkoutView 
            setActiveView={setActiveView}
            workouts={workouts}
            setWorkouts={setWorkouts}
            setFullscreenExercise={setFullscreenExercise}
            editingWorkout={editingWorkout}
            setEditingWorkout={setEditingWorkout}
          />
        )}
        
        {activeView === 'workout' && activeWorkout && (
          <WorkoutView 
            workout={activeWorkout}
            setActiveView={setActiveView} 
            setWorkouts={setWorkouts}
          />
        )}
      </main>
      
      {/* Fullscreen Exercise Overlay */}
      {fullscreenExercise && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenExercise(null)}
        >
          <div 
            className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="heading heading-4 text-off-white">Exercise Details</h3>
              <Button 
                variant="ghost" 
                className="p-2 h-8 w-8 rounded-full hover:bg-glass-bg"
                onClick={() => setFullscreenExercise(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block body-base font-medium mb-2 text-off-white">Exercise Name</label>
                <p className="body-base text-muted-foreground">{fullscreenExercise.name}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block body-base font-medium mb-2 text-off-white">Type</label>
                  <p className="body-base text-muted-foreground">
                    {fullscreenExercise.type === 'reps' ? 'Repetitions' : 'Duration'}
                  </p>
                </div>
                
                <div>
                  <label className="block body-base font-medium mb-2 text-off-white">Sets</label>
                  <p className="body-base text-muted-foreground">{fullscreenExercise.sets}</p>
                </div>
                
                {fullscreenExercise.type === 'reps' ? (
                  <div>
                    <label className="block body-base font-medium mb-2 text-off-white">Reps per Set</label>
                    <p className="body-base text-muted-foreground">{fullscreenExercise.reps}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block body-base font-medium mb-2 text-off-white">Duration per Set</label>
                    <p className="body-base text-muted-foreground">{fullscreenExercise.duration} seconds</p>
                  </div>
                )}
                
                <div>
                  <label className="block body-base font-medium mb-2 text-off-white">Rest Between Sets</label>
                  <p className="body-base text-muted-foreground">{fullscreenExercise.restBetweenSets} seconds</p>
                </div>
                
                <div>
                  <label className="block body-base font-medium mb-2 text-off-white">Rest After Exercise</label>
                  <p className="body-base text-muted-foreground">{fullscreenExercise.restBetweenExercises} seconds</p>
                </div>
              </div>
              
              {fullscreenExercise.mediaUrl && (
                <div>
                  <label className="block body-base font-medium mb-2 text-off-white">Media Preview</label>
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-glass-bg border border-glass-border">
                    {fullscreenExercise.mediaUrl.match(/\.(gif|png|jpg|jpeg|webp|svg)$/i) ? (
                      <img 
                        src={fullscreenExercise.mediaUrl} 
                        alt={`${fullscreenExercise.name} demonstration`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : fullscreenExercise.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video 
                        src={fullscreenExercise.mediaUrl}
                        className="w-full h-full object-contain"
                        controls
                        loop
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback for unsupported media or loading errors */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-glass-bg text-muted-foreground"
                      style={{ display: fullscreenExercise.mediaUrl.match(/\.(gif|png|jpg|jpeg|webp|svg|mp4|webm|ogg)$/i) ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2">
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="body-base">Media Preview</p>
                        <p className="body-small text-muted-foreground mt-1">{fullscreenExercise.mediaUrl}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard View Component
function DashboardView({ workouts, setActiveView, setWorkouts, startWorkout, editingWorkout, setEditingWorkout }) {
  const [importStatus, setImportStatus] = useState('')

  const handleImportJSON = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          
          // Validate the imported data structure
          if (Array.isArray(importedData)) {
            const validWorkouts = importedData.filter(workout => 
              workout.name && 
              workout.exercises && 
              Array.isArray(workout.exercises)
            )
            
            if (validWorkouts.length > 0) {
              // Add unique IDs if missing and ensure proper structure
              const processedWorkouts = validWorkouts.map(workout => ({
                ...workout,
                id: workout.id || Date.now() + Math.random(),
                createdAt: workout.createdAt || new Date().toISOString(),
                exercises: workout.exercises.map(exercise => ({
                  name: exercise.name || '',
                  type: exercise.type || 'reps',
                  reps: exercise.reps || '',
                  duration: exercise.duration || '',
                  sets: exercise.sets || 1,
                  restBetweenSets: exercise.restBetweenSets || 30,
                  restBetweenExercises: exercise.restBetweenExercises || 60,
                  mediaUrl: exercise.mediaUrl || ''
                }))
              }))
              
              setWorkouts(prev => [...prev, ...processedWorkouts])
              setImportStatus(`Successfully imported ${processedWorkouts.length} workout(s)`)
              setTimeout(() => setImportStatus(''), 3000)
            } else {
              setImportStatus('No valid workouts found in the file')
              setTimeout(() => setImportStatus(''), 3000)
            }
          } else {
            setImportStatus('Invalid file format. Expected an array of workouts.')
            setTimeout(() => setImportStatus(''), 3000)
          }
        } catch (error) {
          console.error('Error importing JSON:', error)
          setImportStatus('Error reading file. Please check the JSON format.')
          setTimeout(() => setImportStatus(''), 3000)
        }
      }
      reader.readAsText(file)
    }
    // Reset the input value to allow importing the same file again
    event.target.value = ''
  }

  const handleExportJSON = () => {
    if (workouts.length === 0) {
      setImportStatus('No workouts to export')
      setTimeout(() => setImportStatus(''), 3000)
      return
    }

    try {
      const dataStr = JSON.stringify(workouts, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `workout-timer-pro-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setImportStatus(`Exported ${workouts.length} workout(s) successfully`)
      setTimeout(() => setImportStatus(''), 3000)
    } catch (error) {
      console.error('Error exporting JSON:', error)
      setImportStatus('Error exporting workouts')
      setTimeout(() => setImportStatus(''), 3000)
    }
  }

  const handleClearAllWorkouts = () => {
    if (window.confirm('Are you sure you want to delete all workouts? This action cannot be undone.')) {
      setWorkouts([])
      localStorage.removeItem('workoutTimerPro_workouts')
      setImportStatus('All workouts cleared')
      setTimeout(() => setImportStatus(''), 3000)
    }
  }

  const handleExportText = () => {
    if (workouts.length === 0) {
      setImportStatus('No workouts to export')
      setTimeout(() => setImportStatus(''), 3000)
      return
    }

    try {
      let textContent = '# Workout Timer - Exported Workouts\n\n'
      textContent += `Exported on: ${new Date().toLocaleDateString()}\n`
      textContent += `Total Workouts: ${workouts.length}\n\n`
      textContent += '---\n\n'

      workouts.forEach((workout, index) => {
        textContent += `## ${index + 1}. ${workout.name}\n\n`
        textContent += `**Created:** ${new Date(workout.createdAt).toLocaleDateString()}\n`
        textContent += `**Exercises:** ${workout.exercises.length}\n`
        textContent += `**Estimated Duration:** ~${Math.round(workout.exercises.reduce((total, exercise) => {
          const setTime = (exercise.duration || 30) * exercise.sets
          const restTime = (exercise.restBetweenSets || 30) * (exercise.sets - 1)
          const exerciseRest = exercise.restBetweenExercises || 60
          return total + setTime + restTime + exerciseRest
        }, 0) / 60)} minutes\n\n`

        textContent += '### Exercises:\n\n'
        workout.exercises.forEach((exercise, exIndex) => {
          textContent += `${exIndex + 1}. **${exercise.name}**\n`
          textContent += `   - Type: ${exercise.type === 'reps' ? 'Repetitions' : 'Duration'}\n`
          if (exercise.type === 'reps') {
            textContent += `   - Reps per set: ${exercise.reps}\n`
          } else {
            textContent += `   - Duration per set: ${exercise.duration} seconds\n`
          }
          textContent += `   - Sets: ${exercise.sets}\n`
          textContent += `   - Rest between sets: ${exercise.restBetweenSets} seconds\n`
          textContent += `   - Rest after exercise: ${exercise.restBetweenExercises} seconds\n`
          if (exercise.mediaUrl) {
            textContent += `   - Media: ${exercise.mediaUrl}\n`
          }
          textContent += '\n'
        })
        textContent += '---\n\n'
      })

      const dataBlob = new Blob([textContent], { type: 'text/markdown' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `workout-timer-pro-${new Date().toISOString().split('T')[0]}.md`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setImportStatus(`Exported ${workouts.length} workout(s) as Markdown`)
      setTimeout(() => setImportStatus(''), 3000)
    } catch (error) {
      console.error('Error exporting text:', error)
      setImportStatus('Error exporting workouts as text')
      setTimeout(() => setImportStatus(''), 3000)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Workouts List */}
      <div className="glass-card p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="heading heading-4">Your Workouts</h2>
          
          {workouts.length > 0 && (
            <div className="flex gap-2">
              <Button 
                className="btn btn-primary"
                onClick={() => setActiveView('create')}
              >
                <Plus className="w-4 h-4" />
                New Workout
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn">
                    <Download className="w-4 h-4" />
                    Import
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border border-glass-border">
                  <DropdownMenuItem 
                    onClick={() => document.getElementById('import-json-input').click()}
                    className="cursor-pointer"
                  >
                    <FileJson className="mr-2 h-4 w-4" />
                    Import from JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <input 
                id="import-json-input"
                type="file" 
                accept=".json" 
                onChange={handleImportJSON}
                className="hidden"
              />
            </div>
          )}
        </div>
        
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-glass-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-accent-primary" />
            </div>
            <h3 className="heading heading-5 mb-2">No workouts yet</h3>
            <p className="body-base text-muted-foreground mb-4">
              Create your first workout to get started with your fitness journey.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                className="btn btn-primary"
                onClick={() => setActiveView('create')}
              >
                <Plus className="w-4 h-4" />
                Create Your First Workout
              </Button>
              <Button 
                className="btn"
                onClick={() => document.getElementById('import-json-input').click()}
              >
                <Download className="w-4 h-4" />
                Import JSON
              </Button>
              <input 
                id="import-json-input"
                type="file" 
                accept=".json" 
                onChange={handleImportJSON}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {workouts.map((workout, index) => (
              <WorkoutCard 
                key={index} 
                workout={workout} 
                onStart={() => startWorkout(workout)}
                onEdit={() => {
                  setEditingWorkout(workout)
                  setActiveView('create')
                }}
                onDelete={(id) => {
                  setWorkouts(prev => prev.filter(w => w.id !== id))
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 text-center min-w-[120px]">
          <div className="text-2xl font-bold text-accent-primary mb-1">
            {workouts.length}
          </div>
          <div className="body-small text-muted-foreground">Total Workouts</div>
        </div>
        
        <div className="glass-card p-4 text-center min-w-[120px]">
          <div className="text-2xl font-bold text-accent-primary mb-1">
            {workouts.reduce((total, workout) => total + (workout.exercises?.length || 0), 0)}
          </div>
          <div className="body-small text-muted-foreground">Total Exercises</div>
        </div>
        
        <div className="glass-card p-4 text-center md:col-span-2 lg:col-span-1 min-w-[120px]">
          <div className="text-2xl font-bold text-accent-primary mb-1">0</div>
          <div className="body-small text-muted-foreground">Completed Sessions</div>
        </div>
      </div>
    </div>
  )
}

// Workout Card Component
function WorkoutCard({ workout, onStart, onEdit, onDelete }) {
  const totalExercises = workout.exercises?.length || 0
  const estimatedTime = workout.exercises?.reduce((total, exercise) => {
    const setTime = (exercise.duration || 30) * exercise.sets
    const restTime = (exercise.restBetweenSets || 30) * (exercise.sets - 1)
    const exerciseRest = exercise.restBetweenExercises || 60
    return total + setTime + restTime + exerciseRest
  }, 0) || 0

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(workout, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${workout.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting workout:', error)
    }
  }

  const handleExportText = () => {
    try {
      let textContent = `# ${workout.name}\n\n`
      textContent += `**Created:** ${new Date(workout.createdAt).toLocaleDateString()}\n`
      textContent += `**Exercises:** ${workout.exercises.length}\n`
      textContent += `**Estimated Duration:** ~${Math.round(estimatedTime / 60)} minutes\n\n`

      textContent += '## Exercises:\n\n'
      workout.exercises.forEach((exercise, index) => {
        textContent += `${index + 1}. **${exercise.name}**\n`
        textContent += `   - Type: ${exercise.type === 'reps' ? 'Repetitions' : 'Duration'}\n`
        if (exercise.type === 'reps') {
          textContent += `   - Reps per set: ${exercise.reps}\n`
        } else {
          textContent += `   - Duration per set: ${exercise.duration} seconds\n`
        }
        textContent += `   - Sets: ${exercise.sets}\n`
        textContent += `   - Rest between sets: ${exercise.restBetweenSets} seconds\n`
        textContent += `   - Rest after exercise: ${exercise.restBetweenExercises} seconds\n`
        if (exercise.mediaUrl) {
          textContent += `   - Media: ${exercise.mediaUrl}\n`
        }
        textContent += '\n'
      })

      const dataBlob = new Blob([textContent], { type: 'text/plain' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${workout.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting workout:', error)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${workout.name}"? This action cannot be undone.`)) {
      onDelete(workout.id)
    }
  }

  return (
    <div className="glass-card p-4 hover:scale-[1.01] transition-transform relative">
      {/* Export Dropdown - Top Right Corner */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-glass-bg/50 hover:bg-glass-bg border border-glass-border">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border border-glass-border">
            <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportText} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              Export as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-500 hover:text-red-400">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Workout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="pr-12">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="heading heading-5 mb-1 truncate">{workout.name || 'Untitled Workout'}</h3>
            <p className="body-small text-muted-foreground">
              {totalExercises} exercises • ~{Math.round(estimatedTime / 60)} min
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-3">
            <Button className="btn btn-primary" onClick={onStart}>
              <Timer className="w-4 h-4" />
              Start
            </Button>
            <Button className="btn" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
        
        {workout.exercises && workout.exercises.length > 0 && (
          <div className="space-y-2">
            <div className="divider"></div>
            <div className="grid gap-1">
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="flex justify-between body-small">
                  <span className="truncate mr-2">{exercise.name}</span>
                  <span className="text-muted-foreground flex-shrink-0">
                    {exercise.sets} × {exercise.reps || exercise.duration + 's'}
                  </span>
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="body-small text-muted-foreground">
                  +{workout.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Create Workout View Component
function CreateWorkoutView({ setActiveView, workouts, setWorkouts, setFullscreenExercise, editingWorkout, setEditingWorkout }) {
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState([])
  const [editingIndex, setEditingIndex] = useState(-1)
  const [draggedIndex, setDraggedIndex] = useState(null)

  // Initialize form with existing workout data when editing
  useEffect(() => {
    if (editingWorkout) {
      setWorkoutName(editingWorkout.name)
      setExercises([...editingWorkout.exercises])
    } else {
      setWorkoutName('')
      setExercises([])
    }
  }, [editingWorkout])

  const addExercise = () => {
    const newExercise = {
      name: '',
      reps: '',
      duration: '',
      sets: 1,
      restBetweenSets: 30,
      restBetweenExercises: 60,
      mediaUrl: '',
      type: 'reps' // 'reps' or 'duration'
    }
    setExercises([...exercises, newExercise])
    setEditingIndex(exercises.length)
  }

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...exercises]
    updatedExercises[index][field] = value
    setExercises(updatedExercises)
  }

  const removeExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index)
    setExercises(updatedExercises)
    if (editingIndex === index) setEditingIndex(-1)
  }

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const updatedExercises = [...exercises]
    const draggedExercise = updatedExercises[draggedIndex]
    
    // Remove the dragged item
    updatedExercises.splice(draggedIndex, 1)
    
    // Insert at the new position
    updatedExercises.splice(dropIndex, 0, draggedExercise)
    
    setExercises(updatedExercises)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name')
      return
    }
    if (exercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    const workoutData = {
      id: editingWorkout ? editingWorkout.id : Date.now(),
      name: workoutName,
      exercises: exercises.filter(ex => ex.name.trim()),
      createdAt: editingWorkout ? editingWorkout.createdAt : new Date().toISOString()
    }

    if (editingWorkout) {
      // Update existing workout
      const updatedWorkouts = workouts.map(w => 
        w.id === editingWorkout.id ? workoutData : w
      )
      setWorkouts(updatedWorkouts)
    } else {
      // Create new workout
      setWorkouts([...workouts, workoutData])
    }

    // Reset editing state and return to dashboard
    setEditingWorkout(null)
    setActiveView('dashboard')
  }

  const handleCancel = () => {
    setEditingWorkout(null)
    setActiveView('dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading heading-3">{editingWorkout ? 'Edit Workout' : 'Create New Workout'}</h2>
          <div className="flex gap-3">
            <Button className="btn" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="btn btn-primary" onClick={saveWorkout}>
              {editingWorkout ? 'Update Workout' : 'Save Workout'}
            </Button>
          </div>
        </div>
        
        {/* Workout Name */}
        <div className="mb-4">
          <label className="block body-base font-medium mb-2">Workout Name</label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Enter workout name..."
            className="w-full p-3 bg-glass-bg border border-glass-border rounded-lg text-off-white placeholder-gray-400 focus:outline-none focus:border-accent-primary"
          />
        </div>
      </div>

      {/* Exercises List */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="heading heading-4">Exercises ({exercises.length})</h3>
            {exercises.length > 1 && (
              <p className="body-small text-muted-foreground mt-1">
                Drag exercises to reorder them
              </p>
            )}
          </div>
          <Button className="btn btn-primary" onClick={addExercise}>
            <Plus className="w-4 h-4" />
            Add Exercise
          </Button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-glass-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-accent-primary" />
            </div>
            <p className="body-base text-muted-foreground">
              No exercises added yet. Click "Add Exercise" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-move transition-opacity ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
              >
                <ExerciseCard
                  exercise={exercise}
                  index={index}
                  isEditing={editingIndex === index}
                  onEdit={() => setEditingIndex(index)}
                  onSave={() => setEditingIndex(-1)}
                  onRemove={() => removeExercise(index)}
                  onUpdate={(field, value) => updateExercise(index, field, value)}
                  setFullscreenExercise={setFullscreenExercise}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workout Summary */}
      {exercises.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="heading heading-4 mb-4">Workout Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                {exercises.length}
              </div>
              <div className="body-small text-muted-foreground">Total Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                {exercises.reduce((total, ex) => total + ex.sets, 0)}
              </div>
              <div className="body-small text-muted-foreground">Total Sets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">
                ~{Math.round(exercises.reduce((total, exercise) => {
                  const setTime = (exercise.type === 'duration' ? exercise.duration : 30) * exercise.sets
                  const restTime = exercise.restBetweenSets * (exercise.sets - 1)
                  const exerciseRest = exercise.restBetweenExercises
                  return total + setTime + restTime + exerciseRest
                }, 0) / 60)}
              </div>
              <div className="body-small text-muted-foreground">Estimated Minutes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Exercise Card Component
function ExerciseCard({ exercise, index, isEditing, onEdit, onSave, onRemove, onUpdate, setFullscreenExercise }) {
  if (isEditing) {
    return (
      <div className="glass-card p-4 border-accent-primary">
        <div className="space-y-4">
          {/* Exercise Name */}
          <div>
            <label className="block body-small font-medium mb-1">Exercise Name</label>
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="e.g., Push-ups, Squats, Plank..."
              className="w-full p-2 bg-glass-bg border border-glass-border rounded text-off-white placeholder-gray-400 focus:outline-none focus:border-accent-primary"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block body-small font-medium mb-1">Exercise Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdate('type', 'reps')}
                className={`px-3 py-1 rounded text-sm ${
                  exercise.type === 'reps' 
                    ? 'bg-accent-primary text-charcoal' 
                    : 'bg-glass-bg text-off-white border border-glass-border'
                }`}
              >
                Repetitions
              </button>
              <button
                type="button"
                onClick={() => onUpdate('type', 'duration')}
                className={`px-3 py-1 rounded text-sm ${
                  exercise.type === 'duration' 
                    ? 'bg-accent-primary text-charcoal' 
                    : 'bg-glass-bg text-off-white border border-glass-border'
                }`}
              >
                Duration
              </button>
            </div>
          </div>

          {/* Reps/Duration and Sets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block body-small font-medium mb-1">
                {exercise.type === 'reps' ? 'Reps per Set' : 'Duration per Set (seconds)'}
              </label>
              <input
                type="number"
                value={exercise.type === 'reps' ? exercise.reps : exercise.duration}
                onChange={(e) => onUpdate(exercise.type === 'reps' ? 'reps' : 'duration', parseInt(e.target.value) || '')}
                placeholder={exercise.type === 'reps' ? '10' : '30'}
                className="w-full p-2 bg-glass-bg border border-glass-border rounded text-off-white placeholder-gray-400 focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="block body-small font-medium mb-1">Number of Sets</label>
              <input
                type="number"
                value={exercise.sets}
                onChange={(e) => onUpdate('sets', parseInt(e.target.value) || 1)}
                min="1"
                className="w-full p-2 bg-glass-bg border border-glass-border rounded text-off-white focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Rest Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block body-small font-medium mb-1">Rest Between Sets (seconds)</label>
              <input
                type="number"
                value={exercise.restBetweenSets}
                onChange={(e) => onUpdate('restBetweenSets', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-2 bg-glass-bg border border-glass-border rounded text-off-white focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="block body-small font-medium mb-1">Rest After Exercise (seconds)</label>
              <input
                type="number"
                value={exercise.restBetweenExercises}
                onChange={(e) => onUpdate('restBetweenExercises', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-2 bg-glass-bg border border-glass-border rounded text-off-white focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Media URL */}
          <div>
            <label className="block body-small font-medium mb-1">Media URL (optional)</label>
            <input
              type="url"
              value={exercise.mediaUrl}
              onChange={(e) => onUpdate('mediaUrl', e.target.value)}
              placeholder="https://example.com/exercise-demo.gif"
              className="w-full p-2 bg-glass-bg border border-glass-border rounded text-off-white placeholder-gray-400 focus:outline-none focus:border-accent-primary"
            />
            <p className="body-xs text-muted-foreground mt-1">
              Add a GIF, image, or video URL to show during the exercise
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button className="btn" onClick={onSave}>
              Done
            </Button>
            <Button className="btn text-red-400 border-red-400 hover:bg-red-400 hover:text-white" onClick={onRemove}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-4 hover:scale-[1.01] transition-transform relative">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
          </div>
          <div className="flex-1 cursor-pointer" onClick={onEdit}>
            <h4 className="heading heading-5 mb-1">{exercise.name || 'Untitled Exercise'}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 body-small text-muted-foreground">
              <div>
                <span className="font-medium">Type:</span> {exercise.type === 'reps' ? 'Repetitions' : 'Duration'}
              </div>
              <div>
                <span className="font-medium">Sets:</span> {exercise.sets}
              </div>
              <div>
                <span className="font-medium">
                  {exercise.type === 'reps' ? 'Reps:' : 'Duration:'}
                </span> {exercise.type === 'reps' ? exercise.reps : `${exercise.duration}s`}
              </div>
              <div>
                <span className="font-medium">Rest:</span> {exercise.restBetweenSets}s
              </div>
            </div>
            
            {/* Media Preview */}
            {exercise.mediaUrl && (
              <div className="mt-3">
                <div className="relative w-full max-w-[200px] h-[120px] rounded-lg overflow-hidden bg-glass-bg border border-glass-border">
                  {exercise.mediaUrl.match(/\.(gif|png|jpg|jpeg|webp|svg)$/i) ? (
                    <img 
                      src={exercise.mediaUrl} 
                      alt={`${exercise.name} demonstration`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : exercise.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video 
                      src={exercise.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback for unsupported media or loading errors */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-glass-bg text-muted-foreground"
                    style={{ display: exercise.mediaUrl.match(/\.(gif|png|jpg|jpeg|webp|svg|mp4|webm|ogg)$/i) ? 'none' : 'flex' }}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-1">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs">Media Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <Button 
            variant="ghost" 
            className="p-2 h-10 w-10 rounded-full hover:bg-glass-bg border border-glass-border bg-glass-bg/30"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenExercise(exercise);
            }}
            title="View fullscreen"
          >
            <Expand className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Workout View Component (Live Workout Mode)
function WorkoutView({ workout, setActiveView, setWorkouts }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('warmup') // warmup, exercise, rest, complete
  const [timeRemaining, setTimeRemaining] = useState(5) // Start with 5-second warmup
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState(null)
  const [totalElapsedTime, setTotalElapsedTime] = useState(0)

  const currentExercise = workout.exercises[currentExerciseIndex]
  const totalExercises = workout.exercises.length
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
  const completedSets = workout.exercises.slice(0, currentExerciseIndex).reduce((sum, ex) => sum + ex.sets, 0) + currentSetIndex

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handlePhaseComplete()
            return 0
          }
          return time - 1
        })
        setTotalElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused, timeRemaining])

  const handlePhaseComplete = () => {
    if (currentPhase === 'warmup') {
      // Start first exercise
      setCurrentPhase('exercise')
      if (currentExercise.type === 'duration') {
        setTimeRemaining(currentExercise.duration)
      } else {
        // For reps, we'll show a manual completion interface
        setTimeRemaining(0)
      }
    } else if (currentPhase === 'exercise') {
      // Move to rest phase
      if (currentSetIndex < currentExercise.sets - 1) {
        // Rest between sets
        setCurrentPhase('rest')
        setTimeRemaining(currentExercise.restBetweenSets)
      } else if (currentExerciseIndex < totalExercises - 1) {
        // Rest between exercises
        setCurrentPhase('rest')
        setTimeRemaining(currentExercise.restBetweenExercises)
      } else {
        // Workout complete
        setCurrentPhase('complete')
        setIsRunning(false)
        handleWorkoutComplete()
        return
      }
    } else if (currentPhase === 'rest') {
      // Move to next set or exercise
      if (currentSetIndex < currentExercise.sets - 1) {
        // Next set of same exercise
        setCurrentSetIndex(prev => prev + 1)
        setCurrentPhase('exercise')
        if (currentExercise.type === 'duration') {
          setTimeRemaining(currentExercise.duration)
        } else {
          setTimeRemaining(0)
        }
      } else {
        // Next exercise
        setCurrentExerciseIndex(prev => prev + 1)
        setCurrentSetIndex(0)
        setCurrentPhase('exercise')
        const nextExercise = workout.exercises[currentExerciseIndex + 1]
        if (nextExercise.type === 'duration') {
          setTimeRemaining(nextExercise.duration)
        } else {
          setTimeRemaining(0)
        }
      }
    }
  }

  const handleWorkoutComplete = () => {
    // Update workout completion stats
    setWorkouts(prev => prev.map(w => 
      w.id === workout.id 
        ? { ...w, completedSessions: (w.completedSessions || 0) + 1, lastCompleted: new Date().toISOString() }
        : w
    ))
  }

  const startWorkout = () => {
    setIsRunning(true)
    setWorkoutStartTime(Date.now())
  }

  const pauseWorkout = () => {
    setIsPaused(!isPaused)
  }

  const skipPhase = () => {
    handlePhaseComplete()
  }

  const completeRepsSet = () => {
    if (currentPhase === 'exercise' && currentExercise.type === 'reps') {
      handlePhaseComplete()
    }
  }

  const exitWorkout = () => {
    if (window.confirm('Are you sure you want to exit the workout? Your progress will be lost.')) {
      setActiveView('dashboard')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'warmup': return 'Get Ready!'
      case 'exercise': return currentExercise.name
      case 'rest': return 'Rest Time'
      case 'complete': return 'Workout Complete!'
      default: return ''
    }
  }

  const getPhaseSubtitle = () => {
    switch (currentPhase) {
      case 'warmup': return 'Workout starting soon...'
      case 'exercise': 
        if (currentExercise.type === 'reps') {
          return `Set ${currentSetIndex + 1} of ${currentExercise.sets} • ${currentExercise.reps} reps`
        } else {
          return `Set ${currentSetIndex + 1} of ${currentExercise.sets}`
        }
      case 'rest': 
        if (currentSetIndex < currentExercise.sets - 1) {
          return `Next: ${currentExercise.name} - Set ${currentSetIndex + 2}`
        } else if (currentExerciseIndex < totalExercises - 1) {
          return `Next: ${workout.exercises[currentExerciseIndex + 1].name}`
        } else {
          return 'Final rest before completion'
        }
      case 'complete': return `Great job! You completed ${totalExercises} exercises in ${formatTime(totalElapsedTime)}`
      default: return ''
    }
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'warmup': return 'text-yellow-400'
      case 'exercise': return 'text-accent-primary'
      case 'rest': return 'text-blue-400'
      case 'complete': return 'text-green-400'
      default: return 'text-off-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-medium to-primary-light flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 glass-card m-4">
        <div>
          <h1 className="heading heading-4">{workout.name}</h1>
          <p className="body-small text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {totalExercises} • Set {currentSetIndex + 1}
          </p>
        </div>
        <Button className="btn text-red-400 border-red-400 hover:bg-red-400 hover:text-white" onClick={exitWorkout}>
          Exit
        </Button>
      </div>

      {/* Main Timer Display */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="glass-card p-8 text-center max-w-2xl w-full">
          {/* Phase Title */}
          <h2 className={`heading heading-1 mb-4 ${getPhaseColor()}`}>
            {getPhaseTitle()}
          </h2>
          
          {/* Phase Subtitle */}
          <p className="body-large text-muted-foreground mb-8">
            {getPhaseSubtitle()}
          </p>

          {/* Timer Display */}
          {(currentPhase === 'warmup' || currentPhase === 'rest' || (currentPhase === 'exercise' && currentExercise.type === 'duration')) && (
            <div className="mb-8">
              <div className={`text-8xl font-bold mb-4 ${getPhaseColor()}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="w-full bg-glass-bg rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    currentPhase === 'warmup' ? 'bg-yellow-400' :
                    currentPhase === 'exercise' ? 'bg-accent-primary' : 'bg-blue-400'
                  }`}
                  style={{ 
                    width: `${currentPhase === 'warmup' ? ((5 - timeRemaining) / 5) * 100 :
                           currentPhase === 'exercise' ? ((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100 :
                           currentPhase === 'rest' ? ((currentExercise.restBetweenSets - timeRemaining) / currentExercise.restBetweenSets) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          )}

          {/* Reps Exercise Interface */}
          {currentPhase === 'exercise' && currentExercise.type === 'reps' && (
            <div className="mb-8">
              <div className="text-6xl font-bold text-accent-primary mb-4">
                {currentExercise.reps}
              </div>
              <p className="body-large mb-6">Complete {currentExercise.reps} reps</p>
              <Button className="btn btn-primary text-xl px-8 py-4" onClick={completeRepsSet}>
                ✓ Set Complete
              </Button>
            </div>
          )}

          {/* Media Display */}
          {currentExercise && currentExercise.mediaUrl && currentPhase === 'exercise' && (
            <div className="mb-6">
              <div className="relative max-w-full max-h-64 mx-auto rounded-lg overflow-hidden bg-glass-bg border border-glass-border">
                {currentExercise.mediaUrl.match(/\.(gif|png|jpg|jpeg|webp|svg)$/i) ? (
                  <img 
                    src={currentExercise.mediaUrl} 
                    alt={`${currentExercise.name} demonstration`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : currentExercise.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video 
                    src={currentExercise.mediaUrl}
                    className="w-full h-full object-contain"
                    autoPlay
                    muted
                    loop
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback for unsupported media or loading errors */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-glass-bg text-muted-foreground"
                  style={{ display: currentExercise.mediaUrl.match(/\.(gif|png|jpg|jpeg|webp|svg|mp4|webm|ogg)$/i) ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs">Media Preview</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isRunning && currentPhase === 'warmup' && (
              <Button className="btn btn-primary text-xl px-8 py-4" onClick={startWorkout}>
                Start Workout
              </Button>
            )}
            
            {isRunning && currentPhase !== 'complete' && (
              <>
                <Button className="btn text-xl px-6 py-3" onClick={pauseWorkout}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button className="btn text-xl px-6 py-3" onClick={skipPhase}>
                  Skip
                </Button>
              </>
            )}

            {currentPhase === 'complete' && (
              <Button className="btn btn-primary text-xl px-8 py-4" onClick={() => setActiveView('dashboard')}>
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="glass-card m-4 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="body-small">Overall Progress</span>
          <span className="body-small">{completedSets} / {totalSets} sets</span>
        </div>
        <div className="w-full bg-glass-bg rounded-full h-2">
          <div 
            className="h-2 bg-accent-primary rounded-full transition-all duration-500"
            style={{ width: `${(completedSets / totalSets) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 body-xs text-muted-foreground">
          <span>Total Time: {formatTime(totalElapsedTime)}</span>
          <span>{isPaused ? 'Paused' : isRunning ? 'Running' : 'Ready'}</span>
        </div>
      </div>
    </div>
  )
}

export default App

