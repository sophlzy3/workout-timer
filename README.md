# Workout Timer Pro 🏋️

A modern, full-featured workout timer application with beautiful glassmorphism design. Built with React, Vite, and Tailwind CSS.

## ✨ Features

### 🎯 Core Functionality
- **Workout Creation**: Create custom workouts with multiple exercises
- **Timer System**: Automatic timing for duration-based exercises
- **Repetition Tracking**: Manual completion for rep-based exercises
- **Rest Periods**: Configurable rest times between sets and exercises
- **Live Workout Mode**: Real-time workout tracking with phase transitions

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effects
- **Dark/Light Theme**: Toggle between themes
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Fluid transitions and hover effects
- **Fullscreen Exercise View**: Detailed exercise information in overlay

### 📊 Workout Management
- **Import/Export**: JSON and text format support
- **Workout Library**: Save and organize multiple workouts
- **Exercise Details**: Comprehensive exercise information tracking
- **Progress Tracking**: Monitor workout completion statistics

### 🔧 Advanced Features
- **Collapsible Sections**: Clean, organized interface
- **Export Options**: Individual workout and bulk export
- **Media Support**: Add URLs for exercise demonstrations
- **Keyboard Shortcuts**: Efficient navigation and control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/workout-timer-pro.git
   cd workout-timer-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📱 Usage

### Creating a Workout
1. Click "Create Workout" in the Quick Actions section
2. Enter a workout name
3. Add exercises with the "Add Exercise" button
4. Configure each exercise:
   - **Name**: Exercise name
   - **Type**: Repetitions or Duration
   - **Sets**: Number of sets
   - **Reps/Duration**: Target reps or time per set
   - **Rest Times**: Rest between sets and after exercise
   - **Media URL**: Optional link to exercise demonstration

### Starting a Workout
1. From the dashboard, click "Start" on any workout card
2. The workout begins with a 5-second warmup
3. Follow the on-screen prompts for each phase:
   - **Exercise Phase**: Complete the exercise
   - **Rest Phase**: Take your rest period
   - **Complete**: Workout finished!

### Managing Workouts
- **Edit**: Click "Edit" on any workout card
- **Export**: Use the dropdown menu on workout cards to export individual workouts
- **Bulk Export**: Use Quick Actions to export all workouts
- **Import**: Use Quick Actions to import workout files

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
pnpm build
```

### Preview Production Build
```bash
npm run preview
# or
pnpm preview
```

### Docker Deployment
```bash
# Build Docker image
docker build -t workout-timer-pro .

# Run container
docker run -p 3000:80 workout-timer-pro
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design works on all devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Glassmorphism Design**: Inspired by modern UI trends
- **React Community**: For the amazing ecosystem
- **Tailwind CSS**: For the utility-first approach
- **Lucide Icons**: For the beautiful icon set

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Made with ❤️ for fitness enthusiasts everywhere** 