# Shanna's Spotify Dashboard

A beautiful, interactive pink-themed dashboard to visualize and analyze your Spotify streaming history data.

## Features

- 📊 **Interactive Charts**: Top artists, top tracks, listening trends, platform breakdown, and time heatmap
- 🎨 **Pink Theme**: Beautiful pink color scheme with gradients and animations
- 🔍 **Advanced Filtering**: Filter by date range, artist, platform, and quick time periods
- 📈 **Statistics**: Total listening time, tracks played, unique artists/albums, and more
- ⚡ **Fast & Responsive**: Built with React and Vite for optimal performance

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Spotify Data Files

**Important:** Your personal Spotify data is NOT included in this repository for privacy reasons. You need to add your own data files.

**How to Get Your Data:**
1. Go to https://www.spotify.com/account/privacy/
2. Scroll down and click "Request your data"
3. Select "Extended streaming history" and submit your request
4. Wait for Spotify to email you (may take a few days)
5. Download and extract the ZIP file they send you

**Copy Your Data Files:**
1. Navigate to the extracted folder and find the `Streaming_History_Audio` folder
2. Copy ALL the JSON files (they'll be named like `Streaming_History_Audio_2016-2020_0.json`, etc.)
3. Paste them into the `public/data/` folder in this project

The app will automatically load all JSON files that match the pattern `Streaming_History_Audio_*.json`

### 3. Start the Development Server

```bash
npm run dev
```

The dashboard will open automatically in your browser at `http://localhost:3000`

## Project Structure

```
shanna-spotify/
├── public/
│   ├── data/              # Place your JSON files here
│   └── spotify-logo.svg
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.jsx
│   │   ├── StatsCard.jsx
│   │   ├── TopArtistsChart.jsx
│   │   ├── TopTracksChart.jsx
│   │   ├── ListeningTrendsChart.jsx
│   │   ├── PlatformChart.jsx
│   │   ├── TimeHeatmap.jsx
│   │   ├── FilterButtons.jsx
│   │   └── DateRangeFilter.jsx
│   ├── utils/            # Utility functions
│   │   ├── dataLoader.js
│   │   ├── dataProcessor.js
│   │   └── formatters.js
│   ├── styles/           # CSS styles
│   │   ├── App.css
│   │   └── components.css
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Usage

1. **Quick Filters**: Use the buttons at the top to quickly filter by time period (All Time, Last 7 Days, Last 30 Days, Last Year)

2. **Date Range**: Use the date pickers to select a custom date range

3. **Artist Search**: Type an artist name in the search box to filter by that artist

4. **Platform Filter**: Select a specific platform to see data for that device only

5. **Trend Period**: Change the period for the listening trends chart (Day, Week, Month, Year)

6. **Interactive Charts**: Hover over chart elements to see detailed tooltips

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deploy to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Initial Setup

1. **Create the GitHub repository** (if you haven't already):
   - Go to https://github.com/new
   - Create a new repository (e.g., `shanna-spotify-dashboard`)
   - **Do not** initialize with README, .gitignore, or license

2. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy your site

4. **Access your site**:
   - After the first deployment completes, your site will be available at:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - You can find the exact URL in the repository **Settings** → **Pages**

### Automatic Deployment

Every time you push to the `main` branch, GitHub Actions will:
- Build your app
- Deploy it to GitHub Pages
- Your site will be updated automatically

**Note:** The first deployment may take a few minutes. You can check the deployment status in the **Actions** tab of your repository.

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Chart library
- **date-fns** - Date manipulation
- **CSS3** - Styling with pink theme

## Notes

- The app filters out podcasts and episodes, focusing only on music tracks
- Large datasets may take a moment to load initially
- All data is processed locally in your browser - nothing is sent to any server

Enjoy exploring your Spotify listening habits! 🎵
