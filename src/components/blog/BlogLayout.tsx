'use client';

import { useState, useTransition, useMemo } from 'react';
import type { Post } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/blog/PostCard';
import { Tag } from '@/components/blog/Tag';
import { intelligentSearch } from '@/ai/flows/intelligent-search';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';

const POSTS_PER_PAGE = 6;

type BlogLayoutProps = {
  initialPosts: Post[];
  allTags: string[];
};

export function BlogLayout({ initialPosts, allTags }: BlogLayoutProps) {
  const [allPosts] = useState<Post[]>(initialPosts);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>(initialPosts.slice(0, POSTS_PER_PAGE));
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const [isSearching, startSearchTransition] = useTransition();
  const { toast } = useToast();

  const filteredPosts = useMemo(() => {
    if (!activeTag) return allPosts;
    return allPosts.filter(post => post.tags.includes(activeTag));
  }, [activeTag, allPosts]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      handleTagClick(activeTag);
      return;
    }

    startSearchTransition(async () => {
      try {
        const relevanceChecks = await Promise.all(
          allPosts.map(post =>
            intelligentSearch({
              searchTerm,
              postTitle: post.title,
              postTags: post.tags,
            }).then(result => ({ ...post, isRelevant: result.isRelevant }))
          )
        );

        const relevantPosts = relevanceChecks.filter(p => p.isRelevant);
        setActiveTag(null);
        setDisplayedPosts(relevantPosts);
        setVisibleCount(relevantPosts.length);

        if(relevantPosts.length === 0) {
            toast({ title: "No results", description: `AI search found no matches for "${searchTerm}".`});
        }
      } catch (error) {
        console.error('AI search failed:', error);
        toast({
          title: 'Search Error',
          description: 'Could not perform AI search. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setSearchTerm('');
    const newFilteredPosts = tag ? allPosts.filter(post => post.tags.includes(tag)) : allPosts;
    setDisplayedPosts(newFilteredPosts.slice(0, POSTS_PER_PAGE));
    setVisibleCount(POSTS_PER_PAGE);
  };
  
  const loadMorePosts = () => {
    const newVisibleCount = visibleCount + POSTS_PER_PAGE;
    setDisplayedPosts(filteredPosts.slice(0, newVisibleCount));
    setVisibleCount(newVisibleCount);
  };

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Welcome to the Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles on Tech, Design, Travel, and more. Use the AI-powered search to find exactly what you're looking for.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-8 flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="AI-powered search for posts..."
            className="pl-10 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isSearching}
          />
        </div>
        <Button type="submit" size="lg" disabled={isSearching}>
          {isSearching ? <Loader2 className="animate-spin" /> : 'Search'}
        </Button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Tag tag="All" isActive={activeTag === null} onClick={() => handleTagClick(null)} />
        {allTags.map(tag => (
          <Tag key={tag} tag={tag} isActive={tag === activeTag} onClick={() => handleTagClick(tag)} />
        ))}
      </div>

      {isSearching && (
        <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-2">AI is searching...</p>
        </div>
      )}

      {!isSearching && displayedPosts.length === 0 && (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-2xl font-headline font-semibold">No Posts Found</h3>
            <p className="text-muted-foreground mt-2">
              {activeTag 
                ? `There are no posts with the tag "${activeTag}".`
                : "Try a different search or select another tag."
              }
            </p>
         </div>
      )}

      {!isSearching && displayedPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {!isSearching && visibleCount < filteredPosts.length && (
        <div className="text-center mt-12">
          <Button onClick={loadMorePosts} size="lg" variant="outline">
            Load More Posts
          </Button>
        </div>
      )}
    </>
  );
}
