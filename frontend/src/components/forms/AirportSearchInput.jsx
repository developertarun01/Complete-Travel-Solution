import React, { useState, useRef, useEffect } from "react";
import { Search, Plane, MapPin, Loader, X } from "lucide-react";
import airportSearchService from "../../services/airportSearchService";

const AirportSearchInput = ({
  name,
  value,
  onChange,
  placeholder = "Search airport or city...",
  required = false,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const searchLocations = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await airportSearchService.searchLocations(searchTerm);
        setSuggestions(results);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedLocation(null);

    // If user clears input or selects a valid airport code, update form
    if (value.length === 3 && /^[A-Za-z]{3}$/.test(value)) {
      onChange(name, value.toUpperCase());
    } else if (value.length === 0) {
      onChange(name, "");
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setSearchTerm(location.code);
    onChange(name, location.code);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (selectedLocation) {
      setSearchTerm(selectedLocation.code);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedLocation(null);
    onChange(name, "");
    inputRef.current?.focus();
  };

  const getDisplayValue = () => {
    if (selectedLocation) {
      return selectedLocation.code;
    }
    return searchTerm;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 ${className}`}
          required={required}
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}

          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {suggestions.length === 0 && !isLoading ? (
            <div className="p-3 text-gray-500 text-sm text-center">
              No locations found for "{searchTerm}"
            </div>
          ) : (
            <div className="py-2">
              {suggestions.map((location, index) => {
                const display = airportSearchService.getDisplayLabel(location);
                return (
                  <button
                    key={`${location.id}-${index}`}
                    type="button"
                    onClick={() => handleSelectLocation(location)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {location.type === "city" ? (
                          <MapPin className="h-4 w-4 text-green-500" />
                        ) : (
                          <Plane className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 truncate">
                            {display.primary}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                location.type === "city"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {location.type}
                            </span>
                            {display.isRealData && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                🌐 Live
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 truncate">
                          {display.secondary}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-t text-xs text-gray-500">
              {suggestions.length} locations found • Search by airport code,
              name, or city
            </div>
          )}
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && !isOpen && (
        <div className="mt-1 text-xs text-gray-600 flex items-center">
          {selectedLocation.type === "city" ? (
            <MapPin className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <Plane className="h-3 w-3 mr-1 text-blue-500" />
          )}
          <span className="truncate">
            {airportSearchService.formatLocation(selectedLocation)}
          </span>
        </div>
      )}
    </div>
  );
};

export default AirportSearchInput;
