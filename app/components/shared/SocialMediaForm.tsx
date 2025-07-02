import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Plus, X, Instagram, Youtube, Twitter, Music } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialMediaFormProps {
  socialLinks: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

const SOCIAL_PLATFORMS = [
  { key: "spotify", name: "Spotify", icon: Music, placeholder: "https://open.spotify.com/artist/..." },
  { key: "youtube", name: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@..." },
  { key: "instagram", name: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
  { key: "twitter", name: "X (Twitter)", icon: Twitter, placeholder: "https://twitter.com/..." },
];

export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  socialLinks,
  onChange
}) => {
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addLink = () => {
    if (newPlatform && newUrl && !socialLinks.find(link => link.platform === newPlatform)) {
      const newLink = { platform: newPlatform, url: newUrl.trim() };
      onChange([...socialLinks, newLink]);
      setNewPlatform("");
      setNewUrl("");
    }
  };

  const removeLink = (platform: string) => {
    onChange(socialLinks.filter(link => link.platform !== platform));
  };

  const updateLink = (platform: string, url: string) => {
    onChange(socialLinks.map(link => 
      link.platform === platform ? { ...link, url: url.trim() } : link
    ));
  };

  const getPlatformInfo = (platform: string) => {
    return SOCIAL_PLATFORMS.find(p => p.key === platform);
  };

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    platform => !socialLinks.find(link => link.platform === platform.key)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Links */}
        {socialLinks.map((link) => {
          const platformInfo = getPlatformInfo(link.platform);
          const IconComponent = platformInfo?.icon || Music;
          
          return (
            <div key={link.platform} className="flex items-center gap-3 p-3 border rounded-lg">
              <IconComponent className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <Label className="text-sm font-medium">{platformInfo?.name || link.platform}</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(link.platform, e.target.value)}
                  placeholder={platformInfo?.placeholder || "Enter URL"}
                  className="mt-1"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeLink(link.platform)}
                className="h-8 w-8 p-0"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        {/* Add New Link */}
        {availablePlatforms.length > 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Add Social Media Link</Label>
                <div className="flex gap-2 mt-2">
                  {availablePlatforms.map((platform) => (
                    <Badge
                      key={platform.key}
                      variant={newPlatform === platform.key ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setNewPlatform(platform.key)}
                    >
                      <platform.icon className="h-3 w-3 mr-1" />
                      {platform.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {newPlatform && (
                <div className="space-y-2">
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder={getPlatformInfo(newPlatform)?.placeholder || "Enter URL"}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addLink} disabled={!newUrl.trim()} type="button">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Link
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setNewPlatform("");
                        setNewUrl("");
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {socialLinks.length === 0 && availablePlatforms.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            All social media platforms have been added.
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
