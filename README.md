# Kodflix

A React frontend that fetches movie data from [The Movie Database (TMDB)](https://www.themoviedb.org/) and displays it in a Netflix-style landing page: dark theme, horizontal rows, poster tiles with titles and badges.

## Setup

1. **Install dependencies**

   ```bash
   cd c:\Users\karee\Desktop\Kodflix
   npm install
   ```

2. **Environment**

   The app uses the TMDB API key from `.env`. Ensure `.env` exists with:

   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

   (A key is already set in the project.)

## Run the app

From the project root:

```bash
cd c:\Users\karee\Desktop\Kodflix
npm run dev
```

Then open the URL shown in the terminal (e.g. **http://localhost:5173/**) in your browser.

## Verify

- **Data:** Open DevTools → Network, filter by “Fetch/XHR”. You should see requests to `api.themoviedb.org` (e.g. `/movie/popular`, `/movie/now_playing`, `/trending/movie/day`) returning 200 and JSON with `results` arrays.
- **UI:** You should see three horizontal rows (“Popular”, “Now in Theaters”, “Trending Today”), each with poster images, “NETFLIX” badge on posters, titles below, and “NEW” on recent releases. Dark background (#141414), horizontal scroll per row, vertical scroll for the page.

## Build for production

```bash
npm run build
npm run preview
```

## Tech

- React 19 + Vite 7
- TMDB API: popular, now playing, trending movies
- Poster images: `https://image.tmdb.org/t/p/w500`
