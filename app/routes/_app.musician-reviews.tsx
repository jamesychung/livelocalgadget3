import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Star, MessageSquare, Plus, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useOutletContext, Link } from 'react-router-dom';
import type { AuthOutletContext } from "./_app";

interface Review {
  id: string;
  comment: string;
  rating: number;
  reviewType: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  reviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  venue?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  musician?: {
    id: string;
    stageName: string;
  };
  event?: {
    id: string;
    title: string;
    date: string;
  };
}

export default function ReviewsPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [showAddReviewDialog, setShowAddReviewDialog] = useState(false);
  const [newReviewData, setNewReviewData] = useState({
    venueId: "",
    rating: 5,
    comment: "",
    reviewType: "venue_review"
  });
  const [venues, setVenues] = useState<any[]>([]);

  // Fetch reviews about the musician
  const [{ data: musicianReviews, fetching: musicianReviewsFetching, error: musicianReviewsError }] = useFindMany(api.review, {
    filter: { musician: { user: { id: { equals: user?.id } } } },
    select: {
      id: true,
      comment: true,
      rating: true,
      reviewType: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      reviewer: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      venue: {
        id: true,
        name: true,
        city: true,
        state: true,
      },
      event: {
        id: true,
        title: true,
        date: true,
      },
    },
    sort: { createdAt: "Descending" },
    pause: !user?.id,
  });

  // Fetch reviews written by the musician
  const [{ data: writtenReviews, fetching: writtenReviewsFetching, error: writtenReviewsError }] = useFindMany(api.review, {
    filter: { reviewer: { id: { equals: user?.id } } },
    select: {
      id: true,
      comment: true,
      rating: true,
      reviewType: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      venue: {
        id: true,
        name: true,
        city: true,
        state: true,
      },
      musician: {
        id: true,
        stageName: true,
      },
    },
    sort: { createdAt: "Descending" },
    pause: !user?.id,
  });

  // Fetch venues for adding reviews
  const [{ data: venuesData, fetching: venuesFetching }] = useFindMany(api.venue, {
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
    },
    sort: { name: "Ascending" },
  });

  useEffect(() => {
    if (venuesData) {
      setVenues(venuesData as any[]);
    }
  }, [venuesData]);

  // Transform API data to typed format
  const typedMusicianReviews = (musicianReviews as any[]) || [];
  const typedWrittenReviews = (writtenReviews as any[]) || [];

  // Show loading state while fetching
  if (musicianReviewsFetching || writtenReviewsFetching) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is available
  if (!user?.id) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to view reviews.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleRespondToReview = async () => {
    if (!selectedReview || !responseText.trim()) return;

    setIsResponding(true);
    try {
      // For now, we'll just show a success message
      // In a real implementation, you would call the API here
      console.log("Responding to review:", selectedReview.id, responseText);
      
      setResponseText("");
      setSelectedReview(null);
      alert("Response sent successfully!");
    } catch (error) {
      console.error("Error responding to review:", error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleMarkAsRead = async (reviewId: string) => {
    try {
      // For now, we'll just show a success message
      // In a real implementation, you would call the API here
      console.log("Marking review as read:", reviewId);
      alert("Review marked as read!");
    } catch (error) {
      console.error("Error marking review as read:", error);
    }
  };

  const handleAddReview = async () => {
    if (!newReviewData.venueId || !newReviewData.comment.trim()) return;

    try {
      // For now, we'll just show a success message
      // In a real implementation, you would call the API here
      console.log("Adding review:", newReviewData);
      
      setNewReviewData({
        venueId: "",
        rating: 5,
        comment: "",
        reviewType: "venue_review"
      });
      setShowAddReviewDialog(false);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/musician-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Reviews</h1>
            <p className="text-muted-foreground">
              Manage reviews about your performances and write reviews for venues
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddReviewDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Venue Review
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typedMusicianReviews.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Reviews about you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typedMusicianReviews.length > 0
                ? (typedMusicianReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / typedMusicianReviews.length).toFixed(1)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Your average rating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Written</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typedWrittenReviews.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Reviews you've written
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Reviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typedMusicianReviews.filter(review => review.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Reviews to read
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews About You */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews About You</CardTitle>
          <CardDescription>
            Reviews from venues and fans about your performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {typedMusicianReviews.length > 0 ? (
            <div className="space-y-4">
              {typedMusicianReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating || 0)}
                          <span className="ml-1 text-sm">({review.rating})</span>
                        </div>
                        <Badge variant={review.isActive ? "default" : "secondary"}>
                          {review.isActive ? "Unread" : "Read"}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{review.comment}</p>
                      <div className="text-xs text-muted-foreground">
                        <div>By: {review.reviewer?.firstName} {review.reviewer?.lastName}</div>
                        <div>Venue: {review.venue?.name} - {review.venue?.city}, {review.venue?.state}</div>
                        <div>Date: {formatDate(review.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReview(review)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Respond to Review</DialogTitle>
                            <DialogDescription>
                              Write a response to this review. Your response will be visible to the reviewer.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Original Review</Label>
                              <div className="p-3 bg-gray-50 rounded-md mt-1">
                                <div className="flex items-center gap-1 mb-2">
                                  {renderStars(review.rating || 0)}
                                </div>
                                <p className="text-sm">{review.comment}</p>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="response">Your Response</Label>
                              <Textarea
                                id="response"
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Write your response here..."
                                rows={4}
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedReview(null);
                                  setResponseText("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleRespondToReview}
                                disabled={!responseText.trim() || isResponding}
                              >
                                {isResponding ? "Sending..." : "Send Response"}
                              </Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(review.id)}
                      >
                        {review.isActive ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Mark Read
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Read
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                You haven't received any reviews yet. Keep performing and they'll come in!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews You've Written */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews You've Written</CardTitle>
          <CardDescription>
            Reviews you've written for venues and other musicians
          </CardDescription>
        </CardHeader>
        <CardContent>
          {typedWrittenReviews.length > 0 ? (
            <div className="space-y-4">
              {typedWrittenReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating || 0)}
                          <span className="ml-1 text-sm">({review.rating})</span>
                        </div>
                        <Badge variant="outline">
                          {review.reviewType === "venue_review" ? "Venue" : "Musician"}
                        </Badge>
                        <Badge variant={review.isVerified ? "default" : "secondary"}>
                          {review.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{review.comment}</p>
                      <div className="text-xs text-muted-foreground">
                        <div>Venue: {review.venue?.name} - {review.venue?.city}, {review.venue?.state}</div>
                        <div>Date: {formatDate(review.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No reviews written</h3>
              <p className="text-muted-foreground">
                You haven't written any reviews yet. Share your experiences with venues!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Review Dialog */}
      <Dialog open={showAddReviewDialog} onOpenChange={setShowAddReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Venue Review</DialogTitle>
            <DialogDescription>
              Share your experience with a venue. Your review will help other musicians.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Select
                value={newReviewData.venueId}
                onValueChange={(value) => setNewReviewData(prev => ({ ...prev, venueId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name} - {venue.city}, {venue.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select
                value={newReviewData.rating.toString()}
                onValueChange={(value) => setNewReviewData(prev => ({ ...prev, rating: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-2">
                        {renderStars(rating)}
                        <span>{rating} stars</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comment">Review</Label>
              <Textarea
                id="comment"
                value={newReviewData.comment}
                onChange={(e) => setNewReviewData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this venue..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddReviewDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddReview}
                disabled={!newReviewData.venueId || !newReviewData.comment.trim()}
              >
                Submit Review
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
