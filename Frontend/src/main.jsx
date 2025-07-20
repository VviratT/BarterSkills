import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext";
import ResponsiveDrawer from "./components/ResponsiveDrawer.jsx";
import { CustomThemeProvider } from "./context/ThemeContext.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <SocketProvider>
              <ResponsiveDrawer>
                <App />
              </ResponsiveDrawer>
            </SocketProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </CustomThemeProvider>
  </React.StrictMode>
);
