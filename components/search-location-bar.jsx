"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Loader2 } from "lucide-react";
import { State, City } from "country-state-city";
import { format } from "date-fns";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import { getCategoryIcon } from "@/lib/data";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

export default function SearchLocationBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: currentUser } = useConvexQuery(
    api.users.getCurrentUser
  );

  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnboarding
  );

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const initialState = currentUser?.location?.state || "";
  const initialCity = currentUser?.location?.city || "";

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value), 400)
  ).current;

  const cities = useMemo(() => {
    const stateToUse = selectedState || initialState;
    if (!stateToUse) return [];

    const state = indianStates.find((s) => s.name === stateToUse);
    if (!state) return [];

    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, initialState, indianStates]);

  const handleEventClick = (slug) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/events/${slug}`);
  };

  const handleLocationSelect = async (city, state) => {
    try {
      if (currentUser?.interests) {
        await updateLocation({
          location: { city, state, country: "India" },
          interests: currentUser.interests,
        });
      }
      const slug = createLocationSlug(city, state);
      router.push(`/explore/${slug}`);
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    debouncedSetQuery(val);

    if (val.length >= 2) setShowSearchResults(true);
    else setShowSearchResults(false);
  };

  const { data: searchResults, isLoading: searchLoading } =
    useConvexQuery(
      api.search.searchResult,
      searchQuery.trim().length >= 2
        ? { query: searchQuery, limit: 5 }
        : "skip"
    );

  const stateValue = selectedState || initialState;
  const cityValue = selectedCity || initialCity;

  return (
    <div className="flex items-center">
      {/* Search Bar */}
      <div className="relative flex w-full" ref={searchRef}>
        <div className="flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            onChange={handleSearchInput}
            onFocus={() => {
              if (searchQuery.length >= 2)
                setShowSearchResults(true);
            }}
            className="pl-10 w-full h-9 rounded-none rounded-l-md"
          />
        </div>

        {showSearchResults && (
          <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((event) => (
                <Button
                  key={event._id}
                  onClick={() => handleEventClick(event.slug)}
                  className="w-full h-15 px-4 py-3 hover:bg-violet-200 hover:scale-[1.02] hover:shadow-md text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {getCategoryIcon(event.category)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2">
                        {event.title}
                      </p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(event.startDate, "MMM dd")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.city}
                        </span>
                      </div>
                    </div>
                    {event.ticketType === "free" && (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </div>
                </Button>
              ))
            ) : (
              <div className="p-2 text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* State Select */}
      <Select
        value={stateValue}
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedCity("");
        }}
      >
        <SelectTrigger className="w-32 h-9 border-l-0 rounded-none">
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          {indianStates.map((state) => (
            <SelectItem key={state.isoCode} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Select */}
      <Select
        value={cityValue}
        onValueChange={(value) => {
          setSelectedCity(value);
          if (value && stateValue) {
            handleLocationSelect(value, stateValue);
          }
        }}
        disabled={!stateValue}
      >
        <SelectTrigger className="w-32 h-9 rounded-none rounded-r-md">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
