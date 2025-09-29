// Import StrictMode from React.
// StrictMode is a wrapper that helps highlight potential problems in an app.
// It runs extra checks and warnings in development mode (not in production).
import { StrictMode } from 'react'

// Import createRoot from React DOM.
// This is the modern API (since React 18) to create a root where React will render the app.
import { createRoot } from 'react-dom/client'

// import { MyAwesomeApp } from './MyAwesomeApp'

// Import the component that we want to render as the main entry point.
import { FirstStepsApp } from './FirstStepsApp'

// Create a root in the DOM where the React app will be mounted.
// "document.getElementById('root')" looks for the <div id="root"></div> in index.html.
// The "!" (non-null assertion operator in TypeScript) tells the compiler that
// we are sure this element exists and is not null.
createRoot(document.getElementById('root')!).render(
  // StrictMode wraps around the entire application.
  // This ensures extra checks and warnings during development.
  <StrictMode>
    {/* Render the component inside the root element */}
    <FirstStepsApp />
  </StrictMode>,
)
