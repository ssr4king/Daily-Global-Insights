import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { categories } from "@shared/schema";

function Router() {
  return (
    <Switch>
      {/* Main Home Page */}
      <Route path="/">
        <Home />
      </Route>

      {/* Category Pages */}
      {categories.map((category) => (
        <Route key={category} path={`/${category}`}>
          <Home category={category} />
        </Route>
      ))}

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
