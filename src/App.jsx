import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Play, Plus, Download, Upload, Moon, Sun, Settings } from 'lucide-react'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [workouts, setWorkouts] = useState([])
  const [activeView, setActiveView] = useState('dashboard') // dashboard, create, workout
  const [activeWorkout, setActiveWorkout] = useState(null)

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
      <header className="container py-4">
        <div className="glass-card p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-coral rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-charcoal" />
              </div>
              <h1 className="heading heading-3 text-off-white">Workout Timer Pro</h1>
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
          />
        )}
        
        {activeView === 'create' && (
          <CreateWorkoutView 
            setActiveView={setActiveView}
            workouts={workouts}
            setWorkouts={setWorkouts}
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
    </div>
  )
}

// Dashboard View Component
function DashboardView({ workouts, setActiveView, setWorkouts, startWorkout }) {
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
      let textContent = '# Workout Timer Pro - Exported Workouts\n\n'
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
      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="heading heading-4 mb-4">Quick Actions</h2>
        
        {/* Status Message */}
        {importStatus && (
          <div className="mb-4 p-3 bg-accent-primary/20 border border-accent-primary/30 rounded-lg">
            <p className="body-small text-accent-primary">{importStatus}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Button 
            className="btn btn-primary"
            onClick={() => setActiveView('create')}
          >
            <Plus className="w-4 h-4" />
            Create Workout
          </Button>
          
          <label className="btn cursor-pointer">
            <Upload className="w-4 h-4" />
            Import JSON
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
          
          <Button 
            className="btn"
            onClick={handleExportJSON}
            disabled={workouts.length === 0}
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          
          <Button 
            className="btn"
            onClick={handleExportText}
            disabled={workouts.length === 0}
          >
            <Download className="w-4 h-4" />
            Export Text
          </Button>
        </div>
        
        {/* Additional Actions */}
        {workouts.length > 0 && (
          <div className="border-t border-glass-border pt-4">
            <Button 
              className="btn text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              onClick={handleClearAllWorkouts}
            >
              Clear All Workouts
            </Button>
          </div>
        )}
      </div>

      {/* Workouts List */}
      <div className="glass-card p-6">
        <h2 className="heading heading-4 mb-4">Your Workouts</h2>
        
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-glass-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-accent-primary" />
            </div>
            <h3 className="heading heading-5 mb-2">No workouts yet</h3>
            <p className="body-base text-muted-foreground mb-4">
              Create your first workout to get started with your fitness journey.
            </p>
            <Button 
              className="btn btn-primary"
              onClick={() => setActiveView('create')}
            >
              <Plus className="w-4 h-4" />
              Create Your First Workout
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {workouts.map((workout, index) => (
              <WorkoutCard 
                key={index} 
                workout={workout} 
                onStart={() => startWorkout(workout)}
                onEdit={() => setActiveView('create')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-accent-primary mb-1">
            {workouts.length}
          </div>
          <div className="body-small text-muted-foreground">Total Workouts</div>
        </div>
        
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-accent-primary mb-1">
            {workouts.reduce((total, workout) => total + (workout.exercises?.length || 0), 0)}
          </div>
          <div className="body-small text-muted-foreground">Total Exercises</div>
        </div>
        
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-accent-primary mb-1">0</div>
          <div className="body-small text-muted-foreground">Completed Sessions</div>
        </div>
      </div>
    </div>
  )
}

// Workout Card Component
function WorkoutCard({ workout, onStart, onEdit }) {
  const totalExercises = workout.exercises?.length || 0
  const estimatedTime = workout.exercises?.reduce((total, exercise) => {
    const setTime = (exercise.duration || 30) * exercise.sets
    const restTime = (exercise.restBetweenSets || 30) * (exercise.sets - 1)
    const exerciseRest = exercise.restBetweenExercises || 60
    return total + setTime + restTime + exerciseRest
  }, 0) || 0

  return (
    <div className="glass-card p-4 hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="heading heading-5 mb-1">{workout.name || 'Untitled Workout'}</h3>
          <p className="body-small text-muted-foreground">
            {totalExercises} exercises • ~{Math.round(estimatedTime / 60)} min
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="btn btn-primary" onClick={onStart}>
            <Play className="w-4 h-4" />
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
                <span>{exercise.name}</span>
                <span className="text-muted-foreground">
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
  )
}

// Create Workout View Component
function CreateWorkoutView({ setActiveView, workouts, setWorkouts }) {
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState([])
  const [editingIndex, setEditingIndex] = useState(-1)

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

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name')
      return
    }
    if (exercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      exercises: exercises.filter(ex => ex.name.trim()),
      createdAt: new Date().toISOString()
    }

    setWorkouts([...workouts, newWorkout])
    setActiveView('dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading heading-3">Create New Workout</h2>
          <div className="flex gap-3">
            <Button className="btn" onClick={() => setActiveView('dashboard')}>
              Cancel
            </Button>
            <Button className="btn btn-primary" onClick={saveWorkout}>
              Save Workout
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
          <h3 className="heading heading-4">Exercises ({exercises.length})</h3>
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
              <ExerciseCard
                key={index}
                exercise={exercise}
                index={index}
                isEditing={editingIndex === index}
                onEdit={() => setEditingIndex(index)}
                onSave={() => setEditingIndex(-1)}
                onRemove={() => removeExercise(index)}
                onUpdate={(field, value) => updateExercise(index, field, value)}
              />
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
function ExerciseCard({ exercise, index, isEditing, onEdit, onSave, onRemove, onUpdate }) {
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
    <div className="glass-card p-4 hover:scale-[1.01] transition-transform cursor-pointer" onClick={onEdit}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="heading heading-5 mb-1">
            {exercise.name || `Exercise ${index + 1}`}
          </h4>
          <div className="flex flex-wrap gap-4 body-small text-muted-foreground">
            <span>
              {exercise.sets} sets × {exercise.type === 'reps' ? `${exercise.reps} reps` : `${exercise.duration}s`}
            </span>
            <span>Rest: {exercise.restBetweenSets}s between sets</span>
            <span>Rest after: {exercise.restBetweenExercises}s</span>
          </div>
          {exercise.mediaUrl && (
            <div className="mt-2">
              <span className="body-xs text-accent-primary">📹 Media attached</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <Button className="btn p-2" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            Edit
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
              <img 
                src={currentExercise.mediaUrl} 
                alt={`${currentExercise.name} demonstration`}
                className="max-w-full max-h-48 mx-auto rounded-lg"
                onError={(e) => { e.target.style.display = 'none' }}
              />
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

