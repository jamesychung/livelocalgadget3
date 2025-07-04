import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  genreFilter: string[];
  handleGenreFilter: (genre: string, checked: boolean) => void;
  availableGenres: string[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  genreFilter,
  handleGenreFilter,
  availableGenres
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search">Search Musicians</Label>
            <Input
              id="search"
              placeholder="Search by name, location, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label>Filter by Genre</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableGenres.slice(0, 8).map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={genreFilter.includes(genre)}
                    onCheckedChange={(checked) => 
                      handleGenreFilter(genre, checked as boolean)
                    }
                  />
                  <Label htmlFor={genre} className="text-sm">{genre}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 